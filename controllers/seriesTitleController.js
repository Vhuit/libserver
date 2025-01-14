const SeriesTitle = require('../models/SeriesTitle');
const { automatedAddPublisher } = require('./publisherController');
const { default: mongoose } = require("mongoose");

// Add one series title to the SeriesTitle collection
/**
 * This function receives a JSON object with the following fields:
 * {
 * "seriesTitle": "string",
 * "seriesTitleDescription": "string",
 * "publishedYear": "string",
 * "publisherID": "string"
 * }
 * publisherID is the _id of the Publisher document
 * This function is controlled by the BookController
 * 
 * the session parameter is passed from the BookController
 * if error, throw error to the next middleware and to BookController catch block
 * session is aborted in the BookController catch block
 * if, successful, return the saved SeriesTitle document
 * session is committed in the BookController try block
 */
exports.addSeriesTitleFromBook = async (session, seriesTitle, next) => {
    try {
        const existingSeriesTitle = await SeriesTitle.findOne({
            seriesTitle: seriesTitle.seriesTitle,
            publisherID: seriesTitle.publisher._id
        }).session(session);
        if (existingSeriesTitle) {
            return existingSeriesTitle;
        }

        // Prepare the Publisher document
        const prepPublisher = await automatedAddPublisher(session, seriesTitle.publisher, next);
        seriesTitle.publisher = prepPublisher._id;

        const newSeriesTitle = new SeriesTitle({
            seriesTitle: seriesTitle.seriesTitle,
            seriesTitleDescription: seriesTitle.seriesTitleDescription,
            publishedYear: seriesTitle.publishedYear,
            publisher: seriesTitle.publisher
        });
        const savedSeriesTitle = await newSeriesTitle.save({ session });
        return savedSeriesTitle;
    } catch (error) {
        console.log(error.message);
        next(error);
        throw error;
    }
}

// Add series title manually from Router
exports.addSeriesTitle = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // Extract series title details from the request body
        const {
            seriesTitle,
            seriesTitleDescription,
            publishedYear,
            publisher
        } = req.body;

        // prepare publisher
        const prepPublisher = await automatedAddPublisher(session, publisher, next);
        const publisherId = prepPublisher._id;

        // Check if the series title already exists
        const existingSeriesTitle = await SeriesTitle.findOne({
            seriesTitle,
            publisher: publisherId
        });

        if (existingSeriesTitle) {
            await session.abortTransaction();
            return res.status(400).json({ error: 'Series title already exists' });
        }

        // Create a new SeriesTitle document
        const newSeriesTitle = new SeriesTitle({
            seriesTitle,
            seriesTitleDescription,
            publishedYear,
            publisher: publisherId
        });

        // Save the new SeriesTitle document
        await newSeriesTitle.save({ session });
        await session.commitTransaction();
        res.status(201).json(newSeriesTitle);
    } catch (error) {

        // Rollback the transaction in case of an error, remove all changes
        await session.abortTransaction();

        // Return error message to client
        next(error);
        throw error;
    } finally {
        // Close the session.
        session.endSession();
    }
}

// Get all series titles
exports.getAllSeriesTitles = async (req, res, next) => {
    try {
        const seriesTitles = await SeriesTitle.find()
            .populate('publisher', '_id publisherName')
        res.status(200).json(seriesTitles);
    } catch (error) {
        next(error);
    }
}

// Get series title by ID
exports.getSeriesTitleByID = async (req, res, next) => {
    try {
        const seriesTitle = await SeriesTitle.findById(req.params.id);
        if (!seriesTitle) {
            return res.status(404).json({ error: 'Series title not found' });
        }
        res.status(200).json(seriesTitle);
    } catch (error) {
        next(error);
    }
}

// Get series titles by publisher
exports.getSeriesTitlesByPublisher = async (req, res, next) => {
    try {
        const seriesTitles = await SeriesTitle.find({
            publisherID: req.params.pubID
        });
        if (!seriesTitles) {
            return res.status(404).json({ error: 'Series titles not found' });
        }
        res.status(200).json(seriesTitles);
    } catch (error) {
        next(error);
    }
}

// Update series title by ID
exports.updateSeriesTitleByID = async (req, res, next) => {
    try {
        // Get updating body
        const updatingBody = req.body;
        // Find the series title by ID
        const updateSeriesTitle = await SeriesTitle.findById(req.params.id);
        if (!updateSeriesTitle) {
            return res.status(404).json({ error: 'Series title not found' });
        }

        // check if the new information exists in other series titles
        const existing = await SeriesTitle.findOne({
            seriesTitle: updatingBody.seriesTitle,
            seriesTitleDescription: updatingBody.seriesTitleDescription,
            publishedYear: updatingBody.publishedYear,
            publisherID: updatingBody.publisherID
        })

        if (existing && existing._id.toString() !== req.params.id) {
            return res.status(409).json({ error: "Information exists" })
        }
        // Update the series title details
        updateSeriesTitle.seriesTitle = updatingBody.seriesTitle;
        updateSeriesTitle.seriesTitleDescription = updatingBody.seriesTitleDescription;
        updateSeriesTitle.publishedYear = updatingBody.publishedYear;
        updateSeriesTitle.publisherID = updatingBody.publisherID;
        updateSeriesTitle.updatedAt = Date.now();
        // Save the updated series title
        await updateSeriesTitle.save();
        res.status(200).json(updateSeriesTitle);
    } catch (error) {
        next(error);
    }
}

// Delete series title by ID
exports.deleteSeriesTitleByID = async (req, res, next) => {
    try {
        const deteledSeriesTitle = await SeriesTitle.findByIdAndDelete(req.params.id);
        if (!deteledSeriesTitle) {
            return res.status(404).json({ error: 'Series title not found' });
        }
        res.status(200).json('Successful deleted');
    } catch (error) {
        next(error);
    }
}