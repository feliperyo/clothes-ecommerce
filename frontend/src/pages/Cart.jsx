import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiLoader, FiTruck, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import SEO from '../components/SEO';
import { formatPrice, FREE_SHIPPING_THRESHOLD } from '../utils/helpers';
import { calculateShippingOptions } from '../utils/api';

const Cart = () => {
  const {
    cart, removeFromCart, updateQuantity, getTotal, clearCart,
    selectedShipping, selectShipping, shippingCep, saveShippingCep
  } = useCart();
  const navigate = useNavigate();

  const [cepInput, setCepInput] = useState(shippingCep || '');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [shippingCalculated, setShippingCalculated] = useState(false);
  const [freeShipping, setFreeShipping] = useState(false);

  const subtotal = getTotal();
  const shippingCost = freeShipping ? 0 : (selectedShipping?.price ?? 0);
  const total = subtotal + shippingCost;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Re-calcular frete se CEP já salvo e carrinho não vazio
  useEffect(() => {
    if (shippingCep && shippingCep.length === 8 && cart.length > 0) {
      setCepInput(shippingCep);
      fetchShippingOptions(shippingCep);
    }
  }, []);

  const fetchShippingOptions = async (cep) => {
    setLoadingShipping(true);
    try {
      const result = await calculateShippingOptions(
        cep,
        cart.map(item => ({ quantity: item.quantity })),
        subtotal
      );

      if (result.freeShipping) {
        setFreeShipping(true);
        setShippingOptions([]);
        selectShipping({ id: 0, name: 'Frete Grátis', company: '', price: 0, delivery_time: null });
      } else {
        setFreeShipping(false);
        setShippingOptions(result.options || []);
        // Manter opção já selecionada se ainda disponível, senão limpar
        if (selectedShipping && selectedShipping.id !== 0) {
          const stillAvailable = result.options?.find(o => o.id === selectedShipping.id);
          if (!stillAvailable) selectShipping(null);
        }
      }
      setShippingCalculated(true);
    } catch (err) {
      console.error('Erro ao calcular frete:', err);
      toast.error('Erro ao calcular frete. Tente novamente.');
    } finally {
      setLoadingShipping(false);
    }
  };

  const handleCalculateShipping = () => {
    const clean = cepInput.replace(/\D/g, '');
    if (clean.length !== 8) {
      toast.error('CEP inválido (8 dígitos)');
      return;
    }
    saveShippingCep(clean);
    fetchShippingOptions(clean);
  };

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
              <svg className="mx-auto w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 className="text-3xl font-display font-bold text-text mb-4">Seu Carrinho está Vazio</h1>
            <p className="text-gray-600 text-lg mb-8">Explore nossa coleção e encontre as peças perfeitas para você!</p>
            <button onClick={() => navigate('/')} className="btn-primary inline-block">Voltar à Loja</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section bg-background">
      <SEO title="Carrinho" noIndex={true} />
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
              {/* Header - Desktop only */}
              <div className="hidden md:grid bg-gray-50 px-6 py-4 border-b grid-cols-12 gap-4 items-center text-sm font-semibold text-gray-600">
                <div className="col-span-5">Produto</div>
                <div className="col-span-2 text-center">Tamanho</div>
                <div className="col-span-2 text-center">Quantidade</div>
                <div className="col-span-2 text-right">Subtotal</div>
                <div className="col-span-1"></div>
              </div>

              {/* Items */}
              <div className="divide-y">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors">
                    {/* Mobile Layout */}
                    <div className="md:hidden flex gap-3">
                      <div className="w-16 h-20 sm:w-20 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/produto/${item.id}`} className="font-semibold text-sm text-text hover:text-primary transition-colors line-clamp-2">{item.name}</Link>
                        <p className="text-xs text-gray-500 mt-1">Tam: {item.size}</p>
                        <p className="text-primary font-bold mt-1">{formatPrice(item.price)}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} className="p-3 hover:bg-gray-100 transition-colors" aria-label="Diminuir"><FiMinus size={16} /></button>
                            <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} className="p-3 hover:bg-gray-100 transition-colors" disabled={item.quantity >= item.stock} aria-label="Aumentar"><FiPlus size={16} /></button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-primary text-sm">{formatPrice(item.price * item.quantity)}</span>
                            <button onClick={() => removeFromCart(item.id, item.size)} className="text-red-500 hover:text-red-700 transition-colors p-1" aria-label="Remover"><FiTrash2 size={16} /></button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-5 flex gap-4">
                        <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <Link to={`/produto/${item.id}`} className="font-semibold text-text hover:text-primary transition-colors line-clamp-2">{item.name}</Link>
                          <p className="text-sm text-gray-600 mt-1">{formatPrice(item.price)} cada</p>
                        </div>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">{item.size}</span>
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center justify-center border border-gray-300 rounded-lg">
                          <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} className="p-2 hover:bg-gray-100 transition-colors" aria-label="Diminuir"><FiMinus size={16} /></button>
                          <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} className="p-2 hover:bg-gray-100 transition-colors" disabled={item.quantity >= item.stock} aria-label="Aumentar"><FiPlus size={16} /></button>
                        </div>
                      </div>
                      <div className="col-span-2 text-right">
                        <p className="font-bold text-primary">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                      <div className="col-span-1 text-right">
                        <button onClick={() => removeFromCart(item.id, item.size)} className="text-red-500 hover:text-red-700 transition-colors p-2" aria-label="Remover"><FiTrash2 size={18} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear Cart */}
              <div className="bg-gray-50 px-6 py-4 border-t text-right">
                <button
                  onClick={() => { if (window.confirm('Deseja limpar o carrinho?')) clearCart(); }}
                  className="text-red-500 hover:text-red-700 font-semibold transition-colors"
                >
                  Limpar Carrinho
                </button>
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div>
            <div className="card p-5 sm:p-6 lg:sticky top-24 space-y-6">
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
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <FiTruck size={16} />
                  Calcular Frete
                </h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={cepInput}
                      onChange={(e) => setCepInput(e.target.value.replace(/\D/g, '').slice(0, 8))}
                      onKeyDown={(e) => e.key === 'Enter' && handleCalculateShipping()}
                      maxLength="8"
                      placeholder="00000000"
                      className="input flex-1 text-center"
                    />
                    <button
                      onClick={handleCalculateShipping}
                      disabled={loadingShipping || cepInput.replace(/\D/g, '').length !== 8}
                      className="btn-outline px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      {loadingShipping ? <FiLoader className="animate-spin" size={16} /> : 'OK'}
                    </button>
                  </div>

                  {/* Free Shipping */}
                  {shippingCalculated && freeShipping && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                      <FiCheck className="text-green-600 flex-shrink-0" size={18} />
                      <div>
                        <p className="text-sm font-bold text-green-700">Frete Grátis!</p>
                        <p className="text-xs text-green-600">Pedido acima de R$ {FREE_SHIPPING_THRESHOLD}</p>
                      </div>
                    </div>
                  )}

                  {/* Shipping Options */}
                  {shippingCalculated && !freeShipping && shippingOptions.length > 0 && (
                    <div className="space-y-2">
                      {shippingOptions.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => selectShipping(opt)}
                          className={`w-full flex items-center justify-between p-3 border-2 rounded-lg text-left transition-all ${
                            selectedShipping?.id === opt.id
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                              selectedShipping?.id === opt.id ? 'border-primary bg-primary' : 'border-gray-400'
                            }`}>
                              {selectedShipping?.id === opt.id && (
                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-sm text-text">
                                {opt.name}
                                {opt.company && <span className="text-gray-500 font-normal"> · {opt.company}</span>}
                              </p>
                              <p className="text-xs text-gray-500">
                                {opt.delivery_time ? `${opt.delivery_time} dias úteis` : 'Prazo a confirmar'}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-primary ml-2 flex-shrink-0">
                            {formatPrice(opt.price)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {shippingCalculated && !freeShipping && shippingOptions.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-2">Nenhuma opção disponível para este CEP.</p>
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="pt-4 border-t space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Frete:</span>
                    <span className="font-semibold">
                      {!shippingCalculated
                        ? <span className="text-gray-400">— calcule acima</span>
                        : freeShipping
                          ? <span className="text-green-600">Grátis</span>
                          : selectedShipping
                            ? formatPrice(selectedShipping.price)
                            : <span className="text-gray-400">selecione uma opção</span>
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total:</span>
                    <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                {subtotal < FREE_SHIPPING_THRESHOLD && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                    Faltam <strong>{formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)}</strong> para frete grátis!
                  </div>
                )}

                <button
                  onClick={() => {
                    if (!shippingCalculated) {
                      toast.error('Calcule o frete antes de continuar');
                      return;
                    }
                    if (!freeShipping && !selectedShipping) {
                      toast.error('Selecione uma opção de frete');
                      return;
                    }
                    navigate('/checkout');
                  }}
                  className="btn-primary w-full py-3"
                >
                  Ir para Checkout
                </button>

                <button onClick={() => navigate('/')} className="btn-outline w-full py-3">
                  Continuar Comprando
                </button>
              </div>

              {/* Info */}
              <div className="bg-tertiary/30 rounded-lg p-4 text-xs text-gray-600 space-y-2">
                <p><span className="font-semibold">Frete grátis</span> para pedidos acima de R$ {FREE_SHIPPING_THRESHOLD}</p>
                <p><span className="font-semibold">Parcelamento</span> em até 12x no cartão</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
