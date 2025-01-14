const { default: mongoose } = require('mongoose');
const SubTopic = require('../models/subTopic');
const { automatedTopic } = require('./topicController');

// Automated Subtopi from Book controller
exports.automatedSubTopic = async (session, subTopic, next) => {
    const existing = await SubTopic.findOne({
        subTopicName: subTopic.subTopicName
    }).session(session);
    if (existing) {
        return existing;
    }
    const topicId = (await automatedTopic(session, subTopic.topic, next))._id;
    const prepLabel = ((await SubTopic.find({
        topic: topicId
    })).length + 1).toString().padStart(3, '0');
    const newSubTopic = new SubTopic({
        subTopicName: subTopic.subTopicName,
        subTopicDes: subTopic.subTopicDes,
        subTopicLabel: prepLabel,
        topic: topicId
    });
    const saved = newSubTopic.save({ session });
    return saved;
}

// Add subtopic
exports.addSubTopic = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction()
    try {
        const subTopic = req.body;
        const check = await SubTopic.findOne({
            $or: [
                { subTopicName: subTopic.subTopicName }
            ]
        }).session(session);
        if (check) {
            await session.abortTransaction();
            return res.status(409).json({ message: "Sub-Topic existed" });
        }
        // prepare topic ID
        const prepTopic = await automatedTopic(session, subTopic.topic, next);
        const prepLabel = ((await SubTopic.find({
            topic: prepTopic._id
        })).length + 1).toString().padStart(3, '0');
        const newSubTopic = new SubTopic(
            {
                subTopicName: subTopic.subTopicName,
                subTopicDes: subTopic.subTopicDes,
                subTopicLabel: prepLabel,
                topic: prepTopic._id
            }
        );
        const saved = await newSubTopic.save({ session });
        await session.commitTransaction();
        res.status(201).json(saved);

    } catch (error) {
        await session.abortTransaction();
        next(error)
    } finally {
        session.endSession();
    }
}

// Get subtopic
exports.getSubTopics = async (req, res, next) => {
    try {
        const subTopics = await SubTopic.find().
            populate('topic', '_id topicName');
        res.status(200).json(subTopics);
    } catch (error) {
        next(error);
    }
}

// get SubTopic by ID
exports.getSubTopicByID = async (req, res, next) => {
    try {
        const subTopic = await SubTopic.findById(req.params.id);
        if (!subTopic) {
            return res.status(404).json({ error: "Could not find topic" });
        }
        res.status(200).json(subTopic);
    } catch (error) {
        next(error);
    }
}

// delete Sub Topic by ID
exports.deleteSubTopic = async (req, res, next) => {
    try {
        const deleted = await SubTopic.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: "Could not find topic" });
        }
        res.status(201).json({ message: "Successfully" });
    } catch (error) {
        next(error);
    }
}

// update
exports.updateSubTopic = async (req, res, next) => {
    try {
        const body = req.body;
        const updating = await SubTopic.findById(req.params.id);
        if (!updating) {
            return res.status(404).json({ error: "Could not find topic" });
        }
        // check if duplicate Information
        const check = await SubTopic.findOne({
            $or: [
                { subTopicName: body.subTopicName },
                { subTopicLable: body.subTopicLable }
            ]
        });
        if (check && check._id.toString() !== req.params.id) {
            return res.status(409).json({ error: "duplicate information" });
        }
        updating.subTopicName = body.subTopicName;
        updating.subTopicDes = body.subTopicDes;
        updating.subTopicLabel = body.subTopicLable;
        updating.topic = body.topic;
        updating.updatedAt = Date.now();
        await updating.save();
        res.status(201).json(updating);
    } catch (error) {
        next(error);
    }
}