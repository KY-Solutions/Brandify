const express = require('express');
const asyncHandler = require('express-async-handler');
const roleMiddleware = require('../../../middleware/roles/rolesMiddleware');
const authMiddleware = require('../../../middleware/authentication/authMiddleware');
const OrderController = require('../controllers/orderController');

const router = express.Router();

//? user endpoints
router.post('/', authMiddleware, asyncHandler(OrderController.createOrder));
router.get('/', authMiddleware, roleMiddleware(['admin', 'user']), asyncHandler(OrderController.getUserOrders));

//? admin endpoints
router.get('/allOrders', authMiddleware, roleMiddleware('admin'), asyncHandler(OrderController.getAllOrders));
router.get('/:id', authMiddleware, roleMiddleware('admin'), asyncHandler(OrderController.getOrderById));
router.put('/:id', authMiddleware, roleMiddleware('admin'), asyncHandler(OrderController.updateOrderStatus));
router.delete('/:id', authMiddleware, roleMiddleware('admin'), asyncHandler(OrderController.deleteOrder));

module.exports = router;