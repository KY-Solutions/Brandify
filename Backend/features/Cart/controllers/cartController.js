const CartService = require('../services/cartService');
const ProductService = require('../../products/services/productService');
const Product = require('../../products/models/product');

class CartController {

    // Add an item to the cart
    static async addToCart(req, res) {
        try {
            const userId = req.userId;
            const { productId, quantity, customizations } = req.body;

            // Fetch the product
            //const product = await ProductService.getProductbyId(productId);
            const product = await Product.findById(productId);//change later to use productservice after fixing

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            // Validate customizations
            if (customizations.size && !product.sizes.includes(customizations.size)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid size: ${customizations.size}. Available sizes are: ${product.sizes.join(', ')}`
                });
            }

            if (customizations.color && !product.colors.includes(customizations.color)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid color: ${customizations.color}. Available colors are: ${product.colors.join(', ')}`
                });
            }

            // Check if requested quantity exceeds available stock
            if (quantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Requested quantity (${quantity}) exceeds available stock (${product.stock})`
                });
            }

            // Call the service layer function
            const cart = await CartService.addToCart(userId, productId, quantity, customizations);

            // Respond with the updated cart
            return res.status(200).json({
                success: true,
                message: 'Item added to cart successfully',
                cart
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get the user's cart
    static async getCart(req, res) {
        try {
            const userId = req.userId;

            if (!userId) {
                return res.status(400).json({ message: 'User ID is required.' });
            }

            console.log('Received userId:', userId); // Debugging log to verify the format

            const cart = await CartService.getCart(userId);

            if (!cart) {
                return res.status(404).json({ message: 'Cart not found.' });
            }

            res.status(200).json({ success: true, data: cart });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
    
// Controller for updating cart item
static async updateCartItem(req, res) {
    try {
        const userId = req.userId;
        const { productId, quantity, customizations } = req.body;

        // Fetch the product to validate it
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Validate customizations
        if (customizations.size && !product.sizes.includes(customizations.size)) {
            return res.status(400).json({
                success: false,
                message: `Invalid size: ${customizations.size}. Available sizes are: ${product.sizes.join(', ')}`
            });
        }

        if (customizations.color && !product.colors.includes(customizations.color)) {
            return res.status(400).json({
                success: false,
                message: `Invalid color: ${customizations.color}. Available colors are: ${product.colors.join(', ')}`
            });
        }
        //console.log("newQuantity: " + newQuantity);

        // Validate stock availability
        if (quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: `Requested quantity (${quantity}) exceeds available stock (${product.stock})`
            });
        }

        // Call the service layer to update the cart
        const cart = await CartService.updateCartItem(userId, productId, quantity, customizations);

        // Respond with the updated cart
        return res.status(200).json({
            success: true,
            message: 'Cart item updated successfully',
            cart
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

    // Remove an item from the cart
    static async removeCartItem(req, res) {
        
        const productId = req.params.productId;
        const userId = req.userId;
 
        if (!userId) {
            return res.status(400).json({ message: 'User ID is missing or not authenticated.' });
        }
    
        try {
            // Validation: Ensure productId is valid
            if (!productId) {
                return res.status(400).json({ message: 'Product ID is required.' });
            }
    
            const cart = await CartService.removeCartItem(userId, productId);
            if (!cart) {
                return res.status(400).json({ message: 'Failed to remove item from cart.' });
            }
    
            res.status(200).json({ success: true, message: 'Item removed from cart successfully', data: cart });
    
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
    static async removeCart(req, res) { 
        const userId = req.userId;
 
        if (!userId) {
            return res.status(400).json({ message: 'User ID is missing or not authenticated.' });
        }
    
        try {
            const cart = await CartService.removeCart(userId);
            if (!cart) {
                return res.status(400).json({ message: 'Failed to remove cart.' });
            }
    
            res.status(200).json({ success: true, message: 'cart removed successfully'});
    
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
    
}

module.exports = CartController;
