const Review = require('../models/Review');
const Order = require('../models/Order');
const User = require('../models/User');

exports.createReview = async (req, res) => {
    try {
        const { orderId, rating, comment } = req.body;
        const reviewerId = req.user.id;

        // Find the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify order is completed and reviewer is the buyer
        if (order.status !== 'completed') {
            return res.status(400).json({ message: 'Can only review completed orders' });
        }
        if (order.buyer.toString() !== reviewerId) {
            return res.status(403).json({ message: 'Not authorized to review this order' });
        }

        // Check if review already exists
        const existingReview = await Review.findOne({ order: orderId });
        if (existingReview) {
            return res.status(400).json({ message: 'Review already exists for this order' });
        }

        // Create review
        const review = new Review({
            reviewer: reviewerId,
            seller: order.seller,
            order: orderId,
            rating,
            comment
        });

        await review.save();

        // Update seller's average rating
        const sellerReviews = await Review.find({ seller: order.seller });
        const averageRating = sellerReviews.reduce((acc, curr) => acc + curr.rating, 0) / sellerReviews.length;
        
        await User.findByIdAndUpdate(order.seller, {
            $set: { 
                rating: averageRating,
                totalReviews: sellerReviews.length
            }
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSellerReviews = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const reviews = await Review.find({ seller: sellerId })
            .populate('reviewer', 'firstName lastName')
            .sort('-createdAt');

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 