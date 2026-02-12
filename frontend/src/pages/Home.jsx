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
  const showNewest = searchParams.get('newest') === 'true';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        if (searchQuery) {
          const results = await getProducts({ search: searchQuery });
          setFeaturedProducts(Array.isArray(results) ? results : []);
        } else if (showPromotion) {
          const promos = await getPromotionProducts();
          setPromotionProducts(Array.isArray(promos) ? promos : []);
        } else if (showNewest) {
          const allProducts = await getProducts();
          setNewProducts(Array.isArray(allProducts) ? allProducts : []);
        } else {
          const [featured, allProducts] = await Promise.all([
            getFeaturedProducts(),
            getProducts()
          ]);
          setFeaturedProducts(Array.isArray(featured) ? featured : []);
          setNewProducts(Array.isArray(allProducts) ? allProducts.slice(0, 8) : []);

          if (!showFeatured) {
            const promos = await getPromotionProducts();
            setPromotionProducts(Array.isArray(promos) ? promos.slice(0, 4) : []);
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setFeaturedProducts([]);
        setNewProducts([]);
        setPromotionProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, showFeatured, showPromotion, showNewest]);

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
          <h1 className="section-title">Promoções Especiais</h1>
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

  if (showNewest) {
    return (
      <div className="section">
        <div className="container">
          <h1 className="section-title">Novidades - Produtos Recentes</h1>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((product) => (
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
      {/* Banner Hero */}
      <section className="w-full">
        <Link to="/colecoes">
          <div className="w-full bg-tertiary flex items-center justify-center" style={{ minHeight: '400px' }}>
            <img
              src="/assets/banner-home.webp"
              alt="AC Ana Curve - Moda Plus Size"
              className="w-full h-auto object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<div class="text-center py-20"><p class="text-gray-400 text-lg">Banner em breve</p></div>';
              }}
            />
          </div>
        </Link>
      </section>

      {/* Benefits Bar */}
      <section className="py-6 bg-white border-y">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-3">
              <FiTruck size={24} className="text-primary" />
              <div>
                <p className="font-semibold text-sm">Frete Grátis</p>
                <p className="text-xs text-gray-500">Acima de R$ 599</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiCreditCard size={24} className="text-primary" />
              <div>
                <p className="font-semibold text-sm">Até 12x s/ juros</p>
                <p className="text-xs text-gray-500">No cartão</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiRefreshCw size={24} className="text-primary" />
              <div>
                <p className="font-semibold text-sm">Troca Facilitada</p>
                <p className="text-xs text-gray-500">30 dias</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiShield size={24} className="text-primary" />
              <div>
                <p className="font-semibold text-sm">Compra Segura</p>
                <p className="text-xs text-gray-500">Ambiente protegido</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-beige-light/40">
        <div className="container">
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className="group relative overflow-hidden rounded-lg aspect-[4/3]"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <h3 className="text-white font-bold text-lg md:text-2xl lowercase italic">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Lançamentos */}
      <section className="py-12 bg-background">
        <div className="container">
          <h2 className="text-center text-2xl font-display font-bold text-text mb-8">Lançamentos</h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner" />
            </div>
          ) : newProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* Destaques */}
      {featuredProducts.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container">
            <h2 className="text-center text-2xl font-display font-bold text-text mb-8">Destaques</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ofertas */}
      {!showFeatured && promotionProducts.length > 0 && (
        <section className="py-12 bg-tertiary">
          <div className="container">
            <h2 className="text-center text-2xl font-display font-bold text-text mb-8">Ofertas Especiais</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {promotionProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/?promotion=true" className="btn-primary inline-block">
                Ver Todas as Promoções
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Quem Somos */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm tracking-widest uppercase mb-4 text-white/80">Quem Somos</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Moda plus size moderna e de qualidade.
            </h2>
            <p className="text-white/90 leading-relaxed text-lg">
              A AC Ana Curve nasceu do desejo de oferecer moda plus size moderna,
              bem-acabada e de qualidade para mulheres que querem se sentir confiantes
              e lindas. Valorizamos suas curvas com estilo e elegância, trazendo peças
              que combinam conforto e tendência.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
