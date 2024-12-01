// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notficationController');
const asyncHandler = require('express-async-handler');

const roleMiddleware = require('../../../middleware/roles/rolesMiddleware');
const authMiddleware = require('../../../middleware/authentication/authMiddleware');

router.post('/', authMiddleware, roleMiddleware(['admin']), asyncHandler(notificationController.createNotification)); // Create new notification
router.get('/', authMiddleware, roleMiddleware(['user', 'admin']), asyncHandler(notificationController.fetchNotifications));
router.put('/:notificationid?', authMiddleware, roleMiddleware(['user', 'admin']), asyncHandler(notificationController.markAsRead)); // Mark notification as read
router.delete('/:notificationid?', authMiddleware, roleMiddleware(['user','admin']), asyncHandler(notificationController.deleteNotification));

module.exports = router;
