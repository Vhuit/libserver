const express = require('express');
const { getAllSeriesTitles, getSeriesTitleByID, updateSeriesTitleByID, deleteSeriesTitleByID, addSeriesTitle } = require('../controllers/seriesTitleController');
const router = express.Router();

// Get all series titles from DB
router.get('/', getAllSeriesTitles);

// Get Series Title by its ID
router.get('/:id', getSeriesTitleByID);

// Update series title by ID
router.put('/:id', updateSeriesTitleByID);

// Delete Series title by ID
router.delete('/:id', deleteSeriesTitleByID);

// Add a new series title
router.post('/', addSeriesTitle);

module.exports = router;