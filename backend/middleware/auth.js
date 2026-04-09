const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        console.log(`🔑 Verifying token for: ${req.method} ${req.url}`);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
        console.log('✅ Token verified successfully for:', decoded.username);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('❌ JWT Verification Failed:', err.message);
        return res.status(403).json({ error: 'Invalid or expired token.' });
    }
};

module.exports = verifyToken;
