const express = require("express");
const AnalyticsController = require("../controllers/analyticsController");

const router = express.Router();

router.get("/analytics/users", AnalyticsController.getUserAnalytics);
router.get("/analytics/products", AnalyticsController.getProductAnalytics);
router.get("/analytics/orders", AnalyticsController.getOrderAnalytics);

module.exports = router;
