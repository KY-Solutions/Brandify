//* import packages

const express = require('express');
const ProductController = require('../controllers/productController');
const asyncHandler = require('express-async-handler');
const roleMiddleware = require('../../../middleware/roles/rolesMiddleware');
const authMiddleware = require('../../../middleware/authentication/authMiddleware');
const upload = require('../../../middleware/fileUpload/fileUploadMiddleware');

const router = express.Router();

//? Public routes
router.get('/', asyncHandler(ProductController.getAllProducts));
router.get('/:id', asyncHandler(ProductController.getProductById));

//? admin only routes
router.post('/',authMiddleware,roleMiddleware('admin'),upload.array('images',5), asyncHandler(ProductController.createProduct));
router.put('/:id',authMiddleware, roleMiddleware('admin'),upload.array('images',5), asyncHandler(ProductController.updateProduct));
router.delete('/:id',authMiddleware, roleMiddleware('admin'), asyncHandler(ProductController.deleteProduct));


module.exports = router;