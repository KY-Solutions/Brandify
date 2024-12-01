const Cart = require('../models/cartModel');  // Assuming you have a Cart model
const Product = require('../../products/models/product'); // Assuming you have a Product model

class CartService {

    // Add an item to the cart
    static async addToCart(userId, productId, quantity) {
        try {
            // Check if the product exists
            const product = await Product.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }

            // Find or create a cart for the user
            let cart = await Cart.findOne({ user: userId });

            if (!cart) {
                cart = new Cart({
                    user: userId,
                    items: []
                });
            }

            // Check if the item already exists in the cart
            const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId.toString());
            if (existingItemIndex !== -1) {
                // Item already exists, update the quantity
                cart.items[existingItemIndex].quantity += quantity;
            } else {
                // Item doesn't exist in the cart, add it
                cart.items.push({ product: productId, quantity });
            }

            // Save the cart
            await cart.save();

            return cart;
        } catch (error) {
            throw new Error('Error adding item to cart: ' + error.message);
        }
    }

    // Get the user's cart
    static async getCart(userId) {
        return await Cart.findOne({ user: userId }).populate('items.product'); // Use `user` as the key
    }



// Update an item's quantity in the cart
static async updateCartItem(userId, productId, quantity) {
    // Find the cart for the specific user
    const cart = await Cart.findOne({ user: userId }); // Corrected key
    if (!cart) {
        throw new Error('Cart not found'); // Throw error if cart doesn't exist
    }

    // Find the item in the cart
    const item = cart.items.find(item => item.product.toString() === productId); // Use 'product' from schema
    if (item) {
        item.quantity = quantity; // Update the quantity
        await cart.save(); // Save changes to the database
        return cart;
    }

    throw new Error('Item not found in cart'); // Error if item doesn't exist
}

static async removeCartItem(userId, productId) {
    const cart = await Cart.findOne({ user: userId });  // Use 'user' instead of 'userId' if the field is named 'user'
    if (!cart) {
        throw new Error('Cart not found');
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex !== -1) {
        cart.items.splice(itemIndex, 1);
        await cart.save();
        return cart;
    }

    throw new Error('Item not found in cart');
}
static async removeCart(userId) {
    try {
        // Find and delete the cart for the user
        const deletedCart = await Cart.findOneAndDelete({ user: userId });

        if (!deletedCart) {
            throw new Error('Cart not found'); // Handle case where cart doesn't exist
        }

        return { message: 'Cart successfully removed', deletedCart };
    } catch (error) {
        throw new Error('Error removing cart: ' + error.message);
    }
}

}

module.exports = CartService;
