const express = require('express');
const { getAllPublishers, addPublisher, updatePublisher, deletePublisher, getPublisherByID, getPublisherByName } = require('../controllers/publisherController');
const router = express.Router();


// Get all publishers
router.get('/', getAllPublishers);

// Add a publisher
router.post('/', addPublisher)

// Update a publisher by ID
router.put('/:id', updatePublisher)

// Delete a publisher by ID
router.delete('/:id', deletePublisher)

// Get publisher by ID
router.get('/:id', getPublisherByID);

// Get publisher by Name
router.get('/name/:name', getPublisherByName)

module.exports = router;