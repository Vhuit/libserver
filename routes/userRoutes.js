const express = require('express');
const { createUser, getAllUser, verifyUser, deleteUser, userLogin, changePasswordByUser, resetPasswordByToken, requestResetPawword } = require('../controllers/userController');
const authHandler = require('../middleware/authHandler');
const router = express.Router();

// Create new User
router.post('/', createUser);

// Get all user
router.get('/', authHandler, getAllUser);

// Verify User via Mail Token
router.put('/verify/:token/:user', verifyUser);

// Delete User
router.delete('/:id', deleteUser);

// User Login
router.post('/login', userLogin);

// Change Password with login token
router.post('/u-c-p', authHandler, changePasswordByUser);

// Change Password with verification Token
router.post('/u-reset/:token/:user', resetPasswordByToken);

// Request Password Reset
router.post('/u-r', requestResetPawword);

module.exports = router;