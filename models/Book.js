/**
 * Book Model
 * Create structure of Book model
 */

const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    isbn: { type: String, required: false },
    seriesTitle: { type: mongoose.Schema.Types.ObjectId, ref: 'SeriesTitle', required: false },
    callNumber: { type: String, required: false },
    publishedYear: { type: String },
    publisher: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher', required: false },
    collation: { type: String, required: false },
    classification: { type: String, required: false },
    contentType: { type: String, required: false },
    mediaType: { type: String, required: false },
    carrierType: { type: String, required: false },
    edition: { type: String, required: false },
    specialDetailInfo: { type: String, required: false },
    statementOfResp: { type: String, required: false },
    fileAttached: { type: String, required: false },
    authors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    }],
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    }],
    languages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Language'
        }
    ],
    label: String,
    subTopic: { type: mongoose.Schema.Types.ObjectId, ref: 'SubTopic' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);