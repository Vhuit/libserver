/**
 * Create structure of Picture model
 * Picture Model is used to store the image information
 * of the books as cover image, or of the authors as profile image
 * or of the publishers as logo image, user profile image, etc.
 * 
 */

const mongoose = require('mongoose');

const PictureSchema = new mongoose.Schema({
    title: { type: String, required: true },
    metadata:
    {
        size: { type: Number },
        fileFormat: { type: String },
    },
    filePath: { type: String, required: true },
    category: {
        type: String,
        enum: [
            'bookCover',
            'userProfile',
            'authorProfile',
            'publisherLogo',
            'subjectImage',
            'pageDecoration',
        ],
    },
    description: { type: String, required: false },
    relatedEntity: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'categoryRef',
    },
    categoryRef: {
        type: String,
        enum: ['Book', 'Author', 'Publisher', 'Subject', 'User']
    },
    isUsed: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Picture', PictureSchema);