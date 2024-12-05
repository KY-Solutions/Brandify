const express = require('express');
const paymobController = require('../controllers/paymobController');

const router = express.Router();

router.post('/generate-token', paymobController.generateToken);
router.post('/create-order', paymobController.createOrder);
router.post('/create-transaction', paymobController.createPaymentTransaction);
router.post('/webhook', paymobController.verifyWebhook);

module.exports = router;
