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
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'files/images';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const sessionSuffix = Date.now().toString() + '-' + Math.round(Math.random() * 1E9) + "-"; // to avoid file name collision
        cb(null, sessionSuffix + file.originalname.replace(/\s+/g, '_')); // assign unique file name
    }
});

const uploadPicture = multer({ storage: storage });

module.exports = uploadPicture;