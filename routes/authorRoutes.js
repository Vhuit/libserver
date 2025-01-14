const express = require('express');
// Import request handlers from author controller
const {
    addAuthor,
    getAuthors,
    updateAuthor,
    deleteAuthor,
    getAuthorByID,
    getAuthorByName
} = require('../controllers/authorController');
const router = express.Router();

// Add a book
router.post('/', addAuthor);

// Get all Authors
router.get('/', getAuthors);

// Update Auther by ID
router.put('/:id', updateAuthor);

// Delete Author by ID
router.delete('/:id', deleteAuthor);

// Get Author by ID
router.get('/:id', getAuthorByID);

// Get Author by Name and Birthday
router.get('/name/:authorName', getAuthorByName);

module.exports = router;