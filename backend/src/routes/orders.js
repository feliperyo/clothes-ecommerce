const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderByNumber
} = require('../controllers/orderController');

// Rotas públicas de pedidos
router.post('/', createOrder);
router.get('/:orderNumber', getOrderByNumber);

module.exports = router;
