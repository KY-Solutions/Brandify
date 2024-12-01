// controllers/notificationController.js
const notificationService = require('../services/notificationService');

class notificationController {

static async createNotification(req, res){
  const { user, title, message, type, broadcast } = req.body;
  try {
    const notification = await notificationService.createNotification(user, title, message, type, broadcast);
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

static async fetchNotifications(req, res){
    const userId = req.userId.toString();
    try {
        const notifications = await notificationService.fetchNotifications(userId);
        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

static async markAsRead(req, res){
  const id = req.query.notificationid;
  try {
    const notification = await notificationService.markNotificationAsRead(id);
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

static async deleteNotification(req, res){
    try {
        const id = req.query.notificationid;

        // Use service layer to delete notification
        const notification = await notificationService.deleteNotificationById(id);

        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error',
        });
    }
};

}
module.exports = notificationController;
