const SubCategory = require('../models/subCategory');
const SubCategoryService = require('../service/subCategoryService');

class SubCategoryController {

    static async createSubCategory(req, res) {
        try {
            const subCategoryData = req.body;

            //* validation
            if (!subCategoryData.name) {
                return res.status(400).json({ message: 'Subcategory name is required' });
            }
            if (!subCategoryData.category) {
                return res.status(400).json({ message: 'Category is required' });
            }
            const subCategory = await SubCategoryService.createSubCategory(subCategoryData);
            res.status(201).json({success: true, message: 'Subcategory created successfully', subCategory: subCategory});


        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    static async updateSubCategory(req, res) {
        try {
            const subCategoryId = req.params.id;
            const subCategoryData = req.body;

            //* validation
            if (!subCategoryId) {
                return res.status(400).json({ message: 'Subcategory Id is required' });
            }

            const updatedSubCategory = await SubCategoryService.updateSubCategory(subCategoryId, subCategoryData);
            if (!updatedSubCategory) {
                return res.status(404).json({ message: 'Subcategory not found' });
            }
            res.status(200).json({success: true, message: 'Subcategory updated successfully', subCategory: updatedSubCategory});

        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    static async getAllSubCategories(req, res) {
        const { page = 1, limit = 10 } = req.query;

        try {
            const pageNumber = parseInt(page, 10);
            const limitNumber = parseInt(limit, 10);

            const subcategories = await SubCategoryService.getAllSubCategories(pageNumber, limitNumber);
            const totalSubCategories = await SubCategory.countDocuments();
            res.status(200).json({ success: true, subcategories: subcategories, totalPages: Math.ceil(totalSubCategories / limitNumber), currentPage: pageNumber });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getSubCategoryById(req, res) {
        const subCategoryId = req.params.id;

        try {
            const subCategory = await SubCategory.getSubCategoryById(subCategoryId);
            if (!subCategory) {
                res.status(404).json({ success: false, message: 'Subcategory not found.' });
            }
            res.status(200).json({ success: true, Subcategory: subCategory });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async deleteSubCategory(req, res) {
        const subCategoryId = req.params.id;
        try {
            const subCategory = await SubCategoryService.deleteSubCategory(subCategoryId);
            if (!subCategory) {
                return res.status(404).json({ success: false, message: 'Subcategory not found.' });
            }
            res.status(200).json({ success: true, message: 'Subcategory deleted successfully' });
        } catch (error) {
                res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = SubCategoryController;