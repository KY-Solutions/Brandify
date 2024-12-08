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
            customizations: {
                type: Object, // Store key-value pairs for customizations
                default: {}
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ]
    
}, { timestamps: true });

const Cart = mongoose.models.CartSchema || mongoose.model('Cart', CartSchema);
module.exports = Cart;
