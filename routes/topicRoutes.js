const express = require('express');
const { getAllTopics, getTopicByID, addTopic, updateTopic, deleteTopic, countTopic } = require('../controllers/topicController');
const router = express.Router();

// Get all topics
router.get('/', getAllTopics);

// Get topic by ID
router.get('/:id', getTopicByID);

// Add a topic 
router.post('/', addTopic);

// Update topic by its ID
router.put('/:id', updateTopic);

// Delete topic by its ID
router.delete('/:id', deleteTopic);

router.get('/c/c', countTopic);

module.exports = router;