// controllers/categoryController.js
// const Category = require('../routes/categoryRoutes');  // Adjust path as needed
const Category = require('../models/Category');  // Adjust the path if needed

class CategoryController {

// Get all categories
static async  getAllCategories(req, res){
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific category by ID
static async  getCategoryById(req, res){
  try {
    console.log('Request received on /Category/createCategory');
    const category = await Category.findById(req.params.id);
    if (category) res.json(category);
    else res.status(404).json({ error: 'Category not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new category
static async  createCategory(req, res){
  const { name, description } = req.body;
  try {
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a category
static async updateCategory(req, res){
  const { name, description } = req.body;
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );
    if (category) res.json(category);
    else res.status(404).json({ error: 'Category not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a category
static async  deleteCategory(req, res){
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (category) res.status(204).end();
    else res.status(404).json({ error: 'Category not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
}
module.exports = CategoryController;
