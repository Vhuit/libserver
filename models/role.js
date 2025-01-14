const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    roleName: { type: String, required: true },
    permissions: { type: [String], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Role', RoleSchema);