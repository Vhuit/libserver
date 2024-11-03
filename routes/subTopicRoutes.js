const express = require('express');
const { getSubTopics, getSubTopicByID, addSubTopic, updateSubTopic, deleteSubTopic } = require('../controllers/subTopicController');
const router = express.Router()

// Get all sub topic
router.get('/', getSubTopics);

// Get Sub topic by its ID
router.get('/:id', getSubTopicByID);

// Add Sub topic
router.post('/', addSubTopic);

// Update Sub topic by its ID
router.put('/:id', updateSubTopic);

// Delete Sub topic by its ID
router.delete('/:id', deleteSubTopic);

module.exports = router;