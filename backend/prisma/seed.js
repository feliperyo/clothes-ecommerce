const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Criar admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', password: hashedPassword }
  });
  console.log('Admin criado: admin / admin123');

  // Criar cupom de exemplo
  await prisma.coupon.create({
    data: { code: 'BEMVINDA10', discountPercent: 10, isActive: true }
  });
  console.log('Cupom criado: BEMVINDA10 (10% off)');

  // Produtos de exemplo
  const products = [
    {
      name: 'Blusa Elegance Manga Longa',
      description: '<p>Blusa elegante em tecido premium com caimento perfeito. Ideal para ocasiões especiais e dia a dia.</p><ul><li>Tecido leve e confortável</li><li>Manga longa com punho</li><li>Decote V</li></ul>',
      price: 189.90,
      discountPrice: 149.90,
      category: 'Blusas',
      sizes: '44,46,48,50,52',
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600',
        'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=600',
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600'
      ]),
      colors: JSON.stringify([
        { name: 'Preto', hex: '#000000' },
        { name: 'Branco', hex: '#FFFFFF' },
        { name: 'Bordô', hex: '#800020' }
      ]),
      sizeStock: JSON.stringify({
        'Preto': { '44': 3, '46': 2, '48': 3, '50': 2, '52': 1 },
        'Branco': { '44': 2, '46': 3, '48': 2, '50': 1, '52': 1 },
        'Bordô': { '44': 1, '46': 2, '48': 1, '50': 1, '52': 0 }
      }),
      isFeatured: true,
      isPromotion: true,
      isNew: false,
      isPreSale: false
    },
    {
      name: 'Calça Wide Leg Alfaiataria',
      description: '<p>Calça wide leg em alfaiataria premium. Cintura alta com cinto incluso. Perfeita para looks sofisticados.</p>',
      price: 249.90,
      discountPrice: null,
      category: 'Calças',
      sizes: '44,46,48,50',
      stock: 18,
      imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600',
        'https://images.unsplash.com/photo-1551854838-212c50b4c184?w=600'
      ]),
      colors: JSON.stringify([
        { name: 'Preto', hex: '#000000' },
        { name: 'Caramelo', hex: '#C07837' }
      ]),
      sizeStock: JSON.stringify({
        'Preto': { '44': 3, '46': 3, '48': 2, '50': 1 },
        'Caramelo': { '44': 2, '46': 3, '48': 2, '50': 2 }
      }),
      isFeatured: true,
      isPromotion: false,
      isNew: true,
      isPreSale: false
    },
    {
      name: 'Vestido Midi Floral',
      description: '<p>Vestido midi com estampa floral exclusiva. Tecido fluido, super confortável. Acompanha cinto de tecido.</p><ul><li>Comprimento midi</li><li>Manga curta</li><li>Forro interno</li></ul>',
      price: 299.90,
      discountPrice: 239.90,
      category: 'Vestidos',
      sizes: '46,48,50,52,54',
      stock: 15,
      imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600',
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600',
        'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600'
      ]),
      colors: JSON.stringify([
        { name: 'Floral Rosa', hex: '#E8A0BF' },
        { name: 'Floral Azul', hex: '#7EC8E3' }
      ]),
      sizeStock: JSON.stringify({
        'Floral Rosa': { '46': 2, '48': 3, '50': 2, '52': 1, '54': 0 },
        'Floral Azul': { '46': 1, '48': 2, '50': 2, '52': 1, '54': 1 }
      }),
      isFeatured: true,
      isPromotion: true,
      isNew: false,
      isPreSale: false
    },
    {
      name: 'Conjunto Blazer + Calça Social',
      description: '<p>Conjunto sofisticado de blazer estruturado com calça reta. Ideal para trabalho e eventos formais.</p>',
      price: 459.90,
      discountPrice: null,
      category: 'Conjuntos',
      sizes: '44,46,48,50,52',
      stock: 12,
      imageUrl: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600',
        'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d44?w=600'
      ]),
      colors: JSON.stringify([
        { name: 'Preto', hex: '#000000' },
        { name: 'Cinza', hex: '#808080' },
        { name: 'Marinho', hex: '#000080' }
      ]),
      sizeStock: JSON.stringify({
        'Preto': { '44': 2, '46': 1, '48': 2, '50': 1, '52': 0 },
        'Cinza': { '44': 1, '46': 1, '48': 1, '50': 1, '52': 0 },
        'Marinho': { '44': 0, '46': 1, '48': 0, '50': 1, '52': 0 }
      }),
      isFeatured: false,
      isPromotion: false,
      isNew: true,
      isPreSale: false
    },
    {
      name: 'Macaquinho Utilitário',
      description: '<p>Macaquinho estilo utilitário com bolsos funcionais. Super prático e estiloso para o verão.</p>',
      price: 199.90,
      discountPrice: 159.90,
      category: 'Macaquinho/Macacão',
      sizes: '44,46,48,50',
      stock: 10,
      imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600'
      ]),
      colors: JSON.stringify([
        { name: 'Verde Militar', hex: '#4B5320' },
        { name: 'Bege', hex: '#D2B48C' }
      ]),
      sizeStock: JSON.stringify({
        'Verde Militar': { '44': 2, '46': 2, '48': 1, '50': 1 },
        'Bege': { '44': 1, '46': 1, '48': 1, '50': 1 }
      }),
      isFeatured: false,
      isPromotion: true,
      isNew: false,
      isPreSale: false
    },
    {
      name: 'Saia Midi Plissada',
      description: '<p>Saia midi plissada em tecido leve. Cintura elástica para maior conforto. Versatilidade para diversos looks.</p>',
      price: 169.90,
      discountPrice: null,
      category: 'Saias',
      sizes: '44,46,48,50,52',
      stock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600'
      ]),
      colors: JSON.stringify([
        { name: 'Nude', hex: '#E8CAAF' },
        { name: 'Preto', hex: '#000000' },
        { name: 'Terracota', hex: '#CC5533' }
      ]),
      sizeStock: JSON.stringify({
        'Nude': { '44': 2, '46': 3, '48': 2, '50': 1, '52': 1 },
        'Preto': { '44': 2, '46': 2, '48': 1, '50': 1, '52': 1 },
        'Terracota': { '44': 1, '46': 1, '48': 1, '50': 1, '52': 0 }
      }),
      isFeatured: true,
      isPromotion: false,
      isNew: false,
      isPreSale: false
    },
    {
      name: 'Short Saia Linho Premium',
      description: '<p>Short saia em linho premium com forro. Perfeito para o verão com toque sofisticado.</p>',
      price: 139.90,
      discountPrice: 109.90,
      category: 'Short / Short Saia',
      sizes: '44,46,48,50',
      stock: 14,
      imageUrl: 'https://images.unsplash.com/photo-1562572159-4efc207f5aff?w=600',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1562572159-4efc207f5aff?w=600'
      ]),
      colors: JSON.stringify([
        { name: 'Branco', hex: '#FFFFFF' },
        { name: 'Azul Claro', hex: '#ADD8E6' }
      ]),
      sizeStock: JSON.stringify({
        'Branco': { '44': 2, '46': 2, '48': 2, '50': 1 },
        'Azul Claro': { '44': 2, '46': 1, '48': 1, '50': 1 }
      }),
      isFeatured: false,
      isPromotion: true,
      isNew: true,
      isPreSale: false
    },
    {
      name: 'Blazer Oversized Linho',
      description: '<p>Blazer oversized em linho natural. Corte moderno e despojado. Pode ser usado aberto ou fechado.</p>',
      price: 289.90,
      discountPrice: null,
      category: 'Blazer/Jaqueta',
      sizes: '46,48,50,52',
      stock: 8,
      imageUrl: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=600',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=600'
      ]),
      colors: JSON.stringify([
        { name: 'Cru', hex: '#FFFDD0' },
        { name: 'Caramelo', hex: '#C07837' }
      ]),
      sizeStock: JSON.stringify({
        'Cru': { '46': 1, '48': 2, '50': 1, '52': 0 },
        'Caramelo': { '46': 1, '48': 1, '50': 1, '52': 1 }
      }),
      isFeatured: false,
      isPromotion: false,
      isNew: true,
      isPreSale: false
    },
    {
      name: 'Vestido Longo Festa',
      description: '<p>Vestido longo para festas e eventos especiais. Tecido com brilho sutil, fenda lateral e decote elegante.</p>',
      price: 399.90,
      discountPrice: null,
      category: 'Vestidos',
      sizes: '44,46,48,50,52',
      stock: 7,
      imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600',
        'https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=600'
      ]),
      colors: JSON.stringify([
        { name: 'Marsala', hex: '#800020' },
        { name: 'Esmeralda', hex: '#50C878' }
      ]),
      sizeStock: JSON.stringify({
        'Marsala': { '44': 1, '46': 1, '48': 1, '50': 1, '52': 0 },
        'Esmeralda': { '44': 0, '46': 1, '48': 1, '50': 0, '52': 1 }
      }),
      isFeatured: true,
      isPromotion: false,
      isNew: false,
      isPreSale: false
    },
    {
      name: 'Blusa Cropped Tricot',
      description: '<p>Blusa cropped em tricot macio. Ideal para meia estação. Combine com calças de cintura alta.</p>',
      price: 129.90,
      discountPrice: 99.90,
      category: 'Blusas',
      sizes: '44,46,48',
      stock: 16,
      imageUrl: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600'
      ]),
      colors: JSON.stringify([
        { name: 'Rosa', hex: '#FFB6C1' },
        { name: 'Lilás', hex: '#C8A2C8' },
        { name: 'Branco', hex: '#FFFFFF' }
      ]),
      sizeStock: JSON.stringify({
        'Rosa': { '44': 3, '46': 2, '48': 1 },
        'Lilás': { '44': 2, '46': 2, '48': 1 },
        'Branco': { '44': 2, '46': 2, '48': 1 }
      }),
      isFeatured: false,
      isPromotion: true,
      isNew: false,
      isPreSale: false
    },
    {
      name: 'Calça Jogger Moletom Premium',
      description: '<p>Calça jogger em moletom premium com punho. Conforto total para o dia a dia com estilo.</p>',
      price: 179.90,
      discountPrice: null,
      category: 'Calças',
      sizes: '44,46,48,50,52',
      stock: 22,
      imageUrl: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600'
      ]),
      colors: JSON.stringify([
        { name: 'Cinza Mescla', hex: '#A9A9A9' },
        { name: 'Preto', hex: '#000000' }
      ]),
      sizeStock: JSON.stringify({
        'Cinza Mescla': { '44': 3, '46': 3, '48': 2, '50': 2, '52': 1 },
        'Preto': { '44': 3, '46': 3, '48': 2, '50': 2, '52': 1 }
      }),
      isFeatured: false,
      isPromotion: false,
      isNew: false,
      isPreSale: false
    },
    {
      name: 'Conjunto Cropped + Saia Midi',
      description: '<p>Conjunto moderno com cropped e saia midi. Tecido canelado de alta qualidade. Use junto ou separado.</p>',
      price: 269.90,
      discountPrice: null,
      category: 'Conjuntos',
      sizes: '44,46,48,50',
      stock: 6,
      imageUrl: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600'
      ]),
      colors: JSON.stringify([
        { name: 'Terracota', hex: '#CC5533' },
        { name: 'Verde Oliva', hex: '#808000' }
      ]),
      sizeStock: JSON.stringify({
        'Terracota': { '44': 1, '46': 1, '48': 1, '50': 0 },
        'Verde Oliva': { '44': 1, '46': 1, '48': 0, '50': 1 }
      }),
      isFeatured: false,
      isPromotion: false,
      isNew: false,
      isPreSale: true
    }
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log(`${products.length} produtos criados com sucesso!`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
