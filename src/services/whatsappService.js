const axios = require('axios');

class WhatsAppService {
  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
    this.baseUrl = 'https://graph.facebook.com/v18.0';
  }

  async sendMessage(to, message) {
    try {
      if (!this.accessToken || !this.phoneNumberId) {
        throw new Error('WhatsApp credentials not configured');
      }

      const url = `${this.baseUrl}/${this.phoneNumberId}/messages`;
      
      const data = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: {
          body: message
        }
      };

      const response = await axios.post(url, data, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ WhatsApp message sent successfully:', response.data);
      return {
        success: true,
        messageId: response.data.messages[0].id,
        message: 'WhatsApp message sent successfully'
      };
    } catch (error) {
      console.error('❌ WhatsApp send message error:', error.response?.data || error.message);
      throw error;
    }
  }

  async sendApplicationConfirmation(application) {
    try {
      const message = `🎉 *Application Submitted Successfully!*

*Application Details:*
• Name: ${application.name}
• ID Number: ${application.idNumber}
• Email: ${application.email}
• Mobile: ${application.mobile}
• Payment Status: ${application.paymentStatus}

Thank you for applying to Vestiga! We will review your application and get back to you soon.

For any queries, please contact us at support@vestiga.com`;

      return await this.sendMessage(application.mobile, message);
    } catch (error) {
      console.error('❌ WhatsApp application confirmation error:', error);
      throw error;
    }
  }

  async sendPaymentConfirmation(application) {
    try {
      const message = `💳 *Payment Confirmation*

*Application ID:* ${application._id}
• Name: ${application.name}
• Payment Status: ${application.paymentStatus}
• Amount: ₹500 (Application Fee)

Your payment has been processed successfully! You will receive further updates about your application status.

Thank you for choosing Vestiga!`;

      return await this.sendMessage(application.mobile, message);
    } catch (error) {
      console.error('❌ WhatsApp payment confirmation error:', error);
      throw error;
    }
  }

  async sendApplicationUpdate(application, updateType) {
    try {
      let message = '';
      
      switch (updateType) {
        case 'status_update':
          message = `📋 *Application Status Update*

*Application ID:* ${application._id}
• Name: ${application.name}
• New Status: ${application.paymentStatus}

Your application status has been updated. Please check your email for more details.`;
          break;
        case 'approval':
          message = `🎉 *Congratulations!*

*Application ID:* ${application._id}
• Name: ${application.name}

Your application has been approved! Welcome to Vestiga. We will contact you soon with next steps.`;
          break;
        case 'rejection':
          message = `📝 *Application Update*

*Application ID:* ${application._id}
• Name: ${application.name}

Thank you for your interest in Vestiga. Unfortunately, we cannot proceed with your application at this time. We encourage you to apply again in the future.`;
          break;
        default:
          message = `📋 *Application Update*

*Application ID:* ${application._id}
• Name: ${application.name}

Your application has been updated. Please check your email for more details.`;
      }

      return await this.sendMessage(application.mobile, message);
    } catch (error) {
      console.error('❌ WhatsApp application update error:', error);
      throw error;
    }
  }

  verifyWebhook(mode, token, challenge) {
    if (mode === 'subscribe' && token === this.verifyToken) {
      console.log('✅ WhatsApp webhook verified');
      return challenge;
    } else {
      console.log('❌ WhatsApp webhook verification failed');
      return null;
    }
  }
}

module.exports = new WhatsAppService();
