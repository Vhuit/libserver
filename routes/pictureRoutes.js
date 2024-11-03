/**
 * @api {get} /api/pictures Get all pictures
 * Create picture manipulating routes
 */

const express = require('express');
const router = express.Router();
const { addPicture, getAllPictures, getPicsByCate, getPicByID, getPictureForEntity, deletePicture, updatePicDetails, updatePicIsUsed, getIsUsedPictureForEntity, getAllPicForEntity } = require('../controllers/pictureController');
const uploadPicture = require('../middleware/pictureHandler');

// Route to upload and add picture metadata
/**
 * This route receives a file and a JSON object
 * The JSON object must contain the following fields:
 * {
 * "relatedEntity": "string",
 * "categoryRef": "string"
 * "category": "string",
 * "description": "string"
 * "title": "string",
 * },
 * The file must be sent as a form-data with the key 'file'
 * categoryRef must be one of the following: 'Book', 'Author', 'Publisher', 'Subject', 'User'
 * category must be one of the following: 'bookCover', 'userProfile', 'authorProfile', 
 * 'publisherLogo', 'subjectImage', 'pageDecoration'
 */
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
router.get('/enti-used/:refID/', getIsUsedPictureForEntity);

// get All pictures by RefEntity.
router.get('/enti/:refID', getAllPicForEntity);

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