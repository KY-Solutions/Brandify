const Order = require('../models/order');
const ProductService = require('../../products/services/productService');
class OrderService{

    static async createOrder(orderData) {
        const order =  new Order(orderData);
        return (await order.save()).populate([
            { path: 'user', select: 'name email' },
            { path: 'items.product', select: 'name price' },
            { path: 'discount', select: 'code percentage amountDeducted'}
        ]);
    }

    static async updateOrder(orderId, newStatus) {
        return await Order.findByIdAndUpdate(orderId,  newStatus , { new: true });
    }

    static async getAllOrders(page = 1, limit = 10, sortBy, sortOrder) {
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
        const orders = Order.find()
             .populate('user', 'name').populate({
                path: 'items.product',
                select: 'name price'
             })
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(limit);
        
        return orders;
    }

    static async getUserOrders(userId, page = 1, limit = 10, sortBy, sortOrder) {
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
        const userOrders = Order.find({ user: userId })
             .populate('user', 'name').populate({
                path: 'items.product',
                select: 'name price'
             })
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(limit);
        return userOrders;
    }
    static async getOrderById(orderId) {
        return await Order.findOne({_id: orderId})
            .populate('user', 'name').populate({
                path: 'items.product',
                select: 'name price'
            });
    }

    static async deleteOrder(orderId) {
        return await Order.findByIdAndDelete(orderId);
    }

}

module.exports = OrderService;