//* import packages
const mongoose = require('mongoose');

//* create product schema

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: false, //* temporary until the category schema is implemented
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    offerPrice: {
        type: Number,
        default: 0,
    },
    sizes: {
        type: [String],
        default: [],

    },
    colors: {
        type: [String],
        default: [],

    },
    stock: {
        type: Number,
        required: true,
    },
    images: {
        type: [String],
        default: [],
    },
   reviews: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Review',
    default: []
},

}, { timestamps: true, });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
