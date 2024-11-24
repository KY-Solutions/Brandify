const Review = require('../models/review');
const Product = require('../../products/models/product');

class ReviewService{
    static async createReview(reviewData) {
        const review = new Review(reviewData);
        await review.save();

        const reviews = await Review.find(review.product);
        
    }


}