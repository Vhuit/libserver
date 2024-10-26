/**
 * Author model
 * create a structure for the author collection in the database
 * 
 */

const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({
    authorName: { type: String, required: true },
    birthday: { type: String },
    authorBio: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Author', AuthorSchema);