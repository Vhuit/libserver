/**
 * Publisher Controller
 * 
 */

const Publisher = require('../models/publisher');

// Add one publisher to the Publisher collection
/**
 * This function receives a JSON object with the following fields:
 * {
 * "publisherName": "string",
 * "publisherAddress": "string",
 * "publisherPhone": "string",
 * "publisherEmail": "string"
 * }
 * This function is controlled by the BookController/SeriesTitleController
 * 
 * the session parameter is passed from the BookController
 * if error, throw error to the next middleware and to BookController catch block
 * session is aborted in the BookController catch block
 * if, successful, return the saved Publisher document
 * session is committed in the BookController try block
 */

exports.automatedAddPublisher = async (session, publisher, next) => {
    try {
        const existingPublisher = await Publisher.findOne({
            publisherName: publisher.publisherName,
            publisherLocation: publisher.publisherLocation

        }).session(session);
        if (existingPublisher) {
            return existingPublisher;
        }
        const newPublisher = new Publisher({
            publisherName: publisher.publisherName,
            publisherLocation: publisher.publisherLocation,
            publisherEstDate: publisher.publisherEstDate
        });
        const savedPublisher = await newPublisher.save({ session });
        return savedPublisher;
    } catch (error) {
        console.log(error.message);
        next(error);
        throw error;
    }
}

// Add publisher via POST route
exports.addPublisher = async (req, res, next) => {
    try {
        const body = req.body;

        // check if the publisher already exists in DB.
        const existing = await Publisher.findOne({
            publisherName: body.publisherName,
            publisherLocation: body.publisherLocation,
            publisherEstDate: body.publisherEstDate
        })
        if (existing) {
            return res.status(400).json("Publisher had been already added");
        }
        const newPublisher = new Publisher(body);
        const savedPublisher = await newPublisher.save();
        res.status(201).json(savedPublisher);
    } catch (error) {
        next(error);
    }
}

// Get all publishers
exports.getAllPublishers = async (req, res, next) => {
    try {
        const publishers = await Publisher.find();
        res.status(200).json(publishers);
    } catch (error) {
        next(error);
    }
}

// Update a publisher
exports.updatePublisher = async (req, res, next) => {
    try {
        const updatingPublisher = req.body;
        const updatedPublisher = await Publisher.findById(req.params.id);
        const dublicate = await Publisher.findOne({
            publisherName: updatingPublisher.publisherName,
            publisherLocation: updatingPublisher.publisherLocation,
            publisherEstDate: updatingPublisher.publisherEstDate
        });
        if (!updatedPublisher) {
            return res.status(404).json({ error: "Publisher not found" });
        }
        if (dublicate && dublicate._id.toString() !== updatedPublisher._id.toString()) {
            return res.status(409).json({ error: "The same information exists" })
        }
        updatedPublisher.publisherName = updatingPublisher.publisherName;
        updatedPublisher.publisherLocation = updatingPublisher.publisherLocation;
        updatedPublisher.publisherEstDate = updatingPublisher.publisherEstDate;
        updatedPublisher.updatedAt = Date.now();
        await updatedPublisher.save();
        res.status(200).json(updatedPublisher);
    } catch (error) {
        next(error);
    }
}

// Delete a publisher
exports.deletePublisher = async (req, res, next) => {
    try {
        const delPublisher = await Publisher.findByIdAndDelete(req.params.id);
        if (!delPublisher) {
            return res.status(404).json({ error: "Publisher not found" });
        }
        res.status(200).json({ message: "Publisher deleted successfully" });
    } catch (error) {
        next(error);
    }
}

// Get publisher by ID
exports.getPublisherByID = async (req, res, next) => {
    try {
        const foundPublisher = await Publisher.findById(req.params.id);
        if (!foundPublisher) {
            return res.status(404).json({ error: "Publisher not found" });
        }
        res.status(200).json(foundPublisher);
    } catch (error) {
        next(error);
    }
}

// Get publisher by name
exports.getPublisherByName = async (req, res, next) => {
    try {
        const foundPublisher = await Publisher.findOne({
            publisherName: req.params.name
        });
        if (!foundPublisher) {
            return res.status(404).json({ error: "Publisher not found" });
        }
        res.status(200).json(foundPublisher);
    } catch (error) {
        next(error);
    }
}