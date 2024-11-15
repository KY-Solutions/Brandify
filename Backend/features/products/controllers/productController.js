//* import packages
const Product = require('../models/product');
const ProductService = require('../services/productService');
const { buildFilterObject } = require('../../../utils/filtersUtil');

class ProductController {
    static async createProduct(req, res) {
        try {
            const productData = req.body;
            //* validation
            if (!productData.name) {
                return res.status(400).json({ message: 'Product name is required.' });
            }
            if (!productData.description) {
                return res.status(400).json({ message: 'Product description is required.' });
            }
            //! temporary comment until category feature is implemented
            // if (!productData.category) {
            //     res.status(400).json({ message: 'Product category is required.' });
            // }
            
            if (!productData.price || productData.price < 0) {
                return res.status(400).json({ message: 'Valid price is required.' });
            }
            if (!productData.stock || productData.stock < 0) {
                return res.status(400).json({ message: 'Valid stock is required.' });
            }

            //* image handling
            if (req.files && req.files.length > 0) {
                const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
                productData.images = imageUrls;
            } else {
                return res.status(400).json({ message: 'At least one image is required.' });
            }

            const product = await ProductService.createProduct(productData);
            res.status(201).json({success: true, message: 'Product created successfully', product: product});
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    static async updateProduct(req, res) {
        try {
            const productId = req.params.id;
            const productData = req.body;

            //* validation
            if (!productId) {
                return res.status(400).json({ message: 'Product ID is required.' });
            }

            //* price validation if provided
            if (productData.price !== undefined) {
                if (productData.price < 0) {
                    return res.status(400).json({ message: 'Valid price is required.' });
                }
            }
            //* stock validation if provided
            if (productData.stock !== undefined) {
                if ( productData.stock < 0) {
                   return res.status(400).json({ message: 'Valid stock is required.' });
                }
            }

            if (req.files && req.files.length > 0) {
                const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
                productData.images = imageUrls;
            }

            const updatedProduct = await ProductService.updateProduct(productId, productData);
            if (!updatedProduct) {
               return res.status(400).json({ message: 'Product not found.' });
            }

            res.status(200).json({success: true, message: 'Product updated successfully', product: updatedProduct});

        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    static async getAllProducts(req, res) {
        const { page = 1, limit = 10, ...filters } = req.query;


        try {
            const pageNumber = parseInt(page, 10);
            const limitNumber = parseInt(limit, 10);

            const filterObject = buildFilterObject(filters);

            const products = await ProductService.getAllProducts(filterObject, pageNumber, limitNumber);
            const totalProducts = await Product.countDocuments(filterObject);
            res.status(200).json({ success: true, products: products, totalPages: Math.ceil(totalProducts / limitNumber), currentPage: pageNumber });

        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getProductById(req, res) {
        const productId = req.params.id;

        try {

            const product = await ProductService.getProductbyId(productId);
            if (!product) {
                return res.status(404).json({ success: false, message: 'Product not found.' });
            }
            res.status(200).json({ success: true, data: product });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async deleteProduct(req, res) {
        const productId = req.params.id;

        try {
            const product = await ProductService.deleteProduct(productId);
            if (!product) {
               return res.status(404).json({ success: false, message: 'Product not found.' });
                }
            res.status(200).json({ success: true, message: 'Product deleted successfuly.' });
        } catch (error) {
                res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = ProductController;