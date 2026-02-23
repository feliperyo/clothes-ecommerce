import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  getAllCoupons,
  createCouponAdmin,
  updateCouponAdmin,
  toggleCouponAdmin,
  deleteCouponAdmin
} from '../../utils/api';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiLoader,
  FiAlertCircle,
  FiSearch
} from 'react-icons/fi';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');

  // Form state
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await getAllCoupons();
      setCoupons(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Erro ao carregar cupons');
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setCode(coupon.code);
      setDiscountPercent(coupon.discountPercent.toString());
      setIsActive(coupon.isActive);
    } else {
      setEditingCoupon(null);
      setCode('');
      setDiscountPercent('');
      setIsActive(true);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
    setCode('');
    setDiscountPercent('');
    setIsActive(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim() || !discountPercent) {
      toast.error('Preencha código e percentual');
      return;
    }

    try {
      setSubmitting(true);
      const data = {
        code: code.toUpperCase().trim(),
        discountPercent: parseInt(discountPercent),
        isActive
      };

      if (editingCoupon) {
        const updated = await updateCouponAdmin(editingCoupon.id, data);
        setCoupons(coupons.map(c => c.id === editingCoupon.id ? updated : c));
        toast.success('Cupom atualizado!');
      } else {
        const created = await createCouponAdmin(data);
        setCoupons([created, ...coupons]);
        toast.success('Cupom criado!');
      }
      closeModal();
    } catch (error) {
      const msg = error.response?.data?.error || 'Erro ao salvar cupom';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (couponId) => {
    try {
      const updated = await toggleCouponAdmin(couponId);
      setCoupons(coupons.map(c => c.id === couponId ? updated : c));
      toast.success(updated.isActive ? 'Cupom ativado!' : 'Cupom desativado!');
    } catch {
      toast.error('Erro ao atualizar cupom');
    }
  };

  const handleDelete = async (couponId) => {
    if (!window.confirm('Tem certeza que deseja deletar este cupom?')) return;
    try {
      await deleteCouponAdmin(couponId);
      setCoupons(coupons.filter(c => c.id !== couponId));
      toast.success('Cupom deletado!');
    } catch {
      toast.error('Erro ao deletar cupom');
    }
  };

  const filteredCoupons = coupons.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FiLoader className="animate-spin text-primary mx-auto mb-3" size={40} />
          <p className="text-gray-600">Carregando cupons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text mb-1">Cupons</h1>
          <p className="text-sm text-gray-600">{coupons.length} cupons cadastrados</p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <FiPlus size={20} />
          Novo Cupom
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Buscar por código..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
        />
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredCoupons.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Código</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Desconto</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Criado em</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-text bg-gray-100 px-3 py-1 rounded">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-primary">{coupon.discountPercent}%</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggle(coupon.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          coupon.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {coupon.isActive ? 'Ativo' : 'Inativo'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs">
                      {new Date(coupon.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal(coupon)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Deletar"
                        >
                          <FiTrash2 size={16} />
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
            <p className="text-gray-500">
              {search ? 'Nenhum cupom encontrado' : 'Nenhum cupom cadastrado'}
            </p>
            {!search && (
              <button onClick={() => openModal()} className="btn-primary mt-4">
                Criar Primeiro Cupom
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl max-w-md w-full shadow-xl">
            <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-text">
                {editingCoupon ? 'Editar Cupom' : 'Novo Cupom'}
              </h2>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-lg">
                <FiX size={24} className="text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-text mb-2">Código do Cupom</label>
                <input
                  type="text"
                  placeholder="Ex: PROMO10"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">Desconto (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  placeholder="10"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-text">Cupom ativo</span>
              </label>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <><FiLoader className="animate-spin" size={18} /> Salvando...</>
                  ) : (
                    editingCoupon ? 'Atualizar' : 'Criar Cupom'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
