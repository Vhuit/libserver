const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema ({
    roleName: { type: String, required: true },
    permissions: { type: [String], required: true }
});

module.exports = mongoose.model('Role', RoleSchema);