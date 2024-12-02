// services/notificationService.js
const Notification = require('../models/notificationModel');

class notificationService {

static async createNotification(userId, title, message, type, broadcast = false){
        try {
            const notification = new Notification({
                user: userId,
                title,
                message,
                type,
                broadcast,
            });
    
            await notification.save();
            return notification;
        } catch (error) {
            throw new Error('Error creating notification: ' + error.message);
        }
    };

// Fetch notifications, including those marked as broadcast
static async fetchNotifications(userId){
    try {
        // Find notifications that match the userId or are marked as broadcast
        const notifications = await Notification.find({
            $or: [
                { user: userId }, // Fetch user-specific notifications
                { broadcast: true }    // Fetch broadcast notifications
            ]
        }).sort({ createdAt: -1 }); // Sort by the created date in descending order

        return notifications;
    } catch (error) {
        throw new Error('Error fetching notifications: ' + error.message);
    }
};

static async markNotificationAsRead(notificationId){
  try {
    const notification = await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
    return notification;
  } catch (error) {
    throw new Error('Error marking notification as read: ' + error.message);
  }
};

// Delete a notification by ID
static async deleteNotificationById(id){
    try {
        const notification = await Notification.findByIdAndDelete(id);
        if (!notification) {
            throw new Error('Notification not found');
        }
        return notification;
    } catch (error) {
        throw new Error('Error deleting notification: ' + error.message);
    }
};

}
module.exports = notificationService;
