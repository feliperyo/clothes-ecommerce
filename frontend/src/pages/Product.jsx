import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiShoppingCart,
  FiHeart,
  FiShare2,
  FiCheck,
  FiTruck,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import SEO from '../components/SEO';
import { getProductById, getImageUrl } from '../utils/api';
import { formatPrice, parseSizes, FREE_SHIPPING_THRESHOLD } from '../utils/helpers';
import { getProductSchema, getBreadcrumbSchema } from '../utils/seo';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
        setError(null);

        // Salvar nos produtos visualizados
        if (data && data.id) {
          try {
            const saved = localStorage.getItem('anacurve_viewed_products');
            const parsed = saved ? JSON.parse(saved) : [];
            const viewed = Array.isArray(parsed) ? parsed : [];
            const filtered = viewed.filter((p) => p.id !== data.id);
            filtered.unshift({
              id: data.id,
              name: data.name,
              imageUrl: data.imageUrl,
              price: data.price,
              discountPrice: data.discountPrice,
              category: data.category,
              sizes: data.sizes,
              stock: data.stock,
              isPromotion: data.isPromotion,
              isFeatured: data.isFeatured,
            });
            localStorage.setItem(
              'anacurve_viewed_products',
              JSON.stringify(filtered.slice(0, 8))
            );
          } catch (e) {
            // Ignorar erros de localStorage
          }
        }
      } catch (err) {
        console.error('Erro ao buscar produto:', err);
        setError('Não foi possível carregar o produto. Tente novamente.');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Por favor, selecione um tamanho');
      return;
    }
    if (quantity < 1) {
      toast.error('Quantidade inválida');
      return;
    }
    addToCart(product, selectedSize, quantity);
    setQuantity(1);
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast.success(isFavorited ? 'Removido dos favoritos' : 'Adicionado aos favoritos');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copiado!');
    }
  };

  if (loading) {
    return (
      <div className="section bg-background">
        <div className="container">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-primary font-semibold mb-8"
          >
            <FiArrowLeft size={20} />
            Voltar
          </button>
          <div className="flex justify-center py-16">
            <div className="spinner" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
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
              Oops! Produto não encontrado
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              {error || 'O produto que você procura não existe ou foi removido.'}
            </p>
            <button onClick={() => navigate('/')} className="btn-primary">
              Voltar à Loja
            </button>
          </div>
        </div>
      </div>
    );
  }

  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  const inStock = product.stock > 0;

  return (
    <div className="section bg-background">
      <SEO
        title={product.name}
        description={`${product.name} - ${product.description?.substring(0, 150)}. Tamanhos: ${parseSizes(product.sizes).join(', ')}. Compre na Ana Curve Shop.`}
        path={`/produto/${product.id}`}
        image={getImageUrl(product.imageUrl)}
        type="product"
        jsonLd={[
          getProductSchema(product),
          getBreadcrumbSchema([
            { name: 'Início', url: '/' },
            { name: product.category, url: `/categoria/${product.category}` },
            { name: product.name },
          ]),
        ]}
      />
      <div className="container">
        {/* Breadcrumb */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-primary font-semibold mb-8 hover:gap-3 transition-all"
        >
          <FiArrowLeft size={20} />
          Voltar
        </button>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Image Section */}
          <div className="sticky top-24 h-fit">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[3/4] flex items-center justify-center">
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-100 animate-pulse" />
              )}
              <img
                src={getImageUrl(product.imageUrl)}
                alt={product.name}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x533?text=Ana+Curve+Shop';
                  setImageLoaded(true);
                }}
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.isPromotion && (
                  <span className="badge-promo">OFERTA</span>
                )}
                {product.isFeatured && (
                  <span className="badge-featured">DESTAQUE</span>
                )}
                {hasDiscount && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                    -{discountPercent}%
                  </span>
                )}
              </div>

              {!inStock && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">Esgotado</span>
                </div>
              )}

              {/* Actions */}
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button
                  onClick={handleFavorite}
                  className={`p-3 rounded-full backdrop-blur transition-all ${
                    isFavorited
                      ? 'bg-red-500 text-white'
                      : 'bg-white/80 text-text hover:bg-white'
                  }`}
                  aria-label="Add to favorites"
                >
                  <FiHeart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 rounded-full bg-white/80 text-text hover:bg-white transition-all"
                  aria-label="Share product"
                >
                  <FiShare2 size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            {/* Category */}
            <div>
              <Link
                to={`/categoria/${product.category}`}
                className="text-primary hover:underline text-sm font-semibold"
              >
                {product.category}
              </Link>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-text leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Prices */}
            <div className="py-4 border-y border-gray-200">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                {hasDiscount && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
                <span className="text-3xl sm:text-4xl font-bold text-primary">
                  {formatPrice(price)}
                </span>
                {hasDiscount && (
                  <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    -{discountPercent}% OFF
                  </span>
                )}
              </div>
              {product.stock > 0 && product.stock <= 5 && (
                <p className="text-sm text-orange-600 font-semibold">
                  Apenas {product.stock} unidades disponíveis!
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-bold text-lg mb-2">Descrição</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block font-semibold mb-3">Tamanho *</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {parseSizes(product.sizes).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    disabled={!inStock}
                    className={`py-3 rounded-lg font-semibold transition-all border-2 ${
                      selectedSize === size
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-300 hover:border-primary'
                    } ${!inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block font-semibold mb-3">Quantidade</label>
              <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={!inStock}
                  className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  −
                </button>
                <span className="px-6 py-2 font-semibold text-center min-w-12">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={!inStock}
                  className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!inStock || !selectedSize}
              className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiShoppingCart size={24} />
              {inStock ? 'Adicionar ao Carrinho' : 'Fora de Estoque'}
            </button>

            {/* Benefits */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex gap-3 items-start">
                <FiTruck className="text-primary flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-sm">Frete Grátis</p>
                  <p className="text-xs text-gray-600">{`Em compras acima de R$ ${FREE_SHIPPING_THRESHOLD}`}</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <FiCheck className="text-primary flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-sm">Garantia de Qualidade</p>
                  <p className="text-xs text-gray-600">Produtos selecionados com cuidado</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <FiCheck className="text-primary flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-sm">Troca Facilitada</p>
                  <p className="text-xs text-gray-600">Até 30 dias após a compra</p>
                </div>
              </div>
            </div>

            {/* Stock Info */}
            <div
              className={`p-4 rounded-lg text-sm font-semibold text-center ${
                inStock
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {inStock ? (
                <span>Em Estoque - Enviamos Rapidinho!</span>
              ) : (
                <span>Este produto está indisponível no momento</span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Product;
