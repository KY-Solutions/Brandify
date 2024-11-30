const express = require('express');
const CartController = require('../controllers/cartController');
const asyncHandler = require('express-async-handler');

const roleMiddleware = require('../../../middleware/roles/rolesMiddleware');
const authMiddleware = require('../../../middleware/authentication/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['user', 'admin']), asyncHandler(CartController.addToCart)); // Add item to cart
router.get('/', authMiddleware, roleMiddleware(['user', 'admin']), asyncHandler(CartController.getCart)); // Get user's cart
router.put('/', authMiddleware, roleMiddleware(['user', 'admin']), asyncHandler(CartController.updateCartItem)); // Update item quantity
router.delete('/:productId', authMiddleware, roleMiddleware(['user', 'admin']), asyncHandler(CartController.removeCartItem)); // Remove item from cart
router.delete('/', authMiddleware, roleMiddleware(['user', 'admin']), asyncHandler(CartController.removeCart)); // Remove the whole from cart

module.exports = router;
