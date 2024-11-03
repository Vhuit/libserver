const express = require('express');
const router = express.Router();
// Import request handlers from book controller
const {
    addBook,
    getAllBooks,
    updateBook,
    deleteBook,
    getBookByID,
    getBookByTitle,
    getBookByISBN,
    getBooksByAuthorID,
    getBookByCallNumber,
    getBooksBySubjectID,
    getBooksByLanguageID,
    getBooksByPublisherID,
    getBooksByPublishedYear,
    getBooksByClassification,
    getBooksBySeriesTitle
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

// find a book by its ISBN
router.get('/isbn/:isbn', getBookByISBN)

// get a book by its call number
router.get('/c-num/:callN', getBookByCallNumber);

// get Books with author ID
router.get('/a-id/:auID', getBooksByAuthorID)

// get books by subject ID
router.get('/subj/:subjID', getBooksBySubjectID);

// Get books by language
router.get('/lang/:lang', getBooksByLanguageID)

// Get books by publisher ID
router.get('/publ/:pubID', getBooksByPublisherID)

// get books published in the year
router.get('/pub-y/:pubYear', getBooksByPublishedYear)

// Get books by classification
router.get('/class/:class', getBooksByClassification)

// get Books by series title
router.get('/series/:sTitle', getBooksBySeriesTitle)

module.exports = router;
