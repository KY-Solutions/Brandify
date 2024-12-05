const axios = require('axios');
const crypto = require('crypto');

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const PAYMOB_SECRET_KEY = process.env.PAYMOB_SECRET_KEY;
const PAYMOB_HMAC_KEY = process.env.PAYMOB_HMAC_KEY;
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID;
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID;

const paymobService = {
  /**
   * Generate an Authentication Token
   */
  async generateAuthToken() {
    const response = await axios.post('https://accept.paymobsolutions.com/api/auth/tokens', {
      api_key: PAYMOB_API_KEY,
    });
    return response.data.token;
  },

  /**
   * Create an Order
   */
  async createOrder(items, shippingData, totalAmount) {
    const token = await this.generateAuthToken();

    const orderPayload = {
      auth_token: token,
      delivery_needed: false,
      amount_cents: totalAmount,
      items,
      shipping_data: shippingData,
    };

    const response = await axios.post('https://accept.paymobsolutions.com/api/ecommerce/orders', orderPayload);
    return response.data;
  },

  /**
   * Create Payment Transaction
   */
  async createTransaction(orderId, customerData, amountCents) {
    const token = await this.generateAuthToken();

    const paymentPayload = {
      auth_token: token,
      amount_cents: amountCents,
      order_id: orderId,
      billing_data: customerData,
      currency: 'EGP',
      integration_id: PAYMOB_INTEGRATION_ID, // This corresponds to your Paymob Iframe ID
    };

    const response = await axios.post('https://accept.paymobsolutions.com/api/acceptance/payment_keys', paymentPayload);

    // Construct the payment URL
    const paymentURL = `https://accept.paymobsolutions.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${response.data.token}`;
    return paymentURL;
  },

  /**
   * Verify Webhook
   */
  verifyWebhook(data, receivedHmac) {
    const generatedHmac = crypto
      .createHmac('sha512', PAYMOB_HMAC_KEY)
      .update(JSON.stringify(data))
      .digest('hex');

    return generatedHmac === receivedHmac;
  },

  /**
   * Handle Successful Payment
   */
  async handleSuccessfulPayment(webhookData) {
    // Logic to handle successful payments
    console.log('Payment Successful:', webhookData);
    // Update your order/payment status in the database
  },
};

module.exports = paymobService;
