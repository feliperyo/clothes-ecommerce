import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatPrice, calculateShipping } from '../utils/helpers';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [shippingCost, setShippingCost] = useState(0);
  const [cepForShipping, setCepForShipping] = useState('');
  const [shippingCalculated, setShippingCalculated] = useState(false);
  const [loadingShipping, setLoadingShipping] = useState(false);

  // Carregar CEP do localStorage se existir
  useEffect(() => {
    const savedCep = localStorage.getItem('anacurve_shipping_cep');
    if (savedCep) {
      setCepForShipping(savedCep);
      const shipping = calculateShipping(savedCep, getTotal());
      setShippingCost(shipping);
      setShippingCalculated(true);
    }
  }, []);

  const handleCalculateShipping = async () => {
    if (!cepForShipping || cepForShipping.length !== 8) {
      alert('Por favor, insira um CEP válido (8 dígitos)');
      return;
    }

    setLoadingShipping(true);
    try {
      // Simular cálculo de frete
      const shipping = calculateShipping(cepForShipping, getTotal());
      setShippingCost(shipping);
      setShippingCalculated(true);
      localStorage.setItem('anacurve_shipping_cep', cepForShipping);
    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      alert('Erro ao calcular frete. Tente novamente.');
    } finally {
      setLoadingShipping(false);
    }
  };

  const subtotal = getTotal();
  const total = subtotal + shippingCost;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="section bg-background">
        <div className="container max-w-2xl">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-primary font-semibold mb-8 hover:gap-3 transition-all"
          >
            <FiArrowLeft size={20} />
            Continuar Comprando
          </button>

          <div className="card p-12 text-center">
            <div className="mb-6">
              <svg
                className="mx-auto w-24 h-24 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-display font-bold text-text mb-4">
              Seu Carrinho está Vazio
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Explore nossa coleção e encontre as peças perfeitas para você!
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary inline-block"
            >
              Voltar à Loja
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section bg-background">
      <div className="container">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-primary font-semibold mb-8 hover:gap-3 transition-all"
        >
          <FiArrowLeft size={20} />
          Continuar Comprando
        </button>

        <h1 className="section-title mb-8">Seu Carrinho</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2">
            <div className="card overflow-hidden">
              {/* Header */}
              <div className="bg-gray-50 px-6 py-4 border-b grid grid-cols-12 gap-4 items-center text-sm font-semibold text-gray-600">
                <div className="col-span-5">Produto</div>
                <div className="col-span-2 text-center">Tamanho</div>
                <div className="col-span-2 text-center">Quantidade</div>
                <div className="col-span-2 text-right">Subtotal</div>
                <div className="col-span-1"></div>
              </div>

              {/* Items */}
              <div className="divide-y">
                {cart.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors"
                  >
                    {/* Product Info */}
                    <div className="col-span-5 flex gap-4">
                      <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <Link
                          to={`/produto/${item.id}`}
                          className="font-semibold text-text hover:text-primary transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatPrice(item.price)} cada
                        </p>
                      </div>
                    </div>

                    {/* Size */}
                    <div className="col-span-2 text-center">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                        {item.size}
                      </span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="col-span-2">
                      <div className="flex items-center justify-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.size, item.quantity - 1)
                          }
                          className="p-2 hover:bg-gray-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <FiMinus size={16} />
                        </button>
                        <span className="w-8 text-center font-semibold text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.size, item.quantity + 1)
                          }
                          className="p-2 hover:bg-gray-100 transition-colors"
                          disabled={item.quantity >= item.stock}
                          aria-label="Increase quantity"
                        >
                          <FiPlus size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="col-span-2 text-right">
                      <p className="font-bold text-primary">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <div className="col-span-1 text-right">
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                        aria-label="Remove from cart"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear Cart */}
              <div className="bg-gray-50 px-6 py-4 border-t text-right">
                <button
                  onClick={() => {
                    if (window.confirm('Deseja limpar o carrinho?')) {
                      clearCart();
                    }
                  }}
                  className="text-red-500 hover:text-red-700 font-semibold transition-colors"
                >
                  Limpar Carrinho
                </button>
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div>
            <div className="card p-6 sticky top-24 space-y-6">
              {/* Summary */}
              <div>
                <h3 className="text-lg font-bold mb-4">Resumo do Pedido</h3>
                <div className="space-y-3 pb-4 border-b">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Itens:</span>
                    <span className="font-semibold">{itemCount}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Calculation */}
              <div>
                <h4 className="font-semibold mb-3">Calcular Frete</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      CEP de Entrega
                    </label>
                    <input
                      type="text"
                      value={cepForShipping}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 8);
                        setCepForShipping(value);
                      }}
                      maxLength="8"
                      placeholder="00000000"
                      className="input w-full text-center"
                    />
                  </div>
                  <button
                    onClick={handleCalculateShipping}
                    disabled={loadingShipping || cepForShipping.length !== 8}
                    className="btn-outline w-full py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingShipping ? 'Calculando...' : 'Calcular'}
                  </button>

                  {shippingCalculated && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Frete estimado:</p>
                      <p className="text-lg font-bold text-primary">
                        {shippingCost === 0 ? 'Grátis' : formatPrice(shippingCost)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="pt-4 border-t space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(total)}
                  </span>
                </div>

                {shippingCost === 0 && subtotal >= 599 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                    <p className="text-xs font-semibold text-green-700">
                      Frete Grátis!
                    </p>
                  </div>
                )}

                <button
                  onClick={() => navigate('/checkout')}
                  className="btn-primary w-full py-3"
                >
                  Ir para Checkout
                </button>

                <button
                  onClick={() => navigate('/')}
                  className="btn-outline w-full py-3"
                >
                  Continuar Comprando
                </button>
              </div>

              {/* Info */}
              <div className="bg-tertiary/30 rounded-lg p-4 text-xs text-gray-600 space-y-2">
                <p>
                  <span className="font-semibold">Frete grátis</span> para pedidos acima de
                  R$ 599
                </p>
                <p>
                  <span className="font-semibold">Parcelamento</span> em até 12x no
                  cartão
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
