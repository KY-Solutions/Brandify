const ReviewService = require('../services/reviewService');

class ReviewController {
    static async addReview(req, res) {
        try {
            const { productId, rating, comment } = req.body;
            const userId = req.userId; //? gets the userId from the jwt (authmiddleware).

            const product = await ReviewService.findProductById(productId);
            if (!product) {
                return res.status(404).json({ success: false, message: 'Product not found.' });
            }

            //! check if the user has an existing review
            const existingReview = await ReviewService.findUserReviewForProduct(userId, productId);
            if (existingReview) {
                return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
            }
            const reviewData = { product: productId, user: userId, rating, comment };
            const newReview = await ReviewService.createReview(reviewData);

            await ReviewService.updateProductRating(productId);
            res.status(200).json({ success: true, review: newReview });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
        
    }

    static async getProductReviews(req, res) {
        try {
            const { productId } = req.params;
            const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

            const product = await ReviewService.findProductById(productId);
            if (!product) {
                return res.status(404).json({ success: false, message: 'Product not found.' });
            }
            const reviews = await ReviewService.getReviews(page, limit, productId, sortBy, sortOrder);
            res.status(200).json({ success: true, productReviews: reviews });

        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async deleteReview(req, res) {
        try {
            const { productId } = req.params;
            const userId = req.userId;
            const review = await ReviewService.findUserReviewForProduct(userId, productId);

            if (!review) {
                return res.status(404).json({ success: false, message: 'Review not found' });
            }

            if (review.user.toString() !== userId.toString()) {
                return res.status(403).json({ success: false, message: 'You do not have permission to delete this review' });
            }

            await ReviewService.updateProductRating(review.product);
            res.status(200).json({ success: true, message: 'Review deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getTopFiveReviews(req, res) {
        try {
            const { productId } = req.params;

            const product = await ReviewService.findProductById(productId);
            if (!product) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }

            const topReviews = await ReviewService.getTopReviews(productId);
            res.status(200).json({ success: true, reviews: topReviews });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = ReviewController;