const UserAnalyticsService = require("../services/UseranalyticsService");
const ProductAnalyticsService = require("../services/ProductanalyticsService");
const OrderAnalyticsService = require("../services/OrderanalyticsService");

class AnalyticsController {
  static async getUserAnalytics(req, res) {
    try {
      const activeUsers = await UserAnalyticsService.getActiveUsers(req.query.startDate, req.query.endDate);
      res.status(200).json({ activeUsers });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getProductAnalytics(req, res) {
    try {
      const topProducts = await ProductAnalyticsService.getTopProducts(req.query.startDate, req.query.endDate);
      res.status(200).json({ topProducts });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getOrderAnalytics(req, res) {
    try {
      const revenue = await OrderAnalyticsService.getTotalRevenue(req.query.startDate, req.query.endDate);
      const ordersByStatus = await OrderAnalyticsService.getOrdersByStatus();
      res.status(200).json({ revenue, ordersByStatus });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AnalyticsController;
