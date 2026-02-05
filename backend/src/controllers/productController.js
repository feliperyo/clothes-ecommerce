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
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
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

    res.json(products);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos em destaque' });
  }
};

// GET /api/products/category/:category - Por categoria
const getProductsByCategory = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { category } = req.params;

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        category
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos por categoria' });
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

    res.json(products);
  } catch (error) {
    console.error('Error fetching promotion products:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos em promoção' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getFeaturedProducts,
  getProductsByCategory,
  getPromotionProducts
};
