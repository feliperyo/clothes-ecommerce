import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';

// Pages
import Home from './pages/Home';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Category from './pages/Category';
import Collections from './pages/Collections';
import Faq from './pages/Faq';
import PreSale from './pages/PreSale';

// Admin Pages
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminCoupons from './pages/Admin/AdminCoupons';
import AdminLayout from './pages/Admin/AdminLayout';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import WhatsAppButton from './components/WhatsAppButton';
import CouponPopup from './components/CouponPopup';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <CartProvider>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#4A4A4A',
                fontFamily: 'Poppins, sans-serif'
              },
              success: {
                iconTheme: {
                  primary: '#C4A393',
                  secondary: '#fff'
                }
              }
            }}
          />

          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="coupons" element={<AdminCoupons />} />
            </Route>

            {/* Public Routes */}
            <Route
              path="/*"
              element={
                <>
                  <Header />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/colecoes" element={<Collections />} />
                      <Route path="/produto/:id" element={<Product />} />
                      <Route path="/carrinho" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/pedido-confirmado/:orderNumber" element={<OrderConfirmation />} />
                      <Route path="/categoria/:category" element={<Category />} />
                      <Route path="/faq" element={<Faq />} />
                      <Route path="/pre-venda" element={<PreSale />} />
                    </Routes>
                  </main>
                  {/* Quem Somos — acima do footer */}
                  <section className="bg-gradient-to-r from-tertiary via-secondary/20 to-tertiary border-t">
                    <div className="container py-10 text-center max-w-2xl">
                      <p className="font-semibold text-text mb-1">Moda Mid e Plus Size</p>
                      <p className="text-xs text-gray-500 mb-3">Moderna e de qualidade</p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        A Ana Curve Shop nasceu do desejo de valorizar todos os corpos, oferecendo peças que abraçam curvas com estilo, conforto e personalidade — porque vestir bem é para todos os tamanhos.
                      </p>
                    </div>
                  </section>
                  <Footer />
                  <CartDrawer />
                  <WhatsAppButton />
                  <CouponPopup />
                </>
              }
            />
          </Routes>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
