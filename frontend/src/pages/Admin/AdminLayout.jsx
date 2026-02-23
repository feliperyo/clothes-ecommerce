import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiBarChart2,
  FiBox,
  FiTruck,
  FiTag
} from 'react-icons/fi';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar autenticação ao montar
  useEffect(() => {
    const token = localStorage.getItem('anacurve_admin_token');
    const adminUser = localStorage.getItem('anacurve_admin_user');

    if (!token || !adminUser) {
      navigate('/admin/login');
      return;
    }

    try {
      const parsedAdmin = JSON.parse(adminUser);
      setAdmin(parsedAdmin);
      setLoading(false);
    } catch (error) {
      localStorage.removeItem('anacurve_admin_token');
      localStorage.removeItem('anacurve_admin_user');
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('anacurve_admin_token');
    localStorage.removeItem('anacurve_admin_user');
    toast.success('Logout realizado com sucesso');
    navigate('/admin/login');
  };

  // Links de navegação da sidebar
  const navLinks = [
    {
      label: 'Dashboard',
      icon: FiBarChart2,
      path: '/admin',
      exact: true
    },
    {
      label: 'Produtos',
      icon: FiBox,
      path: '/admin/products'
    },
    {
      label: 'Pedidos',
      icon: FiTruck,
      path: '/admin/orders'
    },
    {
      label: 'Cupons',
      icon: FiTag,
      path: '/admin/coupons'
    }
  ];

  // Verificar se link está ativo
  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 border-r border-gray-200`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <Link to="/admin" className="flex items-center gap-3 no-underline">
            <img
              src="/assets/logo-ac.webp"
              alt="Ana Curve"
              className="h-12 w-auto"
            />
            <p className="text-xs text-gray-500">Admin Panel</p>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="mt-8">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path, link.exact);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors no-underline ${
                  active
                    ? 'bg-primary/10 text-primary border-r-4 border-primary'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 p-6 space-y-4">
          <div className="text-sm">
            <p className="text-gray-500 text-xs">Usuário Logado</p>
            <p className="font-semibold text-text capitalize">
              {admin?.name || admin?.username || 'Administrador'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors"
          >
            <FiLogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {sidebarOpen ? (
                  <FiX size={24} className="text-gray-600" />
                ) : (
                  <FiMenu size={24} className="text-gray-600" />
                )}
              </button>
              <h2 className="text-xl font-bold text-text">Painel Administrativo</h2>
            </div>

            {/* User Menu (Mobile) */}
            <div className="md:hidden">
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                title="Sair"
              >
                <FiLogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
