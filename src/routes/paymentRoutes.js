const express = require('express');
const {
  initiatePayment,
  handlePaymentCallback
} = require('../controllers/paymentController');

const router = express.Router();

// Payment routes
router.post('/initiate', initiatePayment);
router.post('/callback', handlePaymentCallback);

module.exports = router;
