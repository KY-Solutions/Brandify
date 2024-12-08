const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');
const roleMiddleware = require('../../../middleware/roles/rolesMiddleware');
const authMiddleware = require('../../../middleware/authentication/authMiddleware');
const asyncHandler = require('express-async-handler');

// Public routes
router.post('/', asyncHandler(newsletterController.subscribe));
router.delete('/', asyncHandler(newsletterController.unsubscribe));

// Admin-only routes
router.get('/', authMiddleware, roleMiddleware(['admin']), asyncHandler(newsletterController.getSubscribers));
router.post('/send', authMiddleware, roleMiddleware(['admin']), asyncHandler(newsletterController.sendNewsletter));

module.exports = router;
