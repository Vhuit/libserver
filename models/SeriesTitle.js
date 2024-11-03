const mongoose = require('mongoose');

const SeriesTitleSchema = new mongoose.Schema({
    seriesTitle: { type: String, required: true },
    seriesTitleDescription: { type: String },
    publishedYear: { type: String },
    publisher: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher', required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('SeriesTitle', SeriesTitleSchema);