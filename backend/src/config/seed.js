const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

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
  },
  {
    name: "Conjunto Moletom Elegante",
    description: "Conjunto de moletom premium com blusa cropped e calça jogger. Perfeito para o dia a dia.",
    price: 249.90,
    discountPrice: 199.90,
    category: "Conjuntos",
    sizes: "G0,G1,G2,G3",
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600",
    isFeatured: true,
    isPromotion: true
  },
  {
    name: "Blusa Manga Longa Renda",
    description: "Blusa em renda francesa com forro interno. Manga longa e detalhes sofisticados.",
    price: 159.90,
    discountPrice: null,
    category: "Blusas",
    sizes: "G1,G2,G3,G4,G5",
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1564859228273-274232fdb516?w=600",
    isFeatured: false,
    isPromotion: false
  },
  {
    name: "Vestido Midi Rodado",
    description: "Vestido midi com saia rodada e cinto marcação. Estampa exclusiva e tecido fluido.",
    price: 189.90,
    discountPrice: 159.90,
    category: "Vestidos",
    sizes: "48,50,52,54,56,58",
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600",
    isFeatured: false,
    isPromotion: true
  },
  {
    name: "Calça Pantalona Alfaiataria",
    description: "Calça pantalona em alfaiataria com cintura alta. Elegante e confortável para todas as ocasiões.",
    price: 169.90,
    discountPrice: null,
    category: "Calças",
    sizes: "46,48,50,52,54,56",
    stock: 45,
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600",
    isFeatured: false,
    isPromotion: false
  },
  {
    name: "Blusa Regata Básica (Pack 3)",
    description: "Kit com 3 blusas regata em algodão. Cores neutras: preto,branco e bege.",
    price: 89.90,
    discountPrice: 69.90,
    category: "Blusas",
    sizes: "G0,G1,G2,G3,G4",
    stock: 100,
    imageUrl: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600",
    isFeatured: true,
    isPromotion: true
  },
  {
    name: "Vestido Tubinho Executivo",
    description: "Vestido tubinho em neoprene estruturado. Perfeito para o ambiente corporativo.",
    price: 219.90,
    discountPrice: null,
    category: "Vestidos",
    sizes: "48,50,52,54,56",
    stock: 20,
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600",
    isFeatured: false,
    isPromotion: false
  },
  {
    name: "Conjunto Pijama Satin",
    description: "Conjunto de pijama em cetim com viés contrastante. Luxuoso e confortável.",
    price: 159.90,
    discountPrice: 129.90,
    category: "Conjuntos",
    sizes: "G1,G2,G3,G4",
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600",
    isFeatured: false,
    isPromotion: true
  },
  {
    name: "Calça Legging Fitness Plus",
    description: "Legging fitness com tecnologia anti-celulite e cintura alta compressiva.",
    price: 139.90,
    discountPrice: 109.90,
    category: "Calças",
    sizes: "G0,G1,G2,G3,G4,G5",
    stock: 80,
    imageUrl: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600",
    isFeatured: true,
    isPromotion: true
  },
  {
    name: "Blusa Estampada Manga Bufante",
    description: "Blusa em viscose com estampa exclusiva e manga bufante. Decote redondo.",
    price: 119.90,
    discountPrice: null,
    category: "Blusas",
    sizes: "G1,G2,G3,G4,G5",
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600",
    isFeatured: false,
    isPromotion: false
  },
  {
    name: "Vestido Wrap Floral",
    description: "Vestido modelo wrap com amarração lateral. Estampa floral romântica.",
    price: 179.90,
    discountPrice: 149.90,
    category: "Vestidos",
    sizes: "48,50,52,54,56,58",
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600",
    isFeatured: true,
    isPromotion: true
  },
  {
    name: "Conjunto Social Blazer + Calça",
    description: "Conjunto social completo com blazer alongado e calça reta. Alfaiataria impecável.",
    price: 399.90,
    discountPrice: 329.90,
    category: "Conjuntos",
    sizes: "G0,G1,G2,G3,G4",
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=600",
    isFeatured: true,
    isPromotion: true
  },
  {
    name: "Calça Jogger Malha Conforto",
    description: "Calça jogger em malha premium com elástico e cordão. Bolsos laterais.",
    price: 129.90,
    discountPrice: null,
    category: "Calças",
    sizes: "G0,G1,G2,G3,G4,G5",
    stock: 55,
    imageUrl: "https://images.unsplash.com/photo-1624623278313-a930126a11c3?w=600",
    isFeatured: false,
    isPromotion: false
  },
  {
    name: "Blusa Ombro a Ombro Listrada",
    description: "Blusa ombro a ombro com listras náuticas. Elástico duplo nos ombros.",
    price: 109.90,
    discountPrice: 89.90,
    category: "Blusas",
    sizes: "G1,G2,G3,G4",
    stock: 45,
    imageUrl: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600",
    isFeatured: false,
    isPromotion: true
  },
  {
    name: "Vestido Chemise Jeans",
    description: "Vestido chemise em jeans com amarração na cintura. Botões frontais.",
    price: 189.90,
    discountPrice: null,
    category: "Vestidos",
    sizes: "48,50,52,54,56",
    stock: 28,
    imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600",
    isFeatured: false,
    isPromotion: false
  },
  {
    name: "Conjunto Fitness Top + Calça",
    description: "Conjunto fitness com top de sustentação e calça legging. Tecido respirável.",
    price: 189.90,
    discountPrice: 159.90,
    category: "Conjuntos",
    sizes: "G0,G1,G2,G3,G4",
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600",
    isFeatured: false,
    isPromotion: true
  },
  {
    name: "Calça Wide Leg Linho",
    description: "Calça wide leg em linho natural. Cós com elástico embutido e bolsos.",
    price: 159.90,
    discountPrice: null,
    category: "Calças",
    sizes: "46,48,50,52,54,56,58",
    stock: 38,
    imageUrl: "https://images.unsplash.com/photo-1566206091558-7f218b696731?w=600",
    isFeatured: false,
    isPromotion: false
  },
  {
    name: "Blusa Peplum Festa",
    description: "Blusa peplum em renda guipir com forro. Perfeita para ocasiões especiais.",
    price: 189.90,
    discountPrice: 149.90,
    category: "Blusas",
    sizes: "G1,G2,G3,G4,G5",
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600",
    isFeatured: false,
    isPromotion: true
  }
];

async function main() {
  console.log('🌱 Starting seed...');

  // Limpar dados existentes
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.admin.deleteMany();

  console.log('✅ Cleared existing data');

  // Criar admin
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123',10);

  const admin = await prisma.admin.create({
    data: {
      username: process.env.ADMIN_USERNAME || 'admin',
      password: hashedPassword
    }
  });

  console.log('✅ Admin created:',admin.username);

  // Criar produtos
  for (const product of products) {
    await prisma.product.create({
      data: product
    });
  }

  console.log(`✅ Created ${products.length} products`);

  // Estatísticas
  const stats = {
    totalProducts: await prisma.product.count(),
    featuredProducts: await prisma.product.count({ where: { isFeatured: true } }),
    promotionProducts: await prisma.product.count({ where: { isPromotion: true } }),
    categories: await prisma.product.groupBy({
      by: ['category'],
      _count: true
    })
  };

  console.log('\n📊 Database Statistics:');
  console.log(`   Total Products: ${stats.totalProducts}`);
  console.log(`   Featured: ${stats.featuredProducts}`);
  console.log(`   On Promotion: ${stats.promotionProducts}`);
  console.log('\n   Products by Category:');
  stats.categories.forEach(cat => {
    console.log(`   - ${cat.category}: ${cat._count}`);
  });

  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:',e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
