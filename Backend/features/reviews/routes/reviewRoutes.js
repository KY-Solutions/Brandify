const express = require('express');
const asyncHandler = require('express-async-handler');
const roleMiddleware = require('../../../middleware/roles/rolesMiddleware');
const authMiddleware = require('../../../middleware/authentication/authMiddleware');
const ReviewController = require('../controllers/reviewController');

const router = express.Router();


router.get('/', asyncHandler(ReviewController.getProductReviews));
router.get('/top', asyncHandler(ReviewController.getTopFiveReviews));

router.post('/', authMiddleware, roleMiddleware("user"), asyncHandler(ReviewController.addReview));
router.delete('/:id', authMiddleware, roleMiddleware('user'), asyncHandler(ReviewController.deleteReview));

module.exports = router;