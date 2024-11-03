const Topic = require('../models/topic');

exports.automatedTopic = async (session, topic, next) => {
    try {
        const existed = await Topic.findOne({
            $or: [
                { _id: topic._id },
                { topicName: topic.topicName },
                { topicDes: topic.topicDes },
                { topicLabel: topic.topicLabel }
            ]
        }).session(session);
        if (existed) {
            return existed;
        }
        const newTopic = new Topic({
            topicName: topic.topicName,
            topicDes: topic.topicDes,
            topicLabel: topic.topicLabel,
            topicLocation: topic.topicLocation
        });
        const saved = await newTopic.save({ session });
        return saved;
    } catch (error) {
        next(error);
        throw error;
    }
}

exports.addTopic = async (req, res, next) => {
    try {
        const topic = req.body; // get topicName, topicDes, topicLabel from body
        // check if topic exists
        const check = await Topic.findOne({
            $or: [
                { topicName: topic.topicName },
                { topicDes: topic.topicDes },
                { topicLabel: topic.topicLabel }
            ]
        });
        if (check) {
            return res.status(409).json({ error: "Topic is already in DB" });
        }
        const newTopic = new Topic(topic);
        await newTopic.save();
        res.status(201).json(newTopic);
    } catch (error) {
        next(error);
    }
}

exports.getAllTopics = async (req, res, next) => {
    try {
        const topics = await Topic.find();
        res.status(200).json(topics);
    } catch (error) {
        next(error);
    }
}

exports.updateTopic = async (req, res, next) => {
    try {
        const body = req.body;
        const found = await Topic.findById(req.params.id);
        if (!found) {
            return res.status(404).json({ error: "No topic found" });
        }

        // check if duplicate Information
        const duplicate = await Topic.findOne({
            $or: [
                { topicName: body.topicName },
                { topicLabel: body.topicLabel }
            ]
        });

        if (duplicate && duplicate._id.toString() != req.params.id) {
            return res.status(409).json({ error: "Duplicate Information" });
        }
        found.topicName = body.topicName;
        found.topicDes = body.topicDes;
        found.topicLabel = body.topicLabel;
        found.topicLocation = body.topicLocation;
        found.updatedAt = Date.now();
        await found.save();
        res.status(201).json(found);
    } catch (error) {
        next(error);
    }
}

// delete topic
exports.deleteTopic = async (req, res, next) => {
    try {
        const deleted = await Topic.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: "Could not find topic" });
        }
        res.status(201).json({ message: "Deleted Successfully" });
    } catch (error) {
        next(error);
    }
}

// get topic by ID
exports.getTopicByID = async (req, res, next) => {
    try {
        const found = await Topic.findById(req.params.id);
        if (!found) {
            return res.status(404).json({ error: "No topic found" });
        }
        res.status(200).json(found);
    } catch (error) {
        next(error);
    }
}

exports.countTopic = async (req, res, next) => {
    try {
        const found = await Topic.find();
        res.status(200).json({ count: `${found.length}` })
    } catch (error) {
        next(error);
    }
}