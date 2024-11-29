const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    items: [
        {

            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
        },
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    paymentStatus: {
        type: String,
        default: 'unpaid',
        enum: ['paid','unpaid','failed']
    },
    discount: {
        code: {
            type: String,
            default: null
        },
        percentage: {
            type: Number,
            default: 0
        },
        amountDeducted: {
            type: Number,
            default: 0,
        },
        ref: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DiscountCode',
            default: null
        }
    }

}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;