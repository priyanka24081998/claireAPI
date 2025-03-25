const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // 🔥 Check if token is provided
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ status: 'fail', message: 'Access denied. No token provided' });
    }

    // 🔥 Extract token from "Bearer <token>"
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, 'claireDiamonds'); // Use a secure secret key
        req.user = decoded; // Attach user info to request
        next(); // Pass control to the next middleware
    } catch (error) {
        res.status(403).json({ status: 'fail', message: 'Invalid or expired token' });
    }
};
