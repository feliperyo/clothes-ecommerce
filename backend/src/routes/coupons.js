const express = require('express');
const router = express.Router();
const { validateCoupon } = require('../controllers/couponController');

// Rota pública - validar cupom no checkout
router.post('/validate', validateCoupon);

module.exports = router;
