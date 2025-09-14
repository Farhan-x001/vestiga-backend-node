const whatsappService = require('../services/whatsappService');

// @desc    Verify WhatsApp webhook
// @route   GET /api/whatsapp/webhook
// @access  Public
const verifyWebhook = (req, res) => {
  try {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const result = whatsappService.verifyWebhook(mode, token, challenge);
    
    if (result) {
      res.status(200).send(challenge);
    } else {
      res.status(403).json({
        success: false,
        error: 'Verification failed',
        message: 'Invalid verification token'
      });
    }
  } catch (error) {
    console.error('WhatsApp webhook verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Webhook verification failed'
    });
  }
};

// @desc    Handle WhatsApp webhook events
// @route   POST /api/whatsapp/webhook
// @access  Public
const handleWebhook = (req, res) => {
  try {
    const body = req.body;
    
    if (body.object === 'whatsapp_business_account') {
      body.entry.forEach(entry => {
        entry.changes.forEach(change => {
          if (change.field === 'messages') {
            console.log('📱 WhatsApp message received:', change.value);
            // Handle incoming messages here if needed
          }
        });
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Webhook event processed'
    });
  } catch (error) {
    console.error('WhatsApp webhook handling error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to process webhook event'
    });
  }
};

// @desc    Send application confirmation
// @route   POST /api/whatsapp/send-confirmation
// @access  Public
const sendApplicationConfirmation = async (req, res) => {
  try {
    const { application } = req.body;
    
    if (!application || !application.mobile) {
      return res.status(400).json({
        success: false,
        error: 'Missing application data',
        message: 'Application data with mobile number is required'
      });
    }
    
    const result = await whatsappService.sendApplicationConfirmation(application);
    
    res.status(200).json({
      success: true,
      data: result,
      message: 'Application confirmation sent successfully'
    });
  } catch (error) {
    console.error('Send application confirmation error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to send application confirmation'
    });
  }
};

// @desc    Send payment confirmation
// @route   POST /api/whatsapp/send-payment-confirmation
// @access  Public
const sendPaymentConfirmation = async (req, res) => {
  try {
    const { application } = req.body;
    
    if (!application || !application.mobile) {
      return res.status(400).json({
        success: false,
        error: 'Missing application data',
        message: 'Application data with mobile number is required'
      });
    }
    
    const result = await whatsappService.sendPaymentConfirmation(application);
    
    res.status(200).json({
      success: true,
      data: result,
      message: 'Payment confirmation sent successfully'
    });
  } catch (error) {
    console.error('Send payment confirmation error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to send payment confirmation'
    });
  }
};

// @desc    Send application update
// @route   POST /api/whatsapp/send-update
// @access  Public
const sendApplicationUpdate = async (req, res) => {
  try {
    const { application, updateType } = req.body;
    
    if (!application || !application.mobile || !updateType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required data',
        message: 'Application data, mobile number, and update type are required'
      });
    }
    
    const result = await whatsappService.sendApplicationUpdate(application, updateType);
    
    res.status(200).json({
      success: true,
      data: result,
      message: 'Application update sent successfully'
    });
  } catch (error) {
    console.error('Send application update error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to send application update'
    });
  }
};

module.exports = {
  verifyWebhook,
  handleWebhook,
  sendApplicationConfirmation,
  sendPaymentConfirmation,
  sendApplicationUpdate
};
