import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getDashboard } from '../../utils/api';
import { formatPrice, formatDate, getPaymentStatusLabel, getShippingStatusLabel, getStatusColor } from '../../utils/helpers';
import {
  FiBox,
  FiShoppingCart,
  FiDollarSign,
  FiTrendingUp,
  FiLoader,
  FiAlertCircle
} from 'react-icons/fi';

const StatCard = ({ icon: Icon, label, value, color = 'text-primary' }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
        <p className="text-3xl font-bold text-text">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${color.replace('text', 'bg')}/10`}>
        <Icon className={`${color}`} size={24} />
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDashboard();
      setDashboard(data);
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao carregar dashboard';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FiLoader className="animate-spin text-primary mx-auto mb-3" size={40} />
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <FiAlertCircle className="text-red-600 mx-auto mb-3" size={40} />
        <p className="text-red-600 font-medium">{error}</p>
        <button
          onClick={fetchDashboard}
          className="btn-primary mt-4"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  const stats = [
    {
      icon: FiBox,
      label: 'Total de Produtos',
      value: dashboard?.totalProducts || 0,
      color: 'text-blue-600'
    },
    {
      icon: FiShoppingCart,
      label: 'Total de Pedidos',
      value: dashboard?.totalOrders || 0,
      color: 'text-green-600'
    },
    {
      icon: FiDollarSign,
      label: 'Receita Total',
      value: formatPrice(dashboard?.totalRevenue || 0),
      color: 'text-emerald-600'
    },
    {
      icon: FiTrendingUp,
      label: 'Pedidos Pendentes',
      value: dashboard?.pendingOrders || 0,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-text mb-2">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo ao painel administrativo</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            color={stat.color}
          />
        ))}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-text">Pedidos Recentes</h2>
        </div>

        {dashboard?.recentOrders && dashboard.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Pedido
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Pagamento
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Envio
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dashboard.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-text">
                      #{order.orderNumber}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {order.customerName}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <FiShoppingCart className="text-gray-300 mx-auto mb-3" size={48} />
            <p className="text-gray-500">Nenhum pedido disponível</p>
          </div>
        )}
      </div>

      {/* Products Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-text">Produtos Mais Vendidos</h2>
          </div>

          {dashboard?.topProducts && dashboard.topProducts.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {dashboard.topProducts.map((product, index) => (
                <div key={product.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-semibold text-gray-600">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-text text-sm">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.sales} vendas
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-primary">
                      {formatPrice(product.revenue)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              Nenhum produto com vendas
            </div>
          )}
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-text">Produtos com Baixo Estoque</h2>
          </div>

          {dashboard?.lowStockProducts && dashboard.lowStockProducts.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {dashboard.lowStockProducts.map((product) => (
                <div key={product.id} className="px-6 py-4 hover:bg-red-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-text text-sm">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.category}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                      {product.stock} un.
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              Todos os produtos possuem bom estoque
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
