// Função helper para obter prisma em runtime
const getPrisma = () => global.prisma;

// GET /api/products - Lista produtos ativos
const getAllProducts = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { category, featured, search } = req.query;

    const where = {
      isActive: true,
      ...(category && { category }),
      ...(featured === 'true' && { isFeatured: true }),
      ...(search && {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } }
        ]
      })
    };

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json(products || []);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json([]);
  }
};

// GET /api/products/:id - Detalhes do produto
const getProductById = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!product || !product.isActive) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
};

// GET /api/products/featured - Produtos em destaque
const getFeaturedProducts = async (req, res) => {
  try {
    const prisma = getPrisma();
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true
      },
      orderBy: { createdAt: 'desc' },
      take: 8
    });

    res.json(products || []);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json([]);
  }
};

// GET /api/products/category/:category - Por categoria (suporta múltiplas categorias separadas por vírgula)
const getProductsByCategory = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { category } = req.params;

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        category: { contains: category }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(products || []);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json([]);
  }
};

// GET /api/products/promotions - Produtos em promoção
const getPromotionProducts = async (req, res) => {
  try {
    const prisma = getPrisma();
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isPromotion: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(products || []);
  } catch (error) {
    console.error('Error fetching promotion products:', error);
    res.status(500).json([]);
  }
};

// GET /api/products/new - Lançamentos (marcados manualmente)
const getNewProducts = async (req, res) => {
  try {
    const prisma = getPrisma();
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isNew: true
      },
      orderBy: { createdAt: 'desc' },
      take: 8
    });

    res.json(products || []);
  } catch (error) {
    console.error('Error fetching new products:', error);
    res.status(500).json([]);
  }
};

// GET /api/products/presale - Produtos em pré-venda
const getPreSaleProducts = async (req, res) => {
  try {
    const prisma = getPrisma();
    const products = await prisma.product.findMany({
      where: { isActive: true, isPreSale: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(products || []);
  } catch (error) {
    console.error('Error fetching pre-sale products:', error);
    res.status(500).json([]);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getFeaturedProducts,
  getProductsByCategory,
  getPromotionProducts,
  getNewProducts,
  getPreSaleProducts
};
