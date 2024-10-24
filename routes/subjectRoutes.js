const express = require('express');
const { addSubject, getSubjects, updateSubject, deleteSubject, getSubjectByID, getSubjectByDesc } = require('../controllers/subjectController');
const router = express.Router();

// Add a subject
router.post('/', addSubject);

// Get all subjects
router.get('/', getSubjects);

// Update a subject
router.put('/:id', updateSubject);

// Delete a subject
router.delete('/:id', deleteSubject);

// Get a subject by ID
router.get('/f/:id', getSubjectByID);

// Get subjects by desc. content
router.get('/q', getSubjectByDesc);

module.exports = router;