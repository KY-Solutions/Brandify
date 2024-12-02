const CategoryService = require('../services/categoryService');

class CategoryController {
  // Get all categories
  static async getAllCategories(req, res) {
    try {
      const categories = await CategoryService.getAllCategories();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Get a specific category by ID
  static async getCategoryById(req, res) {
    try {
      const category = await CategoryService.getCategoryById(req.params.id);
      if (category) res.json(category);
      else res.status(404).json({ error: 'Category not found' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Create a new category
  static async createCategory(req, res) {
    try {
      const category = await CategoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Update a category
  static async updateCategory(req, res) {
    try {
      const category = await CategoryService.updateCategory(req.query.id, req.body);
      if (category) res.json(category);
      else res.status(404).json({ error: 'Category not found' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Delete a category
  static async deleteCategory(req, res) {
    try {
      const category = await CategoryService.deleteCategory(req.query.id);
      if (category) res.status(204).end();
      else res.status(404).json({ error: 'Category not found' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Get products by category name
  static async getProductsByCategoryName(req, res) {
    try {
      const products = await CategoryService.getProductsByCategoryName(req.query.name);
      if (products.length === 0) {
        return res.status(404).json({ error: 'No products found for this category' });
      }
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = CategoryController;
