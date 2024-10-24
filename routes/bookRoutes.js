const express = require('express');
const router = express.Router();
const {
    addBook, getAllBooks, updateBook, deleteBook, getBookByID,
    getBookByTitle
} = require('../controllers/bookController');

// Add new book
router.post('/', addBook);

// Get all Books
router.get('/', getAllBooks);

// update a book
router.put('/:id', updateBook);

// delete a book
router.delete('/:id', deleteBook);

// find a book
router.get('/:id', getBookByID);

// find books by title
router.get('/title/:title', getBookByTitle);

module.exports = router;
