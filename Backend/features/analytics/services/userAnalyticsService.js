const Analytics = require("../models/analyticsModel");

class UserAnalyticsService {
  // Log user events
  static async logUserEvent(userId, eventType, details = {}) {
    return Analytics.create({
      eventType: "USER_ACTION",
      userId,
      details: { eventType, ...details },
    });
  }

  // Fetch active user count
  static async getActiveUsers(startDate, endDate) {
    return Analytics.countDocuments({
      eventType: "USER_ACTION",
      "details.eventType": "login",
      timestamp: { $gte: startDate, $lte: endDate },
    });
  }

  // Retention rates
  static async getRetentionRate() {
    // Custom logic for retention
  }
}

module.exports = UserAnalyticsService;
