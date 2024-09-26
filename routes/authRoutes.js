const express = require('express');
const { createUser, login, getUser, updateUser, deleteUser } = require('../controllers/authController');

const router = express.Router();

router.post('/users', createUser);
router.post('/login', login);
router.get('/get-user', getUser);
router.put('/update-user', updateUser);
router.delete('/delete-user', deleteUser);

module.exports = router;

