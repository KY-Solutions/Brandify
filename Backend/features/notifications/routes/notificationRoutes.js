// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notficationController');
const asyncHandler = require('express-async-handler');

const roleMiddleware = require('../../../middleware/roles/rolesMiddleware');
const authMiddleware = require('../../../middleware/authentication/authMiddleware');

router.post('/', authMiddleware, roleMiddleware(['admin']), asyncHandler(notificationController.createNotification)); // Create new notification
router.get('/:userId', authMiddleware, roleMiddleware(['user', 'admin']), asyncHandler(notificationController.fetchNotifications));
router.put('/:id', authMiddleware, roleMiddleware(['user', 'admin']), asyncHandler(notificationController.markAsRead)); // Mark notification as read
router.delete('/:id', authMiddleware, roleMiddleware(['user','admin']), asyncHandler(notificationController.deleteNotification));

module.exports = router;
