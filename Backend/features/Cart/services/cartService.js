const Cart = require('../models/cartModel');  // Assuming you have a Cart model
const Product = require('../../products/models/product'); // Assuming you have a Product model

class CartService {

    // Add an item to the cart
    static async addToCart(userId, productId, quantity, customizations) {
        try {
            // Find or create a cart for the user
            let cart = await Cart.findOne({ user: userId });

            if (!cart) {
                cart = new Cart({
                    user: userId,
                    items: []
                });
            }

            // Check if the product with the same customizations exists in the cart
            const existingItemIndex = cart.items.findIndex(
                item =>
                    item.product.toString() === productId.toString() &&
                    JSON.stringify(item.customizations) === JSON.stringify(customizations)
            );

            if (existingItemIndex !== -1) {
                // Item with the same customizations already exists in the cart, update the quantity
                cart.items[existingItemIndex].quantity += quantity;
            } else {
                // Item doesn't exist in the cart, add it
                cart.items.push({
                    product: productId,
                    customizations,
                    quantity
                });
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
static async updateCartItem(userId, productId, newQuantity, customizations) {
    try {
        // Find the cart for the specific user
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            throw new Error('Cart not found');
        }

        // Find the product to ensure it exists and check stock
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        // Check if the product with the same customizations exists in the cart
        const itemIndex = cart.items.findIndex(
            item =>
                item.product.toString() === productId.toString() &&
                JSON.stringify(item.customizations) === JSON.stringify(customizations)
        );

        if (itemIndex === -1) {
            throw new Error('Item with the specified customizations not found in cart');
        }
        
        // Validate stock availability
        if (newQuantity > product.stock) {
            throw new Error(
                `Requested quantity (${newQuantity}) exceeds available stock (${product.stock})`
            );
        }

        // Update the quantity
        cart.items[itemIndex].quantity = newQuantity;

        // Save changes to the cart
        await cart.save();

        return cart;
    } catch (error) {
        throw new Error('Error updating cart item: ' + error.message);
    }
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
