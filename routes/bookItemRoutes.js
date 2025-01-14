const express = require('express');
const { getBookItems, getBookItemByID, addBookItem, addNumberItems, updateItemByID } = require('../controllers/bookItemController');
const router = express.Router();

// Get All Book Items
router.get('/', getBookItems);

// Get Item by ID
router.get('/:id', getBookItemByID);

// Add a New Item
router.post('/', addBookItem);

// Add many new Items
router.post('/vast', addNumberItems);

// Update Item Status
router.put('/:id', updateItemByID);

module.exports = router;