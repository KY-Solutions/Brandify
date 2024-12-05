const paymobService = require('../services/paymobService');

// Controller for Paymob Payment Integration
const paymobController = {
  /**
   * Generate Authentication Token
   */
  async generateToken(req, res, next) {
    try {
      const token = await paymobService.generateAuthToken();
      res.status(200).json({ success: true, token });
    } catch (error) {
      next(error); // Pass error to error handler middleware
    }
  },

  /**
   * Create an Order
   */
  async createOrder(req, res, next) {
    try {
      const { items, shippingData, totalAmount } = req.body;

      const order = await paymobService.createOrder(items, shippingData, totalAmount);
      res.status(200).json({ success: true, order });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create Payment Transaction and Get Iframe URL
   */
  async createPaymentTransaction(req, res, next) {
    try {
      const { orderId, customerData, amountCents } = req.body;

      const paymentURL = await paymobService.createTransaction(orderId, customerData, amountCents);
      res.status(200).json({ success: true, paymentURL });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Webhook Verification
   */
  async verifyWebhook(req, res, next) {
    try {
      const isValid = paymobService.verifyWebhook(req.body, req.headers['hmac']);
      if (!isValid) {
        return res.status(400).json({ success: false, message: 'Invalid webhook request' });
      }

      // Handle successful webhook (e.g., update payment status)
      await paymobService.handleSuccessfulPayment(req.body);

      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = paymobController;
