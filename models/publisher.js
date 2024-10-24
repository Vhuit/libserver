const mongoose = require('mongoose');

const PublisherSchema = new mongoose.Schema({
    publisherName: { type: String, required: true },
    publisherLocation: { type: String },
    publisherEstDate: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Publisher', PublisherSchema);