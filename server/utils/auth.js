    // server/utils/auth.js
    const jwt = require('jsonwebtoken');

    // Function to generate a JWT token
    const generateToken = (payload, secretKey, options = {}) => {
      return jwt.sign(payload, secretKey, options);
    };

    // Function to verify a JWT token
    const verifyToken = (token, secretKey) => {
      try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
      } catch (error) {
        return null; // Token is invalid or expired
      }
    };

    module.exports = { generateToken, verifyToken };