const jwt = require('jsonwebtoken');


// Create JWT Token
const CreateJWTToken = (data = {}) => {
    let tokenData = {};

    if (data && data.username) {
        tokenData.username = data.username;
    }
    if (data && data.id) {
        tokenData.id = data.id;
    }
    const JWT_SECRET = 'b8f90b1d67e0a417c9f4fbb839c2c8b3b6f0c1d7b48c9a1c981ec3ff3e02f5c1d';
    try {
        const token = jwt.sign(tokenData, JWT_SECRET, { expiresIn: '8h' });
        return token;
    } catch (error) {
        console.error('Error creating JWT token:', error);
        throw new Error('Token creation failed'); 
    }
}


module.exports = { CreateJWTToken };
