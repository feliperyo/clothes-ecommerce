const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');
const upload = require('../config/upload');
const {
  login,
  getDashboard,
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFeatured,
  togglePromotion,
  toggleNew,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateTracking,
  deleteOrder
} = require('../controllers/adminController');
const { generateShippingLabel } = require('../controllers/shippingController');
const { getAllCoupons, createCoupon, toggleCoupon, updateCoupon, deleteCoupon } = require('../controllers/couponController');

// Rota pública de login
router.post('/login', login);

// Rotas protegidas (requerem autenticação)
router.use(authenticateAdmin);

// Dashboard
router.get('/dashboard', getDashboard);

// Produtos
router.get('/products', getAllProductsAdmin);
const productUpload = upload.fields([{ name: 'images', maxCount: 5 }, { name: 'video', maxCount: 1 }]);
router.post('/products', productUpload, createProduct);
router.put('/products/:id', productUpload, updateProduct);
router.delete('/products/:id', deleteProduct);
router.patch('/products/:id/featured', toggleFeatured);
router.patch('/products/:id/promotion', togglePromotion);
router.patch('/products/:id/new', toggleNew);

// Pedidos
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);
router.patch('/orders/:id/status', updateOrderStatus);
router.patch('/orders/:id/tracking', updateTracking);
router.post('/orders/:id/generate-label', generateShippingLabel);
router.delete('/orders/:id', deleteOrder);

// Cupons
router.get('/coupons', getAllCoupons);
router.post('/coupons', createCoupon);
router.patch('/coupons/:id', updateCoupon);
router.patch('/coupons/:id/toggle', toggleCoupon);
router.delete('/coupons/:id', deleteCoupon);

module.exports = router;
