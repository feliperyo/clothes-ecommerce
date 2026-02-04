import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiTruck, FiCreditCard, FiRefreshCw, FiShield } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { getProducts, getFeaturedProducts, getPromotionProducts } from '../utils/api';

const Home = () => {
  const [searchParams] = useSearchParams();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [promotionProducts, setPromotionProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchQuery = searchParams.get('search');
  const showFeatured = searchParams.get('featured') === 'true';
  const showPromotion = searchParams.get('promotion') === 'true';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        if (searchQuery) {
          const results = await getProducts({ search: searchQuery });
          setFeaturedProducts(results);
        } else if (showPromotion) {
          const promos = await getPromotionProducts();
          setPromotionProducts(promos);
        } else {
          const [featured, allProducts] = await Promise.all([
            getFeaturedProducts(),
            getProducts()
          ]);
          setFeaturedProducts(featured);
          setNewProducts(allProducts.slice(0, 8));

          if (!showFeatured) {
            const promos = await getPromotionProducts();
            setPromotionProducts(promos.slice(0, 4));
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, showFeatured, showPromotion]);

  const categories = [
    {
      name: 'Blusas',
      image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=400',
      path: '/categoria/Blusas'
    },
    {
      name: 'Calças',
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400',
      path: '/categoria/Calças'
    },
    {
      name: 'Vestidos',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
      path: '/categoria/Vestidos'
    },
    {
      name: 'Conjuntos',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
      path: '/categoria/Conjuntos'
    }
  ];

  if (searchQuery) {
    return (
      <div className="section">
        <div className="container">
          <h1 className="section-title">
            Resultados para "{searchQuery}"
          </h1>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner" />
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Nenhum produto encontrado.</p>
              <Link to="/" className="btn-primary inline-block mt-4">
                Ver Todos os Produtos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (showPromotion) {
    return (
      <div className="section">
        <div className="container">
          <h1 className="section-title">🔥 Promoções Especiais</h1>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {promotionProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-tertiary via-secondary/20 to-tertiary py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
              Moda Plus Size Moderna e de Qualidade
            </h1>
            <p className="text-lg md:text-xl text-text/80 mb-8">
              Valorize suas curvas com estilo e elegância.
              Encontre as melhores peças para se sentir confiante e linda!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/?featured=true" className="btn-primary">
                Ver Coleção
              </Link>
              <Link to="/?promotion=true" className="btn-outline">
                Ver Promoções
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 bg-white border-y">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-tertiary rounded-full flex items-center justify-center mb-4">
                <FiTruck size={32} className="text-primary" />
              </div>
              <h3 className="font-bold mb-2">Frete Grátis</h3>
              <p className="text-sm text-gray-600">Acima de R$ 599</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-tertiary rounded-full flex items-center justify-center mb-4">
                <FiCreditCard size={32} className="text-primary" />
              </div>
              <h3 className="font-bold mb-2">Parcele em 12x</h3>
              <p className="text-sm text-gray-600">Sem juros no cartão</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-tertiary rounded-full flex items-center justify-center mb-4">
                <FiRefreshCw size={32} className="text-primary" />
              </div>
              <h3 className="font-bold mb-2">Troca Facilitada</h3>
              <p className="text-sm text-gray-600">30 dias para trocar</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-tertiary rounded-full flex items-center justify-center mb-4">
                <FiShield size={32} className="text-primary" />
              </div>
              <h3 className="font-bold mb-2">Compra Segura</h3>
              <p className="text-sm text-gray-600">Ambiente protegido</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section bg-background">
        <div className="container">
          <h2 className="section-title">✨ Produtos em Destaque</h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="section bg-white">
        <div className="container">
          <h2 className="section-title">Compre por Categoria</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className="group relative overflow-hidden rounded-lg aspect-square"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-6">
                  <h3 className="text-white font-bold text-xl md:text-2xl">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promotions */}
      {!showFeatured && promotionProducts.length > 0 && (
        <section className="section bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="container">
            <h2 className="section-title">🔥 Ofertas Especiais</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {promotionProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/?promotion=true" className="btn-primary">
                Ver Todas as Promoções
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {!showFeatured && newProducts.length > 0 && (
        <section className="section bg-background">
          <div className="container">
            <h2 className="section-title">🆕 Novidades</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="section bg-primary text-white">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold mb-4">
              Fique por Dentro das Novidades!
            </h2>
            <p className="mb-8">
              Cadastre-se e receba em primeira mão nossas promoções exclusivas e lançamentos.
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 px-6 py-3 rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button type="submit" className="btn-secondary whitespace-nowrap">
                Cadastrar
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
