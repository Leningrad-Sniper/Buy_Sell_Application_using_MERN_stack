const User = require('../models/User');
const Item = require('../models/Item');

exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, age, contactNumber } = req.body;
        const userId = req.user.id;

        const user = await User.findByIdAndUpdate(
            userId,
            {
                firstName,
                lastName,
                age,
                contactNumber
            },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        // User is already attached to req by auth middleware
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('cart.item');
            
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Profile Error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .select('-password')
            .populate('reviews');
            
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get user's items
        const items = await Item.find({ seller: user._id, status: 'available' });

        res.json({
            ...user.toObject(),
            items
        });
    } catch (error) {
        console.error('Get User Profile Error:', error);
        res.status(500).json({ message: error.message });
    }
}; 