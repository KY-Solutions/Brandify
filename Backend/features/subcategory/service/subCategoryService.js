const SubCategory = require('../models/subCategory');
const mongoose = require('mongoose');

class SubCategoryService {

    static async createSubCategory(subCategoryData) {
        const subCategory = new SubCategory(subCategoryData);
        return await subCategory.save();
    }

    static async getAllSubCategories(page = 1, limit = 10) {
        //mongoose.set('strictPopulate', false);
        const subCategories = await SubCategory.find()
            .populate('category')
            .skip((page - 1) * limit)
            .limit(limit);
        return subCategories;
    }

    static async getSubCategoryById(subCategoryId) {
        return await SubCategory.findById(subCategoryId).populate('category');
    }

    static async UpdateSubCategory(subCategoryId, subCategoryData) {
        return await SubCategory.findByIdAndUpdate(subCategoryId, subCategoryData, { new: true });
    }

    static async deleteSubCategory(subCategoryId) {
        return await SubCategory.findByIdAndDelete(subCategoryId);
    }

}

module.exports = SubCategoryService;