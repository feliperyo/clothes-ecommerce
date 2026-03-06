// SEO Constants - Atualizar SITE_URL quando o domínio for configurado
export const SITE_URL = 'https://clothesshop.com.br';
export const SITE_NAME = 'Clothes Shop';
export const SITE_DESCRIPTION = 'Moda plus size moderna e de qualidade. Blusas, calças, vestidos e conjuntos nos tamanhos G0 ao G4. Frete grátis acima de R$599.';
export const SITE_LOGO = `${SITE_URL}/logo.svg`;

// JSON-LD: Organization
export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: SITE_LOGO,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+55-11-91376-2420',
    contactType: 'customer service',
    areaServed: 'BR',
    availableLanguage: 'Portuguese',
  },
  sameAs: ['https://www.instagram.com/clothesshop'],
});

// JSON-LD: LocalBusiness (ClothingStore)
export const getLocalBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'ClothingStore',
  name: SITE_NAME,
  image: SITE_LOGO,
  '@id': SITE_URL,
  url: SITE_URL,
  telephone: '+55-11-91376-2420',
  email: 'mabecasmodas@hotmail.com',
  priceRange: 'R$50 - R$500',
  paymentAccepted: 'Credit Card, PIX',
  currenciesAccepted: 'BRL',
});

// JSON-LD: WebSite (sitelinks searchbox)
export const getWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
});

// JSON-LD: Product
export const getProductSchema = (product) => {
  const price = product.discountPrice || product.price;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.imageUrl?.startsWith('http')
      ? product.imageUrl
      : `${SITE_URL}${product.imageUrl}`,
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/produto/${product.id}`,
      priceCurrency: 'BRL',
      price: price.toFixed(2),
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    },
  };
};

// JSON-LD: BreadcrumbList
export const getBreadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url ? `${SITE_URL}${item.url}` : undefined,
  })),
});

// JSON-LD: FAQPage
export const getFaqSchema = (sections) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: sections.flatMap((section) =>
    section.content.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    }))
  ),
});
