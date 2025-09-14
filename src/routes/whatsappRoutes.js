const express = require('express');
const {
  verifyWebhook,
  handleWebhook,
  sendApplicationConfirmation,
  sendPaymentConfirmation,
  sendApplicationUpdate
} = require('../controllers/whatsappController');

const router = express.Router();

// WhatsApp webhook routes
router.get('/webhook', verifyWebhook);
router.post('/webhook', handleWebhook);

// WhatsApp message routes
router.post('/send-confirmation', sendApplicationConfirmation);
router.post('/send-payment-confirmation', sendPaymentConfirmation);
router.post('/send-update', sendApplicationUpdate);

module.exports = router;
