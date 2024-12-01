//* import packages
const Product = require('../models/product');
const mongoose = require('mongoose');

//* Product Service class

class ProductService {

    static async createProduct(productData) {
        const product = new Product(productData);
        return await product.save();
    }

    static async getAllProducts(filters = {}, page = 1, limit = 10) {
        mongoose.set('strictPopulate', false);
        return await Product.find(filters)
            .populate('Category').populate('Subcategory')
            .populate('Review')
            .skip((page - 1) * limit)
            .limit(limit);
    }

    static async getProductbyId(productId) {
        return await Product.findById(productId)
            .populate('Category')
            .populate('Review');
    }

    static async updateProduct(productId, productData) {
        return await Product.findByIdAndUpdate(productId, productData, { new: true });
    }

    static async deleteProduct(productId) {
        return await Product.findByIdAndDelete(productId);
    }

    static async updateProductStock(productId, quantity) {
        const product = await ProductService.getProductbyId(productId);
        if (product) {
            product.stock -= quantity;            
            await product.save();
            console.log(`new stock = ${product.stock}`);
        }
    }

}

module.exports = ProductService;