import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiSearch, FiMenu, FiX } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatPrice, FREE_SHIPPING_THRESHOLD } from '../utils/helpers';

const Header = () => {
  const { getItemCount, getTotal, toggleCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const itemCount = getItemCount();
  const cartTotal = getTotal();

  return (
    <header className="bg-white shadow-md sticky top-0 z-30">
      {/* Top Banner - Scrolling Marquee */}
      <div className="bg-gradient-primary text-white py-2 overflow-hidden">
        <div className="animate-marquee flex whitespace-nowrap">
          <span className="mx-4 sm:mx-8 font-medium text-xs sm:text-sm">{`✨ Frete Grátis acima de R$ ${FREE_SHIPPING_THRESHOLD}`}</span>
          <span className="mx-4 sm:mx-8 font-medium text-xs sm:text-sm">💳 Parcele em até 10x sem juros</span>
          <span className="mx-4 sm:mx-8 font-medium text-xs sm:text-sm">🔥 Novidades toda semana</span>
          <span className="mx-4 sm:mx-8 font-medium text-xs sm:text-sm">🚚 Entrega rápida para todo Brasil</span>
          <a href="https://wa.me/5511913762420" target="_blank" rel="noopener noreferrer" className="mx-4 sm:mx-8 font-medium text-xs sm:text-sm hover:underline">📱 WhatsApp: (11) 91376-2420</a>
          <span className="mx-4 sm:mx-8 font-medium text-xs sm:text-sm">{`✨ Frete Grátis acima de R$ ${FREE_SHIPPING_THRESHOLD}`}</span>
          <span className="mx-4 sm:mx-8 font-medium text-xs sm:text-sm">💳 Parcele em até 10x sem juros</span>
          <span className="mx-4 sm:mx-8 font-medium text-xs sm:text-sm">🔥 Novidades toda semana</span>
          <span className="mx-4 sm:mx-8 font-medium text-xs sm:text-sm">🚚 Entrega rápida para todo Brasil</span>
          <a href="https://wa.me/5511913762420" target="_blank" rel="noopener noreferrer" className="mx-4 sm:mx-8 font-medium text-xs sm:text-sm hover:underline">📱 WhatsApp: (11) 91376-2420</a>
        </div>
      </div>

      {/* Main Header */}
      <div className="container">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3">
            <img
              src="/assets/logo-ac.webp"
              alt="Ana Curve"
              className="h-10 sm:h-12 md:h-14 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-text hover:text-primary transition-colors font-medium">
              Início
            </Link>
            <Link to="/?newest=true" className="text-text hover:text-primary transition-colors font-medium">
              Novidades
            </Link>
            <Link to="/colecoes" className="text-text hover:text-primary transition-colors font-medium">
              Coleções
            </Link>
            <Link to="/?promotion=true" className="text-text hover:text-primary transition-colors font-medium">
              Promoções
            </Link>
          </nav>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
              >
                <FiSearch size={20} />
              </button>
            </div>
          </form>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative group"
              aria-label="Carrinho de compras"
            >
              <FiShoppingCart
                size={24}
                className="text-text group-hover:text-primary transition-colors"
              />
              {itemCount > 0 && (
                <>
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                  <div className="hidden md:block absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap">
                    <p className="text-sm text-gray-600">
                      {itemCount} {itemCount === 1 ? 'item' : 'itens'}
                    </p>
                    <p className="text-lg font-bold text-primary">
                      {formatPrice(cartTotal)}
                    </p>
                  </div>
                </>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-text"
              aria-label="Menu"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <FiSearch size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Categories Bar - Desktop */}
      <div className="hidden lg:block border-t bg-white">
        <div className="container">
          <nav className="flex items-center justify-center space-x-6 py-2.5 text-sm">
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-text hover:text-primary transition-colors font-medium whitespace-nowrap">
              Todos os Produtos
            </Link>
            <Link to="/categoria/Blusas" className="text-text hover:text-primary transition-colors font-medium whitespace-nowrap">
              Blusas
            </Link>
            <Link to="/categoria/Calças" className="text-text hover:text-primary transition-colors font-medium whitespace-nowrap">
              Calças
            </Link>
            <Link to="/categoria/Vestidos" className="text-text hover:text-primary transition-colors font-medium whitespace-nowrap">
              Vestidos
            </Link>
            <Link to="/categoria/Conjuntos" className="text-text hover:text-primary transition-colors font-medium whitespace-nowrap">
              Conjuntos
            </Link>
            <Link to="/categoria/Macaquinho/Macacão" className="text-text hover:text-primary transition-colors font-medium whitespace-nowrap">
              Macaquinho/Macacão
            </Link>
            <Link to="/categoria/Saias" className="text-text hover:text-primary transition-colors font-medium whitespace-nowrap">
              Saias
            </Link>
            <Link to="/categoria/Shorts" className="text-text hover:text-primary transition-colors font-medium whitespace-nowrap">
              Shorts
            </Link>
            <Link to="/categoria/Short / Short Saia" className="text-text hover:text-primary transition-colors font-medium whitespace-nowrap">
              Short Saia
            </Link>
            <Link to="/categoria/Blazer/Jaqueta" className="text-text hover:text-primary transition-colors font-medium whitespace-nowrap">
              Blazer/Jaqueta
            </Link>
            <Link to="/categoria/Acessórios" className="text-text hover:text-primary transition-colors font-medium whitespace-nowrap">
              Acessórios
            </Link>
            <Link to="/pre-venda" className="text-primary hover:text-primary/80 transition-colors font-semibold whitespace-nowrap">
              Pré-Venda
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <nav className="container py-4 space-y-1 max-h-[calc(100vh-130px)] overflow-y-auto">
            <Link
              to="/"
              onClick={() => { setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="block py-3 border-b border-gray-100 text-text hover:text-primary transition-colors font-medium"
            >
              Todos os Produtos
            </Link>
            <Link
              to="/?newest=true"
              onClick={() => setIsMenuOpen(false)}
              className="block py-3 border-b border-gray-100 text-text hover:text-primary transition-colors font-medium"
            >
              Novidades
            </Link>
            <Link
              to="/colecoes"
              onClick={() => setIsMenuOpen(false)}
              className="block py-3 border-b border-gray-100 text-text hover:text-primary transition-colors font-medium"
            >
              Coleções
            </Link>
            <Link
              to="/?promotion=true"
              onClick={() => setIsMenuOpen(false)}
              className="block py-3 border-b border-gray-100 text-text hover:text-primary transition-colors font-medium"
            >
              Promoções
            </Link>
            <span className="block py-2 text-xs text-gray-400 uppercase tracking-wider mt-2">Categorias</span>
            <Link to="/categoria/Blusas" onClick={() => setIsMenuOpen(false)} className="block py-3 border-b border-gray-100 text-text hover:text-primary transition-colors">Blusas</Link>
            <Link to="/categoria/Calças" onClick={() => setIsMenuOpen(false)} className="block py-3 border-b border-gray-100 text-text hover:text-primary transition-colors">Calças</Link>
            <Link to="/categoria/Vestidos" onClick={() => setIsMenuOpen(false)} className="block py-3 border-b border-gray-100 text-text hover:text-primary transition-colors">Vestidos</Link>
            <Link to="/categoria/Conjuntos" onClick={() => setIsMenuOpen(false)} className="block py-3 border-b border-gray-100 text-text hover:text-primary transition-colors">Conjuntos</Link>
            <Link to="/categoria/Macaquinho/Macacão" onClick={() => setIsMenuOpen(false)} className="block py-3 border-b border-gray-100 text-text hover:text-primary transition-colors">Macaquinho/Macacão</Link>
            <Link to="/categoria/Saias" onClick={() => setIsMenuOpen(false)} className="block py-3 border-b border-gray-100 text-text hover:text-primary transition-colors">Saias</Link>
            <Link to="/categoria/Shorts" onClick={() => setIsMenuOpen(false)} className="block py-3 border-b border-gray-100 text-text hover:text-primary transition-colors">Shorts</Link>
            <Link to="/categoria/Short / Short Saia" onClick={() => setIsMenuOpen(false)} className="block py-3 border-b border-gray-100 text-text hover:text-primary transition-colors">Short Saia</Link>
            <Link to="/categoria/Blazer/Jaqueta" onClick={() => setIsMenuOpen(false)} className="block py-3 border-b border-gray-100 text-text hover:text-primary transition-colors">Blazer/Jaqueta</Link>
            <Link to="/categoria/Acessórios" onClick={() => setIsMenuOpen(false)} className="block py-3 border-b border-gray-100 text-text hover:text-primary transition-colors">Acessórios</Link>
            <Link to="/pre-venda" onClick={() => setIsMenuOpen(false)} className="block py-3 border-b border-gray-100 text-primary font-semibold hover:text-primary/80 transition-colors">Pré-Venda</Link>
            <Link to="/faq" onClick={() => setIsMenuOpen(false)} className="block py-3 mt-2 border-t border-gray-200 text-text hover:text-primary transition-colors font-medium">Perguntas Frequentes</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
