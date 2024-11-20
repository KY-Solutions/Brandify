const mongoose = require('mongoose');
const Category = require('../../Category/models/Category');

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const subCategory = mongoose.model('Subcategory', subCategorySchema);
module.exports = subCategory;