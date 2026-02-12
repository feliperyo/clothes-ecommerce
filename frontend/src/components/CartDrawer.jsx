import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatPrice, FREE_SHIPPING_THRESHOLD } from '../utils/helpers';

const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    getTotal
  } = useCart();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const total = getTotal();

  return (
    <>
      {/* Overlay */}
      <div
        className="drawer-overlay"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="drawer">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <FiShoppingBag size={24} className="text-primary" />
            <h2 className="text-xl font-bold text-text">
              Meu Carrinho
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="text-gray-400 hover:text-text transition-colors"
            aria-label="Fechar carrinho"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <FiShoppingBag size={64} className="text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-2">Seu carrinho está vazio</p>
              <p className="text-gray-400 text-sm mb-6">
                Adicione produtos para continuar comprando
              </p>
              <button
                onClick={closeCart}
                className="btn-primary"
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex gap-4 bg-white rounded-lg border border-gray-200 p-3"
                >
                  {/* Image */}
                  <div className="w-20 h-24 flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-text mb-1 line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">
                      Tamanho: {item.size}
                    </p>
                    <p className="text-primary font-bold">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end justify-between">
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      aria-label="Remover item"
                    >
                      <FiTrash2 size={18} />
                    </button>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                        aria-label="Diminuir quantidade"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                        disabled={item.quantity >= item.stock}
                        aria-label="Aumentar quantidade"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t p-6 bg-gray-50">
            {/* Subtotal */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(total)}
              </span>
            </div>

            {/* Shipping Note */}
            {total < FREE_SHIPPING_THRESHOLD && (
              <p className="text-sm text-gray-500 mb-4 text-center">
                Faltam {formatPrice(FREE_SHIPPING_THRESHOLD - total)} para frete grátis!
              </p>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <Link
                to="/checkout"
                onClick={closeCart}
                className="block w-full btn-primary text-center"
              >
                Finalizar Compra
              </Link>
              <Link
                to="/carrinho"
                onClick={closeCart}
                className="block w-full btn-outline text-center"
              >
                Ver Carrinho Completo
              </Link>
              <button
                onClick={closeCart}
                className="w-full text-center text-gray-600 hover:text-text transition-colors py-2"
              >
                Continuar Comprando
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
