const express = require('express');
const router = express.Router();
const { 
    checkout, 
    getBuyerOrders, 
    getSellerOrders, 
    completeOrder 
} = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.post('/checkout', auth, checkout);
router.get('/buyer', auth, getBuyerOrders);
router.get('/seller', auth, getSellerOrders);
router.post('/complete', auth, completeOrder);

module.exports = router; 