const crypto = require('crypto');
const axios = require('axios');

// @desc    Initiate PayU payment
// @route   POST /api/payments/initiate
// @access  Public
const initiatePayment = async (req, res) => {
  try {
    const { applicationId, amount, firstName, email, phone } = req.body;
    
    // Validate required fields
    if (!applicationId || !amount || !firstName || !email || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Application ID, amount, first name, email, and phone are required'
      });
    }
    
    const payuKey = process.env.PAYU_KEY;
    const payuSalt = process.env.PAYU_SALT;
    const merchantId = process.env.PAYU_MERCHANT_ID;
    const baseUrl = process.env.PAYU_BASE_URL || 'https://test.payu.in';
    
    if (!payuKey || !payuSalt || !merchantId) {
      return res.status(500).json({
        success: false,
        error: 'Payment configuration missing',
        message: 'PayU credentials not configured'
      });
    }
    
    // Generate transaction ID
    const txnId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Prepare payment data
    const paymentData = {
      key: payuKey,
      txnid: txnId,
      amount: amount.toString(),
      productinfo: `Vestiga Application - ${applicationId}`,
      firstname: firstName,
      email: email,
      phone: phone,
      surl: `${process.env.FRONTEND_URL}/payment/success`,
      furl: `${process.env.FRONTEND_URL}/payment/failure`,
      hash: ''
    };
    
    // Generate hash
    const hashString = `${payuKey}|${txnId}|${amount}|${paymentData.productinfo}|${firstName}|${email}|||||||||||${payuSalt}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');
    paymentData.hash = hash;
    
    // For now, return the payment data (in production, you'd redirect to PayU)
    res.status(200).json({
      success: true,
      data: {
        paymentUrl: `${baseUrl}/_payment`,
        paymentData: paymentData,
        txnId: txnId
      },
      message: 'Payment initiated successfully'
    });
    
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to initiate payment'
    });
  }
};

// @desc    Handle PayU callback
// @route   POST /api/payments/callback
// @access  Public
const handlePaymentCallback = async (req, res) => {
  try {
    const { status, txnid, amount, productinfo, firstname, email, phone, hash } = req.body;
    const payuSalt = process.env.PAYU_SALT;
    
    // Verify hash
    const hashString = `${payuSalt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${process.env.PAYU_KEY}`;
    const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex');
    
    if (hash !== calculatedHash) {
      return res.status(400).json({
        success: false,
        error: 'Invalid hash',
        message: 'Payment verification failed'
      });
    }
    
    // Update application payment status
    const Application = require('../models/Application');
    const application = await Application.findOne({ _id: productinfo.split(' - ')[1] });
    
    if (application) {
      application.paymentStatus = status === 'success' ? 'SUCCESS' : 'FAILED';
      await application.save();
    }
    
    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully'
    });
    
  } catch (error) {
    console.error('Payment callback error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to process payment callback'
    });
  }
};

module.exports = {
  initiatePayment,
  handlePaymentCallback
};
