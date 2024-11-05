// routes/categoryRoutes.js
const express = require('express');
const asyncHandler = require('express-async-handler');

const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.get('/', asyncHandler(categoryController.getAllCategories));           // Get all categories
router.get('/:id', asyncHandler(categoryController.getCategoryById));         // Get a specific category by ID
router.post('/', asyncHandler(categoryController.createCategory));            // Create a new category
router.put('/:id', asyncHandler(categoryController.updateCategory));          // Update a category
router.delete('/:id', asyncHandler(categoryController.deleteCategory));       // Delete a category

module.exports = router;
