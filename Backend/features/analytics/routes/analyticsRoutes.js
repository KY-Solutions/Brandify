const express = require("express");
const AnalyticsController = require("../controllers/analyticsController");
const asyncHandler = require('express-async-handler');

const roleMiddleware = require('../../../middleware/roles/rolesMiddleware');
const authMiddleware = require('../../../middleware/authentication/authMiddleware');
const router = express.Router();

router.get("/users", authMiddleware, roleMiddleware(['admin']), asyncHandler(AnalyticsController.getUserAnalytics));
router.get("/products", authMiddleware, roleMiddleware(['admin']), asyncHandler(AnalyticsController.getProductAnalytics));
router.get("/orders", authMiddleware, roleMiddleware(['admin']), asyncHandler(AnalyticsController.getOrderAnalytics));

module.exports = router;
