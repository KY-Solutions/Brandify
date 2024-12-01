const Category = require('../models/Category');
const Product = require('../../products/models/product');

class CategoryService {
  // Get all categories
  static async getAllCategories() {
    return await Category.find();
  }

  // Get a specific category by ID
  static async getCategoryById(id) {
    return await Category.findById(id);
  }

  // Create a new category
  static async createCategory(data) {
    const { name, description } = data;
    const category = new Category({ name, description });
    return await category.save();
  }

  // Update a category
  static async updateCategory(id, data) {
    const { name, description } = data;
    return await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
  }

  // Delete a category
  static async deleteCategory(id) {
    return await Category.findByIdAndDelete(id);
  }

  // Get products by category name
  static async getProductsByCategoryName(name) {
    const products = await Product.find().populate({
      path: 'category',
      match: { name }, // Filter the populated category by its name
    });

    // Filter out products without a matched category
    return products.filter((product) => product.category);
  }
}

module.exports = CategoryService;
