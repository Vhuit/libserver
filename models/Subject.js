const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    subjectName: { type: String, required: true },
    description: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Subject', SubjectSchema);