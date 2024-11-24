const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',  
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ]
}, { timestamps: true });

// Use this pattern to check if the model already exists in Mongoose's cache (avoid redefining it multiple times)
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
module.exports = Category;
