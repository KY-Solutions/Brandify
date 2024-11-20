const express = require('express');
const asyncHandler = require('express-async-handler');
const SubCategoryController = require('../controller/subCategoryController');
const roleMiddleware = require('../../../middleware/roles/rolesMiddleware');
const authMiddleware = require('../../../middleware/authentication/authMiddleware');

const router = express.Router();

//? Public routes

router.get('/', asyncHandler(SubCategoryController.getAllSubCategories));
router.get('/:id', asyncHandler(SubCategoryController.getSubCategoryById));

//? admin only routes
router.post('/', authMiddleware, roleMiddleware('admin'), asyncHandler(SubCategoryController.createSubCategory));
router.put('/:id', authMiddleware, roleMiddleware('admin'), asyncHandler(SubCategoryController.updateSubCategory));
router.delete('/:id', authMiddleware, roleMiddleware('admin'), asyncHandler(SubCategoryController.deleteSubCategory));