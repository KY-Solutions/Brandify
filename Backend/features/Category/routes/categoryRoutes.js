// routes/categoryRoutes.js
const express = require('express');
const asyncHandler = require('express-async-handler');
const roleMiddleware = require('../../../middleware/roles/rolesMiddleware');
const authMiddleware = require('../../../middleware/authentication/authMiddleware');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.get('/', asyncHandler(categoryController.getAllCategories));           // Get all categories
//router.get('/:id', asyncHandler(categoryController.getCategoryById));         // Get a specific category by ID
router.post('/', authMiddleware, roleMiddleware('admin'), asyncHandler(categoryController.createCategory));            // Create a new category
router.put('/:id', authMiddleware, roleMiddleware('admin'), asyncHandler(categoryController.updateCategory));          // Update a category
router.delete('/:id', authMiddleware, roleMiddleware('admin'), asyncHandler(categoryController.deleteCategory));       // Delete a category
router.get('/:name/products', asyncHandler(categoryController.getProductsByCategoryName));

module.exports = router;
