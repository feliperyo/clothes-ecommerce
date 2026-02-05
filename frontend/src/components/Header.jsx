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

  const categories = [
    { name: 'Blusas', path: '/categoria/Blusas' },
    { name: 'Calças', path: '/categoria/Calças' },
    { name: 'Vestidos', path: '/categoria/Vestidos' },
    { name: 'Conjuntos', path: '/categoria/Conjuntos' }
  ];

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
      {/* Top Banner */}
      <div className="bg-gradient-primary text-white text-center py-2 px-4 text-sm">
        <p className="font-medium">
          ✨ Frete Grátis acima de R$ 599 | Parcele em até 12x sem juros
        </p>
      </div>

      {/* Main Header */}
      <div className="container">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/assets/logo-ac.webp"
              alt="AC Ana Curve"
              className="h-12 md:h-14 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-text hover:text-primary transition-colors font-medium">
              Início
            </Link>
            <Link to="/?featured=true" className="text-text hover:text-primary transition-colors font-medium">
              Novidades
            </Link>
            <div className="relative group">
              <button className="text-text hover:text-primary transition-colors font-medium">
                Categorias
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="py-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      to={cat.path}
                      className="block px-4 py-2 hover:bg-tertiary/30 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <nav className="container py-4 space-y-3">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-text hover:text-primary transition-colors font-medium"
            >
              Início
            </Link>
            <Link
              to="/?featured=true"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-text hover:text-primary transition-colors font-medium"
            >
              Novidades
            </Link>
            <div>
              <p className="py-2 font-medium text-gray-600">Categorias</p>
              <div className="pl-4 space-y-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    to={cat.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-text hover:text-primary transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              to="/?promotion=true"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-text hover:text-primary transition-colors font-medium"
            >
              Promoções
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
