// routes/categoryRoutes.js
const express = require('express');
const asyncHandler = require('express-async-handler');

const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.get('/getAllCategories', asyncHandler(categoryController.getAllCategories));           // Get all categories
router.get('/getCategoryById/:id', asyncHandler(categoryController.getCategoryById));         // Get a specific category by ID
router.post('/createCategory', asyncHandler(categoryController.createCategory));            // Create a new category
router.put('/updateCategory/:id', asyncHandler(categoryController.updateCategory));          // Update a category
router.delete('/deleteCategory/:id', asyncHandler(categoryController.deleteCategory));       // Delete a category

module.exports = router;
