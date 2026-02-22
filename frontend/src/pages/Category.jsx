import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiFilter,
  FiChevronDown,
  FiGrid,
  FiList,
} from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { getProductsByCategory } from '../utils/api';
import { parseSizes, formatPrice } from '../utils/helpers';
import { getBreadcrumbSchema } from '../utils/seo';

const Category = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [sortBy, setSortBy] = useState('recent');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  // Available sizes
  const availableSizes = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const decodedCategory = decodeURIComponent(category);
        const data = await getProductsByCategory(decodedCategory);
        setProducts(data);
        setFilteredProducts(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        setError('Não foi possível carregar os produtos desta categoria.');
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchProducts();
    }
  }, [category]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products];

    // Filter by price range
    filtered = filtered.filter((product) => {
      const price = product.discountPrice || product.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Filter by sizes
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((product) =>
        parseSizes(product.sizes).some((size) => selectedSizes.includes(size))
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => {
          const priceA = a.discountPrice || a.price;
          const priceB = b.discountPrice || b.price;
          return priceA - priceB;
        });
        break;
      case 'price-desc':
        filtered.sort((a, b) => {
          const priceA = a.discountPrice || a.price;
          const priceB = b.discountPrice || b.price;
          return priceB - priceA;
        });
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'recent':
      default:
        filtered.reverse();
        break;
    }

    setFilteredProducts(filtered);
  }, [products, sortBy, priceRange, selectedSizes]);

  const handleSizeToggle = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleResetFilters = () => {
    setSortBy('recent');
    setPriceRange([0, 1000]);
    setSelectedSizes([]);
  };

  const categoryDisplay = decodeURIComponent(category);

  if (error && products.length === 0) {
    return (
      <div className="section bg-background">
        <div className="container max-w-2xl">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-primary font-semibold mb-8"
          >
            <FiArrowLeft size={20} />
            Voltar
          </button>
          <div className="card p-12 text-center">
            <h1 className="text-3xl font-display font-bold text-text mb-4">
              Oops! Categoria não encontrada
            </h1>
            <p className="text-gray-600 text-lg mb-8">{error}</p>
            <button onClick={() => navigate('/')} className="btn-primary">
              Voltar à Loja
            </button>
          </div>
        </div>
      </div>
    );
  }

  const categoryDescriptions = {
    'Blusas': 'Blusas plus size modernas e confortáveis para todas as ocasiões. Tamanhos G0 ao G4.',
    'Calças': 'Calças plus size que valorizam suas curvas com estilo e elegância. Tamanhos G0 ao G4.',
    'Vestidos': 'Vestidos plus size para arrasar em qualquer evento. Tamanhos G0 ao G4.',
    'Conjuntos': 'Conjuntos plus size práticos e estilosos prontos para usar. Tamanhos G0 ao G4.',
    'Saia': 'Saias plus size modernas para valorizar suas curvas. Tamanhos G0 ao G4.',
    'Saia Short': 'Saia shorts plus size estilosas e confortáveis. Tamanhos G0 ao G4.',
  };

  return (
    <div className="section bg-background">
      <SEO
        title={`${categoryDisplay} Plus Size`}
        description={categoryDescriptions[categoryDisplay] || `${categoryDisplay} plus size na Ana Curve Shop. Frete grátis acima de R$599.`}
        path={`/categoria/${category}`}
        jsonLd={getBreadcrumbSchema([
          { name: 'Início', url: '/' },
          { name: categoryDisplay },
        ])}
      />
      <div className="container">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-primary font-semibold mb-8 hover:gap-3 transition-all"
        >
          <FiArrowLeft size={20} />
          Voltar
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-text mb-2">
            {categoryDisplay}
          </h1>
          <p className="text-gray-600">
            {filteredProducts.length} produto
            {filteredProducts.length !== 1 ? 's' : ''} encontrado
            {filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'} mb-6 lg:mb-0`}>
            <div className="card p-6 sticky top-24 h-fit">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Filtros</h3>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  Limpar
                </button>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="block font-semibold text-sm mb-3">
                  Ordenar por
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input w-full text-sm"
                >
                  <option value="recent">Mais Recentes</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                  <option value="name">Nome (A-Z)</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6 pb-6 border-b">
                <label className="block font-semibold text-sm mb-3">
                  Preço
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([
                          parseInt(e.target.value),
                          priceRange[1],
                        ])
                      }
                      placeholder="Min"
                      className="input text-sm flex-1"
                    />
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([
                          priceRange[0],
                          parseInt(e.target.value),
                        ])
                      }
                      placeholder="Max"
                      className="input text-sm flex-1"
                    />
                  </div>
                  <div className="flex gap-1">
                    <span className="text-xs text-gray-600 flex-1">
                      R$ {priceRange[0]}
                    </span>
                    <span className="text-xs text-gray-600">-</span>
                    <span className="text-xs text-gray-600 flex-1 text-right">
                      R$ {priceRange[1]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="block font-semibold text-sm mb-3">
                  Tamanho
                </label>
                <div className="space-y-2">
                  {availableSizes.map((size) => (
                    <label
                      key={size}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSizes.includes(size)}
                        onChange={() => handleSizeToggle(size)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{size}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-primary transition-colors"
              >
                <FiFilter size={18} />
                Filtros
              </button>

              <div className="flex items-center gap-2 ml-auto lg:ml-0">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${
                    viewMode === 'grid'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label="Grid view"
                >
                  <FiGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${
                    viewMode === 'list'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label="List view"
                >
                  <FiList size={18} />
                </button>
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="spinner" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="card p-12 text-center">
                <h3 className="text-xl font-semibold text-text mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-600 mb-6">
                  Tente ajustar os filtros para encontrar o que procura.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="btn-primary inline-block"
                >
                  Limpar Filtros
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => {
                  const price = product.discountPrice || product.price;
                  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

                  return (
                    <Link
                      key={product.id}
                      to={`/produto/${product.id}`}
                      className="card p-4 flex gap-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-text line-clamp-2 mb-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          {hasDiscount && (
                            <span className="text-gray-400 line-through text-sm">
                              {formatPrice(product.price)}
                            </span>
                          )}
                          <span className="text-primary font-bold text-lg">
                            {formatPrice(price)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {product.stock > 0
                            ? `${product.stock} em estoque`
                            : 'Fora de estoque'}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
