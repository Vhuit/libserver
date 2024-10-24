const mongoose = require('mongoose');

const LanguageSchema = new mongoose.Schema({
    language: { type: String, required: true },
    abriviation: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Language', LanguageSchema);