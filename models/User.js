const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// to load environment variables from a .env file into process.env
const dotenv = require('dotenv');
dotenv.config();

// get salt rounds from .env
const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    fullname: { type: String },
    userName: { type: String, required: true },
    password: { type: String, required: true },
    role: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
    userStatus: { type: String, enum: ['pending', 'active', 'banned'], required: true },
    verificationToken: { type: String },
    verifiedAt: { type: Date, default: undefined },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Hash the password before saving the user model
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
});

module.exports = mongoose.model('User', UserSchema);