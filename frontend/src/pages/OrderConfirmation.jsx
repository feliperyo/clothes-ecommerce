import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiCheck,
  FiClock,
  FiTruck,
  FiDownload,
  FiMail,
} from 'react-icons/fi';
import { getOrderByNumber } from '../utils/api';
import { formatPrice, formatDate, getPaymentStatusLabel } from '../utils/helpers';

const OrderConfirmation = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getOrderByNumber(orderNumber);
        setOrder(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar pedido:', err);
        setError('Não foi possível carregar os detalhes do pedido.');
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber]);

  const getPaymentStatusColor = (status) => {
    const colors = {
      PENDING: 'text-yellow-600 bg-yellow-50',
      PAID: 'text-green-600 bg-green-50',
      CANCELLED: 'text-red-600 bg-red-50',
      REFUNDED: 'text-blue-600 bg-blue-50',
    };
    return colors[status] || 'text-gray-600 bg-gray-50';
  };

  const getShippingStatusIcon = (status) => {
    const icons = {
      PROCESSING: FiClock,
      SHIPPED: FiTruck,
      DELIVERED: FiCheck,
    };
    return icons[status] || FiClock;
  };

  if (loading) {
    return (
      <div className="section bg-background">
        <div className="container">
          <div className="flex justify-center py-16">
            <div className="spinner" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
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
              Pedido não encontrado
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              {error || 'Não conseguimos encontrar este pedido.'}
            </p>
            <button onClick={() => navigate('/')} className="btn-primary">
              Voltar à Loja
            </button>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = (order.items || []).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal + order.shippingCost - (order.discount || 0);
  const ShippingIcon = getShippingStatusIcon(order.status);

  return (
    <div className="section bg-background">
      <div className="container">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-primary font-semibold mb-8 hover:gap-3 transition-all"
        >
          <FiArrowLeft size={20} />
          Voltar à Loja
        </button>

        {/* Success Message */}
        <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-8 mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-scale-in">
              <FiCheck size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-display font-bold text-text mb-2">
            Pedido Confirmado!
          </h1>
          <p className="text-gray-600 text-lg mb-4">
            Obrigada por sua compra! Você receberá um e-mail de confirmação em breve.
          </p>
          <p className="text-2xl font-bold text-primary">
            Pedido #{order.orderNumber}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-6">Status do Pedido</h2>

              {/* Timeline */}
              <div className="space-y-4 mb-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white mb-2">
                      <FiCheck size={20} />
                    </div>
                    <div className="w-1 flex-1 bg-green-200 my-2" />
                  </div>
                  <div>
                    <p className="font-semibold text-text">Pedido Confirmado</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        order.paymentStatus === 'PAID'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      <FiCheck size={20} />
                    </div>
                    <div className="w-1 flex-1 bg-gray-200 my-2" />
                  </div>
                  <div>
                    <p className="font-semibold text-text">Pagamento Processado</p>
                    <p className="text-sm text-gray-600">
                      {order.paymentStatus === 'PAID'
                        ? 'Seu pagamento foi aprovado'
                        : 'Aguardando confirmação de pagamento'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        order.status === 'SHIPPED' || order.status === 'DELIVERED'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      <FiTruck size={20} />
                    </div>
                    <div className="w-1 flex-1 bg-gray-200 my-2" />
                  </div>
                  <div>
                    <p className="font-semibold text-text">Preparando Envio</p>
                    <p className="text-sm text-gray-600">
                      Seu pedido será enviado em breve
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        order.status === 'DELIVERED'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      <FiCheck size={20} />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-text">Entregue</p>
                    <p className="text-sm text-gray-600">
                      Acompanhe seu pedido para saber quando chegará
                    </p>
                  </div>
                </div>
              </div>

              {/* Tracking Info */}
              {order.trackingCode && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Código de Rastreamento</p>
                  <p className="font-mono font-bold text-lg text-primary mb-3">
                    {order.trackingCode}
                  </p>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-semibold">
                    Rastrear Entrega
                  </button>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Itens do Pedido</h2>
              <div className="space-y-4">
                {(order.items || []).map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-text mb-1">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Tamanho: <span className="font-medium">{item.size}</span>
                        {' | '}
                        Quantidade: <span className="font-medium">{item.quantity}</span>
                      </p>
                      <p className="text-primary font-bold">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Info */}
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Informações do Cliente</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-600 text-sm mb-2">
                    Dados Pessoais
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-text font-semibold">{order.customer.name}</p>
                    <p className="text-gray-600">{order.customer.email}</p>
                    <p className="text-gray-600">{order.customer.phone}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-600 text-sm mb-2">
                    Endereço de Entrega
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-text font-semibold">
                      {order.address.street}, {order.address.number}
                    </p>
                    {order.address.complement && (
                      <p className="text-gray-600">{order.address.complement}</p>
                    )}
                    <p className="text-gray-600">
                      {order.address.neighborhood}, {order.address.city} -{' '}
                      {order.address.state}
                    </p>
                    <p className="text-gray-600">{order.address.zipCode}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Status */}
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">Status de Pagamento</h3>
              <div
                className={`rounded-lg p-4 mb-4 text-center ${getPaymentStatusColor(
                  order.paymentStatus
                )}`}
              >
                <p className="font-bold">
                  {getPaymentStatusLabel(order.paymentStatus)}
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Método:</span>
                  <span className="font-semibold text-text capitalize">
                    {order.paymentMethod === 'credit_card'
                      ? 'Cartão de Crédito'
                      : order.paymentMethod === 'pix'
                      ? 'Pix'
                      : 'Boleto'}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">Resumo do Pedido</h3>
              <div className="space-y-3 mb-4 pb-4 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frete:</span>
                  <span className="font-semibold">
                    {order.shippingCost === 0
                      ? 'Grátis'
                      : formatPrice(order.shippingCost)}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Desconto:</span>
                    <span className="font-semibold text-green-600">
                      -{formatPrice(order.discount)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-lg">Total:</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {/* Order Details */}
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">Detalhes do Pedido</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Número do Pedido</p>
                  <p className="font-mono font-bold text-primary">
                    #{order.orderNumber}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Data do Pedido</p>
                  <p className="font-semibold text-text">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button className="btn-primary w-full flex items-center justify-center gap-2">
                <FiDownload size={18} />
                Baixar Invoice
              </button>
              <button className="btn-outline w-full flex items-center justify-center gap-2">
                <FiMail size={18} />
                Reenviar Confirmação
              </button>
            </div>

            {/* Help */}
            <div className="bg-tertiary/30 rounded-lg p-4 text-sm text-center">
              <p className="text-gray-700 mb-3">
                Alguma dúvida sobre seu pedido?
              </p>
              <Link to="/" className="text-primary hover:underline font-semibold">
                Fale Conosco
              </Link>
            </div>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Quer explorar mais produtos?</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary inline-block"
          >
            Continuar Comprando
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
