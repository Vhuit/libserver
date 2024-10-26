/**
 * @apiDefine PictureHandler
 * 
 * Middleware to handle picture upload and deletion
 * picture uploaded will be stored in the server
 * file path will be sent to store in the database.
 * 
 * Using multer library to handle file upload
 */

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'files/images');
    },
    filename: function (req, file, cb) {
        const sessionSuffix = Date.now().toString() + '-' + Math.round(Math.random() * 1E9); // to avoid file name collision
        cb(null, sessionSuffix + file.originalname); // assign unique file name
    }
});

const uploadPicture = multer({ storage: storage });

module.exports = uploadPicture;