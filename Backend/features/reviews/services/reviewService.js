const Review = require('../models/review');
const Product = require('../../products/models/product');
const ProductService = require('../../products/services/productService');

class ReviewService{
    static async createReview(reviewData) {
        const review = new Review(reviewData);
        return (await (await review.save()).populate('product','name')).populate('user','name');
    }

    static async findProductById(productId) {
        return await Product.findById(productId);
    }

    static async findUserReviewForProduct(userId, productId) {
        return await Review.findOne({ user: userId, product: productId });
    }

    static async getReviews(page = 1, limit = 10, productId, sortBy, sortOrder) {
        //! supports pagination and sort options (ascending -- descending)
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
        
        const reviews = await Review.find({ product: productId })
            .populate('user', 'name')
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(limit);
        
        return reviews;
    }

    static async getTopReviews(productId) {
        return await Review.find({ product: productId })
            .populate('user', 'name')
            .sort({ rating: -1, createdAt: -1 }) //? 1 == ascending , -1 == descending
            .limit(5); 
    }

    static async deleteReview(reviewId) {
        return await Review.findByIdAndDelete(reviewId);
    }

    static async updateProductRating(productId) {
        const reviews = await Review.find({ product: productId });
        const numOfReviews = reviews.length;

        const averageRating = numOfReviews === 0 ? 0 : reviews.reduce((acc, review) => acc + review.rating, 0) / numOfReviews;

        return await Product.findByIdAndUpdate(productId, { averageRating, numOfReviews }, { new: true });
    }


}

module.exports = ReviewService;