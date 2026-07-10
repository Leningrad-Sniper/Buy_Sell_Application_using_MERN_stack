const express = require('express');
const router = express.Router();
const { addToCart, getCart, removeFromCart } = require('../controllers/cartController');
const auth = require('../middleware/auth');

router.post('/add', auth, addToCart);
router.get('/', auth, getCart);
router.delete('/remove/:itemId', auth, removeFromCart);

module.exports = router; 