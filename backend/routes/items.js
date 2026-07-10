const express = require('express');
const router = express.Router();
const { createItem, getAllItems, getItemById, searchItems } = require('../controllers/itemController');
const auth = require('../middleware/auth');

// Protected routes - require authentication
router.post('/', auth, createItem);
router.get('/', getAllItems);
router.get('/search', searchItems);
router.get('/:id', getItemById);

module.exports = router; 