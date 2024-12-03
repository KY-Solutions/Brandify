const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,

    },
    percentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100

    },
    maxDiscountAmount: {
        type: Number,
        default: 0

    },
    minOrderAmount: {
        type: Number,
        default: 0,

    },
    expirationDate: {
        type: Date,
        required: true

    },
    isActive: {
        type: Boolean,
        default: true,

    },
    usedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
    
}, { timestamps: true });

const DiscountCode = mongoose.model('DiscountCode', discountSchema);
module.exports = DiscountCode;