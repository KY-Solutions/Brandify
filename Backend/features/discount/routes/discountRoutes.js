const express = require('express');
const asyncHandler = require('express-async-handler');
const roleMiddleware = require('../../../middleware/roles/rolesMiddleware');
const authMiddleware = require('../../../middleware/authentication/authMiddleware');
const DiscountCodeController = require('../controllers/discountController');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('admin'), asyncHandler(DiscountCodeController.createDiscount));
router.get('/:code', authMiddleware, roleMiddleware('admin'), asyncHandler(DiscountCodeController.findDiscountByCode));
router.get('/', authMiddleware, roleMiddleware('admin'), asyncHandler(DiscountCodeController.getActiveDiscount));
router.put('/:code', authMiddleware, roleMiddleware('admin'), asyncHandler(DiscountCodeController.deactivateDiscount));
router.delete('/:code', authMiddleware, roleMiddleware('admin'), asyncHandler(DiscountCodeController.deleteDiscount));

module.exports = router;