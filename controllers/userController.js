const User = require('../models/User');
const sendMail = require('../middleware/mailHandler')
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// create verification token
function createVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Mail preparation
const verificationSender = async (user, text, subject, next) => {
    try {
        await sendMail({
            to: user.email,
            subject: subject,
            text: text
        }, next);
        return true;
    } catch (error) {
        next(error);
        return false;
    }
}

exports.createUser = async (req, res, next) => {
    try {
        const user = req.body;
        // check duplicate
        const duplicated = await User.findOne({
            $or: [
                { email: user.email },
                { userName: user.userName }
            ]
        });
        if (duplicated) {
            return res.status(404).json({ error: "Duplicated information" });
        }
        const token = createVerificationToken();
        const newUser = new User({
            userName: user.userName,
            password: user.password,
            email: user.email,
            fullname: user.fullname,
            role: user.role,
            userStatus: 'pending',
            verificationToken: token
        });

        const link = `http://127.0.0.1:3000/user/verify/${token}/${user.userName}`;
        const text = `Welcome to TestApp`
            + `\n\nYou or someone has used this email to register in our Library TestApp\n`
            + `If it was you, please click the following link to verify your account:\n${link}`
            + `\n\nIf it was not you, please disregard this email.\n\nThank you!\n\nLibDevTeam`;
        if (!(await verificationSender(user, text, 'Welcome to TestApp', next))) {
            return res.status(500).json({ error: "Error from Mail server, try again" });
        }
        await newUser.save();
        res.status(201).json({ message: "Check your mail and verify" });
    } catch (error) {
        next(error);
    }
}

exports.getAllUser = async (req, res, next) => {
    try {
        const filter = {};
        const projection = {
            password: 0
        }
        const users = await User.find(filter, projection);
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

exports.verifyUser = async (req, res, next) => {
    try {
        const token = req.params.token;
        const userName = req.params.user;
        const verifying = await User.findOne({
            verificationToken: token,
            userName: userName
        });
        if (!verifying) {
            return res.status(404).json({ error: "Could not process, check again" });
        }
        verifying.verificationToken = undefined;
        verifying.userStatus = 'active';
        verifying.verifiedAt = Date.now();
        await verifying.save();
        res.status(201).json("verified");
    } catch (error) {
        next(error);
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: "Could not find" });
        }
        res.status(201).json({ message: "Successfully" });
    } catch (error) {
        next(error);
    }
}

// Update User
exports.updateUser = async (req, res, next) => {
    try {
        const body = req.body;
        // check if new information clashed
        const check = await User.findOne({
            $or: [
                { userName: body.userName },
                { mail: body.mail }
            ]
        })
        if (check && check._id.toString() !== req.params.id) {
            return res.status(409).json({ error: "Existed information" });
        }
        const updated = await User.findById(req.params.id);
        if (!updated) {
            return res.status(404).json({ error: "User could not found" });
        }
        updated.email = body.email;
        updated.role = body.role;
        updated.userStatus = body.userStatus;
        updated.updatedAt = Date.now();
        await updated.save()
        res.status(201).json({ message: "Successfully" });
    } catch (error) {
        next(error);
    }
}

// Login
exports.userLogin = async (req, res, next) => {
    try {
        const { info, password } = req.body;
        const user = await User.findOne({
            $or: [
                { email: info },
                { userName: info }
            ]
        });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        if (user.verificationToken) {
            return res.status(403).json({ error: "Verify your email before proceed" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const loginToken = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({
            message: 'Login successful',
            user: {
                ...user._doc,
                password: undefined
            },
            token: loginToken
        });
    } catch (error) {
        next(error);
    }
}

// Change password
exports.changePasswordByUser = async (req, res, next) => {
    try {
        const {
            oldPass,
            newPass,
            userId
        } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (!bcrypt.compare(oldPass, user.password)) {
            return res.status(401).json({ message: "Invalid password" });
        }
        user.password = newPass;
        user.updatedAt = Date.now();
        user.verificationToken = undefined;
        await user.save();
        res.status(201).json({ message: "Successfully" });
    } catch (error) {
        next(error);
    }
}

// Password reset via email verification token.
exports.resetPasswordByToken = async (req, res, next) => {
    try {
        const token = req.params.token;
        const reqUser = req.params.user;
        const { newPass } = req.body;
        const user = await User.findOne({
            $or: [
                { userName: reqUser },
                { email: reqUser }
            ],
            verificationToken: token
        });
        if (!user) {
            return res.status(404).json({
                error: "Invalid request"
            });
        }
        user.verificationToken = undefined;
        user.password = newPass;
        user.updatedAt = Date.now();
        user.save();
        res.status(201).json({ message: "Successfully" });
    } catch (error) {
        next(error);
    }
}

// Request for password reset
exports.requestResetPawword = async (req, res, next) => {
    try {
        const { userName, email } = req.body;
        const user = await User.findOne({ userName, email });
        if (!user) {
            return res.status(404).json({ error: "Cannot find user with provided information" });
        }
        // Create Verification Token
        const token = createVerificationToken();

        // Set new value to User.
        user.verificationToken = token;
        // Mail Preparation.
        const link = `http://127.0.0.1:3000/user/u-reset/${token}/${user.userName}`;
        const text = `Good day from Library TestApp Administrative Team`
            + `\n\nYou or someone has requested password reset for your account in our Library TestApp\n`
            + `If it was you, please click the following link to reset your password:\n${link}`
            + `\n\nIf it was not you, please disregard this email.\n\nThank you!\n\nLib Admin Team`;
        if (!(await verificationSender(user, text, 'Reset Password in TestApp', next))) {
            return res.status(500).json({ error: "Error from Mail server, try again" });
        }
        await user.save();
        res.status(201).json({ message: "Successful" });
    } catch (error) {
        next(error);
    }
}