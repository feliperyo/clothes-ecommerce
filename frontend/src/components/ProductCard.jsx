import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatPrice, parseSizes } from '../utils/helpers';
import { getImageUrl } from '../utils/api';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedSize, 1);
  };

  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  const sizes = parseSizes(product.sizes);
  const colorsParsed = (() => {
    if (!product.colors) return null;
    try { return JSON.parse(product.colors); } catch { return null; }
  })();

  return (
    <Link
      to={`/produto/${product.id}`}
      className="product-card block group hover:scale-[1.02] transition-transform duration-300"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.isPromotion && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-red-500 animate-pulse-glow relative overflow-hidden">
            OFERTA
            <span className="absolute inset-0 animate-shimmer"></span>
          </span>
        )}
        {product.isFeatured && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-primary animate-bounce-soft">
            DESTAQUE
          </span>
        )}
        {hasDiscount && (
          <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-red-600">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Image */}
      <div className="relative overflow-hidden aspect-product bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 img-placeholder" />
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
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Esgotado</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        {/* Product Name */}
        <h3 className="font-semibold text-base sm:text-lg text-text mb-2 line-clamp-2 min-h-[2.5rem] sm:min-h-[3.5rem]">
          {product.name}
        </h3>

        {/* Category */}
        <p className="text-sm text-gray-500 mb-2">{product.category}</p>

        {/* Prices */}
        <div className="flex items-center gap-2 mb-3">
          {hasDiscount && (
            <span className="text-gray-400 line-through text-sm">
              {formatPrice(product.price)}
            </span>
          )}
          <span className="text-primary font-bold text-xl">
            {formatPrice(price)}
          </span>
        </div>

        {/* Color dots */}
        {colorsParsed?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {colorsParsed.slice(0, 6).map((c, idx) => (
              <span
                key={idx}
                title={c.name}
                className="w-4 h-4 rounded-full border border-gray-200 flex-shrink-0"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {colorsParsed.length > 6 && (
              <span className="text-xs text-gray-400">+{colorsParsed.length - 6}</span>
            )}
          </div>
        )}

        {/* Size Selector */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Tamanho:
          </label>
          <select
            value={selectedSize}
            onChange={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedSize(e.target.value);
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={product.stock === 0}
          >
            <option value="">Selecione</option>
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!selectedSize || product.stock === 0}
          className="w-full btn-primary text-sm py-2 flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
        >
          <FiShoppingCart size={18} />
          {product.stock === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
        </button>

        {/* Stock Warning */}
        {product.stock === 1 && (
          <p className="text-xs text-red-600 font-bold mt-2 text-center">
            Atenção, última peça!
          </p>
        )}
        {product.stock > 1 && product.stock <= 5 && (
          <p className="text-xs text-orange-600 mt-2 text-center">
            Apenas {product.stock} unidades disponíveis!
          </p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
