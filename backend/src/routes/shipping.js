const express = require('express');
const router = express.Router();
const { getShippingQuote } = require('../controllers/shippingController');

// Rota pública — calcula cotação de frete
router.post('/quote', getShippingQuote);

module.exports = router;
