const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    enum: ["USER_ACTION", "ORDER", "PRODUCT", "DISCOUNT"], // Define types
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Optional for non-user events
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: false,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: false,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: false,
  },
  discountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Discount",
    required: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  details: {
    type: Object, // Flexible field to store additional info (e.g., IP, platform)
    default: {},
  },
});

module.exports = mongoose.model("Analytics", analyticsSchema);
