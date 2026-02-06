const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Função helper para obter prisma em runtime
const getPrisma = () => global.prisma;

// POST /api/admin/login - Login do admin
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const prisma = getPrisma();

    const admin = await prisma.admin.findUnique({
      where: { username }
    });

    if (!admin) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      admin: {
        id: admin.id,
        username: admin.username
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

// GET /api/admin/dashboard - Estatísticas
const getDashboard = async (req, res) => {
  try {
    const prisma = getPrisma();
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();
    const pendingOrders = await prisma.order.count({
      where: { paymentStatus: 'PENDING' }
    });
    const paidOrders = await prisma.order.findMany({
      where: { paymentStatus: 'PAID' }
    });
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);

    // Últimos pedidos
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // Produtos com baixo estoque
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: {
          lte: 5
        }
      },
      orderBy: { stock: 'asc' },
      take: 5
    });

    // Produtos mais vendidos (placeholder - requer analytics)
    const topProducts = [];

    res.json({
      totalProducts,
      totalOrders,
      pendingOrders,
      totalRevenue,
      recentOrders: recentOrders || [],
      lowStockProducts: lowStockProducts || [],
      topProducts: topProducts || []
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({
      totalProducts: 0,
      totalOrders: 0,
      pendingOrders: 0,
      totalRevenue: 0,
      recentOrders: [],
      lowStockProducts: [],
      topProducts: []
    });
  }
};

// --- PRODUTOS ---

// GET /api/admin/products - Lista todos produtos (incluindo inativos)
const getAllProductsAdmin = async (req, res) => {
  try {
    const prisma = getPrisma();
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(products || []);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json([]);
  }
};

// POST /api/admin/products - Criar produto
const createProduct = async (req, res) => {
  try {
    const prisma = getPrisma();
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      sizes,
      stock,
      isFeatured,
      isPromotion
    } = req.body;

    // Imagem vem do upload (req.file) ou URL externa (req.body.imageUrl)
    let imageUrl = req.body.imageUrl || '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        category,
        sizes,
        stock: parseInt(stock),
        imageUrl,
        isFeatured: isFeatured === 'true' || isFeatured === true,
        isPromotion: isPromotion === 'true' || isPromotion === true
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
};

// PUT /api/admin/products/:id - Editar produto
const updateProduct = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { id } = req.params;
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      sizes,
      stock,
      isFeatured,
      isPromotion,
      isActive
    } = req.body;

    // Preparar dados para atualização
    const data = {
      name,
      description,
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      category,
      sizes,
      stock: parseInt(stock),
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isPromotion: isPromotion === 'true' || isPromotion === true,
      isActive: isActive === 'true' || isActive === true || isActive === undefined
    };

    // Se nova imagem foi enviada, atualizar
    if (req.file) {
      data.imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      data.imageUrl = req.body.imageUrl;
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data
    });

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
};

// DELETE /api/admin/products/:id - Deletar produto
const deleteProduct = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { id } = req.params;

    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
};

// PATCH /api/admin/products/:id/featured - Toggle destaque
const toggleFeatured = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    const updated = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { isFeatured: !product.isFeatured }
    });

    res.json(updated);
  } catch (error) {
    console.error('Error toggling featured:', error);
    res.status(500).json({ error: 'Erro ao atualizar destaque' });
  }
};

// PATCH /api/admin/products/:id/promotion - Toggle promoção
const togglePromotion = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    const updated = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { isPromotion: !product.isPromotion }
    });

    res.json(updated);
  } catch (error) {
    console.error('Error toggling promotion:', error);
    res.status(500).json({ error: 'Erro ao atualizar promoção' });
  }
};

// --- PEDIDOS ---

// GET /api/admin/orders - Lista todos pedidos
const getAllOrders = async (req, res) => {
  try {
    const prisma = getPrisma();
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    res.json(orders || []);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json([]);
  }
};

// GET /api/admin/orders/:id - Detalhes do pedido
const getOrderById = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Erro ao buscar pedido' });
  }
};

// PATCH /api/admin/orders/:id/status - Atualizar status
const updateOrderStatus = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { id } = req.params;
    const { paymentStatus, shippingStatus } = req.body;

    const data = {};
    if (paymentStatus) data.paymentStatus = paymentStatus;
    if (shippingStatus) data.shippingStatus = shippingStatus;

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data
    });

    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Erro ao atualizar status' });
  }
};

// PATCH /api/admin/orders/:id/tracking - Adicionar código de rastreio
const updateTracking = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { id } = req.params;
    const { trackingCode } = req.body;

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        trackingCode,
        shippingStatus: 'SHIPPED'
      }
    });

    res.json(order);
  } catch (error) {
    console.error('Error updating tracking:', error);
    res.status(500).json({ error: 'Erro ao atualizar rastreio' });
  }
};

module.exports = {
  login,
  getDashboard,
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFeatured,
  togglePromotion,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateTracking
};
