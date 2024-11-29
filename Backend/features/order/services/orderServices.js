const Order = require('../models/order');
const ProductService = require('../../products/services/productService');
class OrderService{

    static async createOrder(orderData) {
        const order = new Order(productData);
        return await order.save();
    }

    static async updateOrderStatus(orderId, newStatus) {
        return await Order.findByIdAndUpdate(orderId, { status: newStatus }, { new: true });
    }

}