const express = require('express');
const { addRole, getAllRoles, getRoleById, updateRole, deleteRole } = require('../controllers/roleController');
const router = express.Router()

router.post('/', addRole);

router.get('/', getAllRoles);

router.get('/:id', getRoleById);

router.put('/:id', updateRole);

router.delete('/:id', deleteRole);

module.exports = router;