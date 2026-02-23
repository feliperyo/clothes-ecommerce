const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  getFeaturedProducts,
  getProductsByCategory,
  getPromotionProducts,
  getNewProducts,
  getPreSaleProducts
} = require('../controllers/productController');

// Rotas públicas de produtos
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/promotions', getPromotionProducts);
router.get('/new', getNewProducts);
router.get('/presale', getPreSaleProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

module.exports = router;
