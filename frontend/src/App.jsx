import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

// Admin Pages
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminLayout from './pages/Admin/AdminLayout';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import WhatsAppButton from './components/WhatsAppButton';

function App() {
  return (
    <Router>
      <CartProvider>
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
                  primary: '#C07837',
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
                    </Routes>
                  </main>
                  <Footer />
                  <CartDrawer />
                  <WhatsAppButton />
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
