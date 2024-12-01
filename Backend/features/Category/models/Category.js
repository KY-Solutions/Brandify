const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
// Use this pattern to check if the model already exists in Mongoose's cache (avoid redefining it multiple times)
const Category = mongoose.models.categorySchema || mongoose.model('Category', categorySchema);
module.exports = Category;