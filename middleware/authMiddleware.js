const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }  

    // 🔥 Extract token from "Bearer <token>"

    try {
        const decoded = jwt.verify(token, 'claireDiamonds'); 
        req.user = decoded; 
        next(); 
    } catch (error) {
        res.status(403).json({ status: 'fail', message: 'Invalid or expired token' });
    }
};
