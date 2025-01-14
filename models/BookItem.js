const mongoose = require('mongoose');

const BookItemSchema = new mongoose.Schema ({
    itemLabel: { type: String, required: true },
    itemStatus: { type: String, enum: ['available', 'borrowed', 'lost', 'damaged'], required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BookItem', BookItemSchema);