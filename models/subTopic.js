const mongooese = require('mongoose');

const SubTopicSchema = new mongooese.Schema({
    subTopicName: { type: String, required: true },
    subTopicDes: String,
    subTopicLable: String,
    topic: { type: mongooese.Schema.Types.ObjectId, ref: 'Topic' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongooese.model('SubTopic', SubTopicSchema);