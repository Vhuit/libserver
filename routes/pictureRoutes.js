/**
 * @api {get} /api/pictures Get all pictures
 * Create picture manipulating routes
 */

const express = require('express');
const router = express.Router();
const { addPicture, getAllPictures, getPicsByCate, getPicByID, getPictureForEntity, deletePicture, updatePicDetails, updatePicIsUsed } = require('../controllers/pictureController');
const uploadPicture = require('../middleware/pictureHandler');

// ROute to upload and add picture metadata
router.post('/', uploadPicture.single('file'), addPicture);

// Get all picture metadata
router.get('/', getAllPictures)

// Get picture by id
router.get('/:id', getPicByID);

// Get picture by category
router.get('/cate/:category', getPicsByCate);

// Get picture by RefEntity, category and isUsed
/**
 * If response is 404, it means the picture is not found
 * The default pic must be set in the frontend
 */
router.get('/enti-used/:relatedEntity/:category', getPictureForEntity);

// Delete picture by ID
router.delete('/:id', deletePicture);

// update picture by ID
router.put('/:id', updatePicDetails);

// update isUsed status of a picture
/**
 * This route receives only picture ID
 */
router.put('/used/:id', updatePicIsUsed);

// Export router to be implemented in the app
module.exports = router;