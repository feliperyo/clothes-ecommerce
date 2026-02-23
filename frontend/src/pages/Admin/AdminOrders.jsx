import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateTracking,
  generateShippingLabel,
  deleteOrder
} from '../../utils/api';
import { formatPrice, formatDate, getPaymentStatusLabel, getShippingStatusLabel, getStatusColor } from '../../utils/helpers';
import {
  FiEye,
  FiLoader,
  FiX,
  FiPackage,
  FiAlertCircle,
  FiCheck,
  FiTruck,
  FiDownload,
  FiSearch,
  FiTrash2
} from 'react-icons/fi';

const STATUS_TABS = [
  { key: '', label: 'Todos' },
  { key: 'PENDING', label: 'Pendentes' },
  { key: 'PAID', label: 'Pagos' },
  { key: 'PROCESSING', label: 'Processando' },
  { key: 'SHIPPED', label: 'Enviados' },
  { key: 'DELIVERED', label: 'Entregues' },
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingTracking, setIsUpdatingTracking] = useState(false);
  const [isGeneratingLabel, setIsGeneratingLabel] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

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
      const updated = await updateOrderStatus(selectedOrder.id, { paymentStatus: newStatus });
      setOrders(orders.map(o => o.id === selectedOrder.id ? updated : o));
      setSelectedOrder(updated);
      toast.success('Status de pagamento atualizado!');
    } catch {
      toast.error('Erro ao atualizar status de pagamento');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleUpdateShippingStatus = async (newStatus) => {
    if (!selectedOrder) return;
    try {
      setIsUpdatingStatus(true);
      const updated = await updateOrderStatus(selectedOrder.id, { shippingStatus: newStatus });
      setOrders(orders.map(o => o.id === selectedOrder.id ? updated : o));
      setSelectedOrder(updated);
      toast.success('Status de envio atualizado!');
    } catch {
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
    } catch {
      toast.error('Erro ao atualizar código de rastreio');
    } finally {
      setIsUpdatingTracking(false);
    }
  };

  const handleDeleteOrder = async (orderId, orderNumber) => {
    if (!window.confirm(`Tem certeza que deseja excluir o pedido #${orderNumber}? Esta ação não pode ser desfeita.`)) return;
    try {
      await deleteOrder(orderId);
      setOrders(orders.filter(o => o.id !== orderId));
      toast.success('Pedido excluído com sucesso!');
    } catch {
      toast.error('Erro ao excluir pedido');
    }
  };

  const handleGenerateLabel = async () => {
    if (!selectedOrder) return;
    try {
      setIsGeneratingLabel(true);
      const result = await generateShippingLabel(selectedOrder.id);
      const updated = { ...selectedOrder, superfreteOrderId: result.superfreteOrderId, superfreteLabel: result.label };
      setSelectedOrder(updated);
      setOrders(orders.map(o => o.id === selectedOrder.id ? updated : o));
      if (result.label) {
        toast.success('Etiqueta gerada com sucesso!');
        window.open(result.label, '_blank');
      }
    } catch (err) {
      const msg = err?.response?.data?.error || 'Erro ao gerar etiqueta';
      toast.error(msg);
    } finally {
      setIsGeneratingLabel(false);
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

  const filteredOrders = orders.filter(o => {
    if (search) {
      const q = search.toLowerCase();
      const matchesSearch = o.orderNumber?.toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q) ||
        o.customerEmail?.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }
    if (statusFilter) {
      if (statusFilter === 'PENDING' || statusFilter === 'PAID') {
        if (o.paymentStatus !== statusFilter) return false;
      } else {
        if (o.shippingStatus !== statusFilter) return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text mb-2">Pedidos</h1>
        <p className="text-gray-600">{filteredOrders.length} de {orders.length} pedidos</p>
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Buscar por número, nome ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
        />
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              statusFilter === tab.key
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Pedido</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Cliente</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Total</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Pagamento</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Envio</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Data</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-text">#{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-text">{order.customerName}</p>
                        <p className="text-xs text-gray-500">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-primary">{formatPrice(order.total)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>
                        {getPaymentStatusLabel(order.paymentStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${getStatusColor(order.shippingStatus)}`}>
                          {getShippingStatusLabel(order.shippingStatus)}
                        </span>
                        {order.shippingService && (
                          <span className="text-xs text-gray-500">{order.shippingService}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openDetailModal(order.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver Detalhes"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id, order.orderNumber)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir Pedido"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
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
              <h2 className="text-2xl font-bold text-text">Pedido #{selectedOrder.orderNumber}</h2>
              <button onClick={closeDetailModal} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <FiX size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 font-medium mb-1">CLIENTE</p>
                  <p className="font-semibold text-text">{selectedOrder.customerName}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customerEmail}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 font-medium mb-1">TOTAL</p>
                  <p className="font-semibold text-2xl text-primary">{formatPrice(selectedOrder.total)}</p>
                  {selectedOrder.shippingService && (
                    <p className="text-xs text-gray-500 mt-1">
                      Frete: {selectedOrder.shippingService} · {formatPrice(selectedOrder.shippingCost)}
                    </p>
                  )}
                </div>
              </div>

              {/* Super Frete Label Section */}
              <div className="border rounded-xl p-5 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="flex items-center gap-2 mb-3">
                  <FiTruck className="text-blue-600" size={20} />
                  <h3 className="text-base font-bold text-blue-900">Super Frete — Etiqueta de Envio</h3>
                </div>

                {selectedOrder.shippingService && (
                  <p className="text-sm text-blue-700 mb-3">
                    Serviço selecionado: <strong>{selectedOrder.shippingService}</strong>
                  </p>
                )}

                {selectedOrder.superfreteLabel ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                      <FiCheck size={16} />
                      Etiqueta gerada com sucesso
                    </div>
                    <a
                      href={selectedOrder.superfreteLabel}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      <FiDownload size={16} />
                      Baixar Etiqueta PDF
                    </a>
                    {selectedOrder.superfreteOrderId && (
                      <p className="text-xs text-gray-500">
                        ID Super Frete: <span className="font-mono">{selectedOrder.superfreteOrderId}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">
                      Clique para criar o pedido no Super Frete e gerar a etiqueta de envio.
                      O saldo da sua conta Super Frete será utilizado.
                    </p>
                    <button
                      onClick={handleGenerateLabel}
                      disabled={isGeneratingLabel}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
                    >
                      {isGeneratingLabel ? (
                        <><FiLoader className="animate-spin" size={16} /> Gerando etiqueta...</>
                      ) : (
                        <><FiPackage size={16} /> Gerar Etiqueta Super Frete</>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Status Update */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-bold text-text mb-4">Atualizar Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-text mb-3">Status de Pagamento</label>
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

                  <div>
                    <label className="block text-sm font-semibold text-text mb-3">Status de Envio</label>
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
                <label className="block text-sm font-semibold text-text mb-3">Código de Rastreio</label>
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
                    {isUpdatingTracking ? <FiLoader className="animate-spin" size={18} /> : <FiTruck size={18} />}
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
                <h3 className="text-lg font-bold text-text mb-4">Itens do Pedido</h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-text">{item.productName || item.name}</p>
                          <p className="text-sm text-gray-600">Tamanho: {item.size} | Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">
                            {formatPrice((item.productPrice || item.price) * item.quantity)}
                          </p>
                          <p className="text-xs text-gray-500">{formatPrice(item.productPrice || item.price)} cada</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">Nenhum item neste pedido</p>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-bold text-text mb-4">Endereço de Entrega</h3>
                <div className="bg-gray-50 rounded-lg p-4 text-sm">
                  <p className="text-text mb-1">{selectedOrder.street}, {selectedOrder.number}</p>
                  {selectedOrder.complement && <p className="text-gray-600 mb-1">{selectedOrder.complement}</p>}
                  <p className="text-gray-600 mb-1">{selectedOrder.neighborhood} — {selectedOrder.city}, {selectedOrder.state}</p>
                  <p className="text-gray-600">CEP: {selectedOrder.zipCode}</p>
                </div>
              </div>

              {/* Close */}
              <div className="border-t pt-6">
                <button
                  onClick={closeDetailModal}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
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
