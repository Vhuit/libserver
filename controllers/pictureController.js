/**
 * Handles pictures requests.
 * calling middleware pictureHandler to handle picture manipulation.
 * 
 * @module pictureController
 */

const Picture = require('../models/pictures');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');


// Add picture to the database
exports.addPicture = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // get information from the request.
        const {
            title,
            category,
            description,
            relatedEntity,
            categoryRef
        } = req.body;
        const file = req.file;

        // check if the related entity has former picture
        // if it has, set the former picture to isUsed = false
        const existingPicture = await Picture.findOne({
            relatedEntity: relatedEntity,
            category: category,
            isUsed: true
        }).session(session);
        if (existingPicture) {
            existingPicture.isUsed = false;
            await existingPicture.save({ session });
        }

        // create new picture
        const newPicture = new Picture({
            title,
            metadata:
            {
                size: file.size,
                fileFormat: path.extname(file.originalname)

            },
            filePath: file.path,
            category,
            description,
            relatedEntity,
            categoryRef,
            isUsed: true
        });

        // execute adding picture
        await newPicture.save({ session });
        await session.commitTransaction();
        res.status(201).json(newPicture);

    } catch (error) {
        session.abortTransaction();
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path, (err) => {
                if (err) {
                    console.error(err);
                }
            });
        };
        next(error);
    } finally {
        session.endSession();
    }
}

// Get all pictures from the database
exports.getAllPictures = async (req, res, next) => {
    try {
        const pictures = await Picture.find();
        res.status(200).json(pictures);
    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
}

// get picture by RefEntity, category and isUsed
exports.getPictureForEntity = async (req, res, next) => {
    try {
        const { relatedEntity, category } = req.params;
        const picture = await Picture.findOne({
            relatedEntity: relatedEntity,
            category: category,
            isUsed: true
        })
        if (!picture) {
            res.status(404).json({ message: 'Picture not found' });
        }
        res.status(200).json(picture);
    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
}

// ger picture by id.
exports.getPicByID = async (req, res, next) => {
    try {
        const picture = await Picture.findById(req.params.id);
        if (!picture) {
            res.status(404).json({ message: 'Picture not found' });
        }
        res.status(200).json(picture);
    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
}

// get all pictures by category
exports.getPicsByCate = async (req, res, next) => {
    try {
        const pictures = await Picture.find({
            category: req.params.category
        });
        if (!pictures) {
            res.status(404).json({ message: 'Pictures not found' });
        }
        res.status(200).json(pictures);
    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
}

exports.deletePicture = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const picture = await Picture.findByIdAndDelete(req.params.id).session(session);
        if (!picture) {
            res.status(404).json({ message: 'Picture not found' });
        }
        fs.unlinkSync(picture.filePath, (err) => {
            if (err) {
                console.error(err);
            }
        });
        await session.commitTransaction();
        res.status(200).json({ message: 'Picture deleted' });

    } catch (error) {
        session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
}

// update metadata of the picture
exports.updatePicDetails = async (req, res, next) => {
    try {
        const detail = req.body;
        const picture = await Picture.findById(req.params.id);
        if (!picture) {
            res.status(404).json({ message: 'Picture not found' });
        }
        picture.title = detail.title;
        picture.category = detail.category;
        picture.description = detail.description;
        picture.relatedEntity = detail.relatedEntity;
        picture.categoryRef = detail.categoryRef;
        picture.isUsed = detail.isUsed;
        picture.updatedAt = Date.now();
        await picture.save();
        res.status(200).json({ message: 'Picture updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
}


// get all pictures by entity
exports.getPicsByEnti = async (req, res, next) => {
    try {
        const pictures = await Picture.find({
            category: req.params.entiID
        });
        if (!pictures) {
            res.status(404).json({ message: 'Pictures not found' });
        }
        res.status(200).json(pictures);
    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
}

// update isUsed status
exports.updatePicIsUsed = async (req, res, next) => {
    try {
        const picture = await Picture.findById(req.params.id);
        if (!picture) {
            res.status(404).json({ message: 'Picture not found' });
        }
        if (picture.isUsed) {
            picture.isUsed = false;
        } else {
            const inUsedPic = await Picture.findOne({
                relatedEntity: picture.relatedEntity,
                category: picture.category,
                isUsed: true
            });
            if (inUsedPic) {
                inUsedPic.isUsed = false;
                await inUsedPic.save();
            }
            picture.isUsed = true;
        }
        picture.updatedAt = Date.now();
        await picture.save();
        res.status(200).json({ message: 'isUsed status updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
}