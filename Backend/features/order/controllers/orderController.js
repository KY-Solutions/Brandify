const CartService = require('../../Cart/services/cartService');
const DiscountCodeService = require('../../discount/services/discountService');
const ProductService = require('../../products/services/productService');
const Order = require('../models/order');
const OrderService = require('../services/orderService');

class OrderController {
    static async createOrder(req, res) {
        const { address, discount } = req.body;
        const userId = req.userId;
        try {
            // get user Cart 
            const userCart = await CartService.getCart(userId);
            if (!userCart) {
                return res.status(404).json({ success: false, message: 'Cart is empty' });
            }
            // calculate total amount and discount 
            let totalPrice = 0;

            userCart.items.forEach(({product, quantity}) => {
                totalPrice += product.price * quantity;
            });
            // apply discount if provided
            let orderDiscount = null;
            if (discount) {
                const validDiscount = await DiscountCodeService.findDiscountBycode(discount);
                if (!validDiscount) {
                    return res.status(400).json({ message: 'Invalid discount code' });
                }
                if (validDiscount.expirationDate < Date.now()) {
                    return res.status(400).json({ message: 'Discount code has expired' });
                }
                if (totalPrice < validDiscount.minOrderAmount) {
                    return res.status(400).json({ message: `Minimum order amount to use the discount is ${validDiscount.minOrderAmount}` });
                }
                if (validDiscount.usedBy.includes(userId)) {
                    return res.status(400).json({ message: 'You have already used this discount code.' });
                }
                const discountAmount = Math.min(
                    (totalPrice * validDiscount.percentage) / 100,
                    validDiscount.maxDiscountAmount || Infinity // infinity is used for cases if the max discount amount is not provided
                );

                totalPrice -= discountAmount;
                orderDiscount = {
                    code: validDiscount.code,
                    percentage: validDiscount.percentage,
                    amountDeducted: discountAmount,
                    ref: validDiscount
                };

               

                // create order
                const orderData = {
                    user: userId,
                    items: userCart.items,
                    totalPrice: totalPrice,
                    address: address,
                    discount: orderDiscount,

                };
                const order = await OrderService.createOrder(orderData);
                 // make sure that the user cannot use this discount code another time
                validDiscount.usedBy.push(userId);
                await validDiscount.save();

                // update product stock amount
                userCart.items.forEach(async({product, quantity}) => {
                    await ProductService.updateProductStock(product._id, quantity);
                });
                
                // delete user cart
                CartService.removeCart(userId);
                return res.status(201).json({ success: true, orderData: order });

            }
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    static async updateOrderStatus(req, res) {
        const  orderId  = req.params.id;
        const { newStatus, newPaymentStatus } = req.body;
        const updateFields = {};
        
        try {
            const order = await OrderService.getOrderById(orderId);
            console.log(order);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            if (newStatus) {
                if (!(Order.schema.path('status').enumValues.includes(newStatus))) {
                    return res.status(400).json({ message: `Invalid status: ${newStatus}` });
                }
                updateFields.status = newStatus;
            }
            if (newPaymentStatus) {
                if (!(Order.schema.path('paymentStatus').enumValues.includes(newPaymentStatus))) {
                   return res.status(400).json({ message: `Invalid payment status: ${newPaymentStatus}` });
                }
                updateFields.paymentStatus = newPaymentStatus;
            }

            // update order
            const updatedOrder = await OrderService.updateOrder(orderId, updateFields);
           return res.status(200).json({ success: true, message: 'Order status updated successfully', orderData: updatedOrder });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getAllOrders(req, res) {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        try {
            const pageNumber = parseInt(page, 10);
            const limitNumber = parseInt(limit, 10);

            const orders = await OrderService.getAllOrders(page, limit, sortBy, sortOrder);
            const totalOrders = await Order.countDocuments();
            res.status(200).json({success: true, orders: orders, totalorders: Math.ceil(totalOrders/limitNumber), currentPage: pageNumber});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async getUserOrders(req, res) {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        const userId = req.userId;
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        try {
            const userOrders = await OrderService.getUserOrders(userId, pageNumber, limitNumber, sortBy, sortOrder);
            const totalUserOrders = await Order.countDocuments({ user: userId });
            res.status(200).json({success: true, userOrders: userOrders, totalPages: Math.ceil(totalUserOrders/limitNumber), currentPage: pageNumber});

        } catch (error) {
            res.status(500).json({ message: error.message }); 
        }
    }
    static async getOrderById(req, res) {
        const orderId = req.params.id;
        try {
            const order = await OrderService.getOrderById(orderId);
            if (!order) {
                res.status(404).json({ message: 'Order not found' });
            }
            res.status(200).json({ success: true, orderData: order });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async deleteOrder(req, res) {
        const orderId = req.params.id;
        try {
            const order = OrderService.deleteOrder(orderId);
            if (!order) {
                res.status(404).json({ message: 'Order not found' });
            }
            res.status(200).json({ success: true, message: 'Order deleted Successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }

    }
}

module.exports = OrderController;