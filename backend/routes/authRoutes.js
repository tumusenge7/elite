const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'elite-construction-jwt-secret-change-in-production';

// Simple admin credentials
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log('🔐 Login attempt:', { username });

        // Check credentials
        if (username === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            const token = jwt.sign(
                {
                    username: username,
                    role: 'admin',
                    timestamp: Date.now()
                },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            console.log('✅ Login successful for:', username);

            res.json({
                success: true,
                token: token,
                user: {
                    username: username,
                    role: 'admin',
                    email: ADMIN_EMAIL
                }
            });
        } else {
            console.log('❌ Login failed for:', username);
            res.status(401).json({ error: 'Invalid email or password' });
        }

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Verify token endpoint
router.post('/verify', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ valid: true, user: decoded });
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

module.exports = router;