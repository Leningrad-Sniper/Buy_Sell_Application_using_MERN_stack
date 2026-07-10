const Order = require('../models/Order');
const User = require('../models/User');
const Item = require('../models/Item');
const crypto = require('crypto');

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create orders from cart
exports.checkout = async (req, res) => {
    try {
        const buyer = await User.findById(req.user._id).populate('cart.item');
        if (buyer.cart.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const orders = [];
        const otps = {};

        // Create orders for each cart item
        for (const cartItem of buyer.cart) {
            const item = cartItem.item;
            const otp = generateOTP();
            
            const order = new Order({
                buyer: buyer._id,
                seller: item.seller,
                item: item._id,
                amount: item.price,
                otp: otp
            });

            await order.save();
            orders.push(order);
            otps[order._id] = otp;
        }

        // Clear cart after order creation
        buyer.cart = [];
        await buyer.save();

        res.status(201).json({ 
            message: 'Orders created successfully', 
            orders,
            otps // Send OTPs in response
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get buyer's orders
exports.getBuyerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user._id })
            .populate('item')
            .populate('seller', 'firstName lastName email')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get seller's orders
exports.getSellerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ seller: req.user.id })
            .populate('item')
            .populate('buyer', 'firstName lastName email')
            .sort('-createdAt');

        // Include both pending and completed orders
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Complete order with OTP
exports.completeOrder = async (req, res) => {
    try {
        const { orderId, otp } = req.body;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Update order status
        order.status = 'completed';
        await order.save();

        // Update the item status to sold
        const item = await Item.findById(order.item);
        if (item) {
            item.status = 'sold';
            await item.save();
        }

        res.json({ message: 'Order completed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 