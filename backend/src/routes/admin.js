const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');
const {
  login,
  getDashboard,
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFeatured,
  togglePromotion,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateTracking
} = require('../controllers/adminController');

// Rota pública de login
router.post('/login', login);

// Rotas protegidas (requerem autenticação)
router.use(authenticateAdmin);

// Dashboard
router.get('/dashboard', getDashboard);

// Produtos
router.get('/products', getAllProductsAdmin);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.patch('/products/:id/featured', toggleFeatured);
router.patch('/products/:id/promotion', togglePromotion);

// Pedidos
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);
router.patch('/orders/:id/status', updateOrderStatus);
router.patch('/orders/:id/tracking', updateTracking);

module.exports = router;
