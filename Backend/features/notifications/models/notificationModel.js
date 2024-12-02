// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userId',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['info', 'warning', 'success', 'error'],
        required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    broadcast: {
        type: Boolean,
        default: false, // If set to true, this notification will be fetched by all users
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

});

module.exports = mongoose.model('Notification', notificationSchema);
