const express = require('express');
const router = express.Router();
const { handleMercadoPagoWebhook } = require('../controllers/webhookController');

// Webhook do Mercado Pago
router.post('/mercadopago', handleMercadoPagoWebhook);

module.exports = router;
