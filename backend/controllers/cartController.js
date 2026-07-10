const User = require('../models/User');
const Item = require('../models/Item');

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { itemId } = req.body;
        const userId = req.user._id;

        // Check if item exists
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Prevent adding own items to cart
        if (item.seller.toString() === userId.toString()) {
            return res.status(400).json({ message: 'Cannot add your own item to cart' });
        }

        // Add to cart
        const user = await User.findById(userId);
        const existingItem = user.cart.find(item => item.item.toString() === itemId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cart.push({ item: itemId });
        }

        await user.save();
        res.json({ message: 'Item added to cart', cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get cart items
exports.getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate({
                path: 'cart.item',
                select: 'name price description seller',
                populate: {
                    path: 'seller',
                    select: 'firstName lastName email'
                }
            });

        res.json(user.cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;
        const user = await User.findById(req.user._id);
        
        user.cart = user.cart.filter(item => item.item.toString() !== itemId);
        await user.save();
        
        res.json({ message: 'Item removed from cart', cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 