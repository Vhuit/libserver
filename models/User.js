const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    userName: { type: String, required: true },
    password: { type: String, required: true },
    role: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
    userStatus: { type: String, enum: ['pending', 'active', 'banned'], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Hash the password before saving the user model
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', UserSchema);