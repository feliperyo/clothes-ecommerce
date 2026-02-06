const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const products = [
  {
    name: "Blusa Ciganinha Floral",
    description: "Blusa ciganinha em tecido leve com estampa floral delicada. Alças ajustáveis e elástico na cintura para perfeito caimento.",
    price: 129.90,
    discountPrice: 99.90,
    category: "Blusas",
    sizes: "G1,G2,G3,G4",
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=600",
    isFeatured: true,
    isPromotion: true
  },
  {
    name: "Vestido Longo Listrado",
    description: "Vestido longo em malha com listras verticais que alongam a silhueta. Decote V e fenda lateral.",
    price: 199.90,
    discountPrice: null,
    category: "Vestidos",
    sizes: "48,50,52,54,56",
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600",
    isFeatured: true,
    isPromotion: false
  },
  {
    name: "Calça Jeans Skinny Plus Size",
    description: "Calça jeans skinny com elastano para conforto. Cintura alta modeladora e bolsos traseiros estratégicos.",
    price: 179.90,
    discountPrice: 149.90,
    category: "Calças",
    sizes: "46,48,50,52,54,56,58",
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600",
    isFeatured: true,
    isPromotion: true
  }
];

// Endpoint para executar seed (apenas em produção com chave secreta)
router.post('/run', async (req, res) => {
  try {
    const { secret } = req.body;

    // Verificar chave secreta
    if (secret !== process.env.JWT_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('🌱 Starting seed via API...');

    // Limpar dados existentes
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.admin.deleteMany();

    console.log('✅ Cleared existing data');

    // Criar admin
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);

    const admin = await prisma.admin.create({
      data: {
        username: process.env.ADMIN_EMAIL || 'admin',
        password: hashedPassword
      }
    });

    console.log('✅ Admin created:', admin.username);

    // Criar produtos (apenas 3 para exemplo, você pode adicionar mais depois)
    for (const product of products) {
      await prisma.product.create({
        data: product
      });
    }

    console.log(`✅ Created ${products.length} products`);

    // Estatísticas
    const stats = {
      totalProducts: await prisma.product.count(),
      totalAdmins: await prisma.admin.count()
    };

    res.json({
      success: true,
      message: 'Seed completed successfully!',
      stats
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    res.status(500).json({
      error: 'Seed failed',
      message: error.message
    });
  }
});

module.exports = router;
