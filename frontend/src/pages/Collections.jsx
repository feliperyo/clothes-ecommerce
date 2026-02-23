import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { getBreadcrumbSchema } from '../utils/seo';

const Collections = () => {
  const collections = [
    {
      name: 'Blusas',
      description: 'Blusas modernas e confortáveis para todas as ocasiões',
      image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=800',
      path: '/categoria/Blusas'
    },
    {
      name: 'Calças',
      description: 'Calças que valorizam suas curvas com estilo e elegância',
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800',
      path: '/categoria/Calças'
    },
    {
      name: 'Vestidos',
      description: 'Vestidos para arrasar em qualquer evento',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
      path: '/categoria/Vestidos'
    },
    {
      name: 'Conjuntos',
      description: 'Conjuntos práticos e estilosos prontos para usar',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
      path: '/categoria/Conjuntos'
    },
    {
      name: 'Short / Short Saia',
      description: 'Shorts e saia shorts estilosos e confortáveis para valorizar suas curvas',
      image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800',
      path: '/categoria/Short / Short Saia'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Coleções"
        description="Explore nossas coleções de moda plus size: blusas, calças, vestidos e conjuntos. Peças modernas nos tamanhos G0 ao G4."
        path="/colecoes"
        jsonLd={getBreadcrumbSchema([
          { name: 'Início', url: '/' },
          { name: 'Coleções' },
        ])}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-tertiary via-secondary/20 to-tertiary py-12 md:py-16">
        <div className="container">
          <div className="text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4">
              Nossas Coleções
            </h1>
            <p className="text-lg text-text/80 max-w-2xl mx-auto">
              Explore nossas categorias e encontre as peças perfeitas para valorizar suas curvas
            </p>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collections.map((collection) => (
              <Link
                key={collection.name}
                to={collection.path}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8">
                  <h2 className="text-white font-display font-bold text-2xl md:text-3xl mb-2">
                    {collection.name}
                  </h2>
                  <p className="text-white/80 text-sm md:text-base mb-4">
                    {collection.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-white font-semibold group-hover:gap-4 transition-all">
                    Ver Produtos
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-primary/10">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-primary mb-4">
              Não encontrou o que procura?
            </h2>
            <p className="text-text/70 mb-6">
              Confira todas as nossas novidades e promoções especiais
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/?newest=true" className="btn-primary">
                Ver Novidades
              </Link>
              <Link to="/?promotion=true" className="btn-outline">
                Ver Promoções
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Collections;
