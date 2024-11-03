const express = require('express');
const {
    getLanguages,
    getLangByAbr,
    getLanguage,
    getLangByName,
    addLanguage,
    updateLanguage,
    deleteLanguage
} = require('../controllers/languageController');
const router = express.Router();

router.get('/', getLanguages);

router.get('/abr/:abr', getLangByAbr);

router.get('/:id', getLanguage);

router.get('/lang/:lang', getLangByName);

router.post('/', addLanguage);

router.put('/:id', updateLanguage);

router.delete('/:id', deleteLanguage);

module.exports = router;