const Role = require('../models/role');

exports.addRole = async (req, res, next) => {
    try {
        const role = req.body;
        // check if exists.
        const existing = await Role.findOne({
            roleName: role.roleName
        });
        if (existing) {
            return res.status(409).json({ error: "Role already exists" });
        }
        const newRole = new Role({
            roleName: role.roleName,
            permissions: role.permissions
        });
        await newRole.save();
        res.status(201).json(newRole);
    } catch (error) {
        next(error);
    }
}

exports.getAllRoles = async (req, res, next) => {
    try {
        const roles = await Role.find();
        res.status(200).json(roles);
    } catch (error) {
        next(error);
    }
}

// Get a specific role by ID
exports.getRoleById = async (req, res, next) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ error: 'Role not found' });
        }
        res.status(200).json(role);
    } catch (error) {
        next(error);
    }
};

// Update a role by ID
exports.updateRole = async (req, res, next) => {
    try {
        const updatedRole = await Role.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updatedRole) {
            return res.status(404).json({ error: 'Role not found' });
        }
        res.status(200).json({ message: 'Role updated successfully', updatedRole });
    } catch (error) {
        next(error);
    }
};

// Delete a role by ID
exports.deleteRole = async (req, res, next) => {
    try {
        const deletedRole = await Role.findByIdAndDelete(req.params.id);
        if (!deletedRole) {
            return res.status(404).json({ error: 'Role not found' });
        }
        res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
        next(error);
    }
};