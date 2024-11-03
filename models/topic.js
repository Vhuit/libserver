/**
 * For library management labeling
 */
const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
    topicName: { type: String, required: true },
    topicDes: String,
    topicLabel: String,
    topicLocation: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Topic', TopicSchema);