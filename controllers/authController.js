const bcrypt = require('bcryptjs');
const {CreateJWTToken }= require('../middleware/authMiddleware');
const UserModel = require('../models/userModel');

// Create User
const createUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Check if the user already Registered
        const existingUser = await UserModel.getUserByUsername(email, async (err) => {
            if (err) {
                return res.status(500).json({ error: 'Server error', details: err.message });
            }
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            UserModel.createUser(username, hashedPassword, email, (err, userId) => {
                if (err) {
                    return res.status(500).json({ error: 'Server error', details: err.message });
                }
                const token = CreateJWTToken({ id: userId, username });
                res.status(201).json({ user: { id: userId, username, email }, token, message: 'User registered successfully' });
            });
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

// Login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.getUserByUsername(email, async (err) => {
            if (err || !user) {
                return res.status(400).json({ error: 'User not found' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            const token = CreateJWTToken({ id: user.id, username: user.username });

            res.status(200).json({ token, message: 'Login successful' });
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};


// Get User
const getUser = (req, res) => {
    const userId = req.body.id;
    const user = UserModel.getUserById(userId, (err) => {
        if (err || !user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ user });
    });
};



// Update User Details
const updateUser = (req, res) => {
    const userId = req.user.id; // Get user ID from token
    const { username, email } = req.body;

    UserModel.updateUser(userId, username, email, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Server error', details: err.message });
        }
        res.status(200).json({ message: 'User updated successfully' });
    });
};



// Delete User
const deleteUser = (req, res) => {
    const user = UserModel.deleteUser(req.user.id, userId, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Server error', details: err.message });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    });
};


module.exports = { createUser , login , getUser , updateUser , deleteUser };
