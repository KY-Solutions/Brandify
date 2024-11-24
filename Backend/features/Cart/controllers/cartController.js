const CartService = require('../services/cartService');

class CartController {

    // Add an item to the cart
    static async addToCart(req, res) {
        try {
            const { userId, productId, quantity } = req.body;
            //const userId = req.params.id;  // Use optional chaining to avoid the error if user is undefined
    
            // Validation: Ensure productId and quantity are valid
            if (!productId) {
                return res.status(400).json({ message: 'Product ID is required.' });
            }
            if (quantity <= 0) {
                return res.status(400).json({ message: 'Quantity must be greater than 0.' });
            }
    
            // Assuming CartService handles adding to the cart with proper model validation
            const cart = await CartService.addToCart(userId, productId, quantity);
            if (!cart) {
                return res.status(400).json({ message: 'Failed to add item to cart.' });
            }
    
            res.status(200).json({ success: true, message: 'Item added to cart successfully', data: cart });
    
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Get the user's cart
    static async getCart(req, res) {
        try {
            const { userId } = req.body; // Extract userId from the request body

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
        const { userId, productId, quantity } = req.body;

        // Validation: Ensure productId and quantity are valid
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required.' });
        }
        if (quantity < 0) {
            return res.status(400).json({ message: 'Quantity cannot be negative.' });
        }

        // Call service to update cart item
        const cart = await CartService.updateCartItem(userId, productId, quantity);
        if (!cart) {
            return res.status(400).json({ message: 'Failed to update cart item.' });
        }

        res.status(200).json({ success: true, message: 'Cart item updated successfully', data: cart });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


    // Remove an item from the cart
    static async removeCartItem(req, res) {
        const { userId, productId } = req.body;

    
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
    
}

module.exports = CartController;
