import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import SEO from '../components/SEO';
import { createOrder, fetchAddressByCep } from '../utils/api';
import { formatPrice, formatCEP, validateCPF, calculateShipping } from '../utils/helpers';

const Checkout = () => {
  const { cart, getTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [shippingCost, setShippingCost] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm();

  const watchCep = watch('zipCode');

  const handleCepBlur = async () => {
    if (watchCep && watchCep.length === 8) {
      try {
        const address = await fetchAddressByCep(watchCep);
        setValue('street', address.logradouro);
        setValue('neighborhood', address.bairro);
        setValue('city', address.localidade);
        setValue('state', address.uf);

        // Calculate shipping
        const shipping = calculateShipping(watchCep, getTotal());
        setShippingCost(shipping);

        toast.success('Endereço encontrado!');
      } catch (error) {
        toast.error('CEP não encontrado');
      }
    }
  };

  const onSubmit = async (data) => {
    if (!validateCPF(data.customerCPF)) {
      toast.error('CPF inválido');
      return;
    }

    if (cart.length === 0) {
      toast.error('Carrinho vazio');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customer: {
          name: data.customerName,
          email: data.customerEmail,
          phone: data.customerPhone,
          cpf: data.customerCPF.replace(/\D/g, '')
        },
        address: {
          zipCode: data.zipCode.replace(/\D/g, ''),
          street: data.street,
          number: data.number,
          complement: data.complement,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state
        },
        items: cart.map(item => ({
          productId: item.id,
          size: item.size,
          quantity: item.quantity
        })),
        paymentMethod,
        shippingCost,
        discount: 0
      };

      const response = await createOrder(orderData);

      // Clear cart
      clearCart();

      // Redirect to payment
      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      } else {
        navigate(`/pedido-confirmado/${response.orderNumber}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Erro ao criar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="section">
        <div className="container max-w-2xl text-center">
          <h1 className="text-3xl font-bold mb-4">Carrinho Vazio</h1>
          <p className="text-gray-600 mb-6">
            Adicione produtos ao carrinho para continuar com a compra.
          </p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Continuar Comprando
          </button>
        </div>
      </div>
    );
  }

  const subtotal = getTotal();
  const total = subtotal + shippingCost;

  return (
    <div className="section bg-background">
      <SEO title="Checkout" noIndex={true} />
      <div className="container">
        <h1 className="text-3xl font-bold text-center mb-8">Finalizar Compra</h1>

        {/* Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    s <= step
                      ? 'bg-primary text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      s < step ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="card p-6">
              {/* Step 1: Customer Data */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Dados Pessoais</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="label">Nome Completo *</label>
                      <input
                        {...register('customerName', { required: true })}
                        className={errors.customerName ? 'input-error' : 'input'}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">CPF *</label>
                        <input
                          {...register('customerCPF', { required: true })}
                          className={errors.customerCPF ? 'input-error' : 'input'}
                          placeholder="000.000.000-00"
                        />
                      </div>
                      <div>
                        <label className="label">Telefone/WhatsApp *</label>
                        <input
                          {...register('customerPhone', { required: true })}
                          className={errors.customerPhone ? 'input-error' : 'input'}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="label">E-mail *</label>
                      <input
                        type="email"
                        {...register('customerEmail', { required: true })}
                        className={errors.customerEmail ? 'input-error' : 'input'}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn-primary w-full mt-6"
                  >
                    Continuar
                  </button>
                </div>
              )}

              {/* Step 2: Address */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Endereço de Entrega</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="label">CEP *</label>
                      <input
                        {...register('zipCode', { required: true })}
                        onBlur={handleCepBlur}
                        className={errors.zipCode ? 'input-error' : 'input'}
                        placeholder="00000-000"
                        maxLength={8}
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="label">Rua *</label>
                        <input
                          {...register('street', { required: true })}
                          className={errors.street ? 'input-error' : 'input'}
                        />
                      </div>
                      <div>
                        <label className="label">Número *</label>
                        <input
                          {...register('number', { required: true })}
                          className={errors.number ? 'input-error' : 'input'}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="label">Complemento</label>
                      <input {...register('complement')} className="input" />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="label">Bairro *</label>
                        <input
                          {...register('neighborhood', { required: true })}
                          className={errors.neighborhood ? 'input-error' : 'input'}
                        />
                      </div>
                      <div>
                        <label className="label">Cidade *</label>
                        <input
                          {...register('city', { required: true })}
                          className={errors.city ? 'input-error' : 'input'}
                        />
                      </div>
                      <div>
                        <label className="label">Estado *</label>
                        <input
                          {...register('state', { required: true })}
                          className={errors.state ? 'input-error' : 'input'}
                          maxLength={2}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn-outline flex-1"
                    >
                      Voltar
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="btn-primary flex-1"
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Forma de Pagamento</h2>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-primary transition-colors">
                      <input
                        type="radio"
                        value="credit_card"
                        checked={paymentMethod === 'credit_card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <p className="font-semibold">Cartão de Crédito</p>
                        <p className="text-sm text-gray-600">Parcele em até 12x sem juros</p>
                      </div>
                    </label>
                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-primary transition-colors">
                      <input
                        type="radio"
                        value="pix"
                        checked={paymentMethod === 'pix'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <p className="font-semibold">Pix</p>
                        <p className="text-sm text-gray-600">Aprovação imediata</p>
                      </div>
                    </label>
                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-primary transition-colors">
                      <input
                        type="radio"
                        value="boleto"
                        checked={paymentMethod === 'boleto'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <p className="font-semibold">Boleto Bancário</p>
                        <p className="text-sm text-gray-600">Vencimento em 3 dias úteis</p>
                      </div>
                    </label>
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn-outline flex-1"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex-1"
                    >
                      {loading ? 'Processando...' : 'Finalizar Pedido'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Summary */}
          <div>
            <div className="card p-6 sticky top-24">
              <h3 className="text-lg font-bold mb-4">Resumo do Pedido</h3>
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-3 text-sm">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-semibold line-clamp-2">{item.name}</p>
                      <p className="text-gray-600">
                        Tam: {item.size} | Qtd: {item.quantity}
                      </p>
                      <p className="text-primary font-bold">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete:</span>
                  <span className="font-semibold">
                    {shippingCost === 0 ? 'Grátis' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold text-primary pt-2 border-t">
                  <span>Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
