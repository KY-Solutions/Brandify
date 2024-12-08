const Analytics = require("../models/analyticsModel");

class ProductAnalyticsService {
  // Log product views or purchases
  static async logProductEvent(productId, userId, eventType) {
    return Analytics.create({
      eventType: "PRODUCT",
      productId,
      userId,
      details: { eventType },
    });
  }

  // Get top products
  static async getTopProducts(startDate, endDate, limit = 10) {
    return Analytics.aggregate([
      { $match: { eventType: "PRODUCT", timestamp: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: "$productId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
    ]);
  }
}

module.exports = ProductAnalyticsService;
