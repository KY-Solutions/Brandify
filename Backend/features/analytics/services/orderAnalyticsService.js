const Order = require("../models/analyticsModel");

class OrderAnalyticsService {
  // Total revenue
  static async getTotalRevenue(startDate, endDate) {
    return Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);
  }

  // Orders by status
  static async getOrdersByStatus() {
    return Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
  }
}

module.exports = OrderAnalyticsService;
