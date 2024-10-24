const mongoose = require('mongoose');

const SeriesTitleSchema = new mongoose.Schema ({
    seriesTitle: { type: String, required: true },
    publishedYear: { type: String },
    publisherID: { type: mongoose.Schema.Types.ObjectId },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('SeriesTitle', SeriesTitleSchema);