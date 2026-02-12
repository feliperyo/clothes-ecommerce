import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiSearch, FiMenu, FiX } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';

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
          <span className="mx-8 font-medium text-sm">✨ Frete Grátis acima de R$ 599</span>
          <span className="mx-8 font-medium text-sm">💳 Parcele em até 12x sem juros</span>
          <span className="mx-8 font-medium text-sm">🔥 Novidades toda semana</span>
          <span className="mx-8 font-medium text-sm">🚚 Entrega rápida para todo Brasil</span>
          <a href="https://wa.me/5511913762420" target="_blank" rel="noopener noreferrer" className="mx-8 font-medium text-sm hover:underline">📱 WhatsApp: (11) 91376-2420</a>
          <span className="mx-8 font-medium text-sm">✨ Frete Grátis acima de R$ 599</span>
          <span className="mx-8 font-medium text-sm">💳 Parcele em até 12x sem juros</span>
          <span className="mx-8 font-medium text-sm">🔥 Novidades toda semana</span>
          <span className="mx-8 font-medium text-sm">🚚 Entrega rápida para todo Brasil</span>
          <a href="https://wa.me/5511913762420" target="_blank" rel="noopener noreferrer" className="mx-8 font-medium text-sm hover:underline">📱 WhatsApp: (11) 91376-2420</a>
        </div>
      </div>

      {/* Main Header */}
      <div className="container">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3">
            <img
              src="/assets/logo-ac.webp"
              alt="AC Ana Curve"
              className="h-12 md:h-14 w-auto"
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
            <Link to="/faq" className="text-text hover:text-primary transition-colors font-medium">
              FAQ
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <nav className="container py-4 space-y-3">
            <Link
              to="/"
              onClick={() => { setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="block py-2 text-text hover:text-primary transition-colors font-medium"
            >
              Início
            </Link>
            <Link
              to="/?newest=true"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-text hover:text-primary transition-colors font-medium"
            >
              Novidades
            </Link>
            <Link
              to="/colecoes"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-text hover:text-primary transition-colors font-medium"
            >
              Coleções
            </Link>
            <Link
              to="/?promotion=true"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-text hover:text-primary transition-colors font-medium"
            >
              Promoções
            </Link>
            <Link
              to="/faq"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-text hover:text-primary transition-colors font-medium"
            >
              FAQ
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
