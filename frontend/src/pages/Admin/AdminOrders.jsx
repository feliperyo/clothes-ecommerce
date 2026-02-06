import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateTracking
} from '../../utils/api';
import { formatPrice, formatDate, getPaymentStatusLabel, getShippingStatusLabel, getStatusColor } from '../../utils/helpers';
import {
  FiEye,
  FiLoader,
  FiX,
  FiPackage,
  FiAlertCircle,
  FiCheck,
  FiTruck
} from 'react-icons/fi';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingTracking, setIsUpdatingTracking] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Erro ao carregar pedidos');
      console.error(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const openDetailModal = async (orderId) => {
    try {
      const orderData = await getOrderById(orderId);
      setSelectedOrder(orderData);
      setTrackingCode(orderData.trackingCode || '');
      setIsDetailModalOpen(true);
    } catch (error) {
      toast.error('Erro ao carregar detalhes do pedido');
    }
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedOrder(null);
    setTrackingCode('');
  };

  const handleUpdatePaymentStatus = async (newStatus) => {
    if (!selectedOrder) return;

    try {
      setIsUpdatingStatus(true);
      const updated = await updateOrderStatus(selectedOrder.id, {
        paymentStatus: newStatus
      });

      setOrders(orders.map(o => o.id === selectedOrder.id ? updated : o));
      setSelectedOrder(updated);
      toast.success('Status de pagamento atualizado!');
    } catch (error) {
      toast.error('Erro ao atualizar status de pagamento');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleUpdateShippingStatus = async (newStatus) => {
    if (!selectedOrder) return;

    try {
      setIsUpdatingStatus(true);
      const updated = await updateOrderStatus(selectedOrder.id, {
        shippingStatus: newStatus
      });

      setOrders(orders.map(o => o.id === selectedOrder.id ? updated : o));
      setSelectedOrder(updated);
      toast.success('Status de envio atualizado!');
    } catch (error) {
      toast.error('Erro ao atualizar status de envio');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleUpdateTracking = async () => {
    if (!selectedOrder || !trackingCode.trim()) {
      toast.error('Digite um código de rastreio');
      return;
    }

    try {
      setIsUpdatingTracking(true);
      const updated = await updateTracking(selectedOrder.id, trackingCode);
      setOrders(orders.map(o => o.id === selectedOrder.id ? updated : o));
      setSelectedOrder(updated);
      toast.success('Código de rastreio atualizado!');
    } catch (error) {
      toast.error('Erro ao atualizar código de rastreio');
    } finally {
      setIsUpdatingTracking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FiLoader className="animate-spin text-primary mx-auto mb-3" size={40} />
          <p className="text-gray-600">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-text mb-2">Pedidos</h1>
        <p className="text-gray-600">{orders.length} pedidos no total</p>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">
                    Pedido
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">
                    Pagamento
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">
                    Envio
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">
                    Data
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-text">
                      #{order.orderNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-text">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.customerEmail}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-primary">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>
                        {getPaymentStatusLabel(order.paymentStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.shippingStatus)}`}>
                        {getShippingStatusLabel(order.shippingStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openDetailModal(order.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver Detalhes"
                      >
                        <FiEye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <FiAlertCircle className="text-gray-300 mx-auto mb-3" size={48} />
            <p className="text-gray-500">Nenhum pedido cadastrado</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-text">
                Pedido #{selectedOrder.orderNumber}
              </h2>
              <button
                onClick={closeDetailModal}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 font-medium mb-1">
                    CLIENTE
                  </p>
                  <p className="font-semibold text-text">
                    {selectedOrder.customerName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.customerEmail}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 font-medium mb-1">
                    TOTAL
                  </p>
                  <p className="font-semibold text-2xl text-primary">
                    {formatPrice(selectedOrder.total)}
                  </p>
                </div>
              </div>

              {/* Status Update */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-bold text-text mb-4">
                  Atualizar Status
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Payment Status */}
                  <div>
                    <label className="block text-sm font-semibold text-text mb-3">
                      Status de Pagamento
                    </label>
                    <div className="space-y-2">
                      {['PENDING', 'PAID', 'CANCELLED', 'REFUNDED'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleUpdatePaymentStatus(status)}
                          disabled={isUpdatingStatus}
                          className={`w-full px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                            selectedOrder.paymentStatus === status
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          } disabled:opacity-50`}
                        >
                          {getPaymentStatusLabel(status)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Status */}
                  <div>
                    <label className="block text-sm font-semibold text-text mb-3">
                      Status de Envio
                    </label>
                    <div className="space-y-2">
                      {['PROCESSING', 'SHIPPED', 'DELIVERED'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleUpdateShippingStatus(status)}
                          disabled={isUpdatingStatus}
                          className={`w-full px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                            selectedOrder.shippingStatus === status
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          } disabled:opacity-50`}
                        >
                          {getShippingStatusLabel(status)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tracking Code */}
              <div className="border-t pt-6">
                <label className="block text-sm font-semibold text-text mb-3">
                  Código de Rastreio
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Digite o código de rastreio"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    onClick={handleUpdateTracking}
                    disabled={isUpdatingTracking}
                    className="btn-primary px-6 flex items-center gap-2"
                  >
                    {isUpdatingTracking ? (
                      <FiLoader className="animate-spin" size={18} />
                    ) : (
                      <FiTruck size={18} />
                    )}
                    Atualizar
                  </button>
                </div>
                {selectedOrder.trackingCode && (
                  <p className="text-sm text-gray-500 mt-2">
                    Rastreio atual: <span className="font-mono font-semibold text-text">{selectedOrder.trackingCode}</span>
                  </p>
                )}
              </div>

              {/* Order Items */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-bold text-text mb-4">
                  Itens do Pedido
                </h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-text">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Tamanho: {item.size} | Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatPrice(item.price)} cada
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      Nenhum item neste pedido
                    </p>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-bold text-text mb-4">
                  Endereço de Entrega
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 text-sm">
                  <p className="text-text mb-1">
                    {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.number}
                  </p>
                  {selectedOrder.shippingAddress?.complement && (
                    <p className="text-gray-600 mb-1">
                      {selectedOrder.shippingAddress.complement}
                    </p>
                  )}
                  <p className="text-gray-600 mb-1">
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}
                  </p>
                  <p className="text-gray-600">
                    CEP: {selectedOrder.shippingAddress?.cep}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <div className="border-t pt-6 flex gap-3">
                <button
                  onClick={closeDetailModal}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
