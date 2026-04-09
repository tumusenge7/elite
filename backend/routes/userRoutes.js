const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'elite-construction-jwt-secret';

// Register user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if email already exists
        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Email already registered. Please login.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await db.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        // Generate token
        const token = jwt.sign(
            { id: result.insertId, email, name },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            token,
            user: { id: result.insertId, name, email }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Check if user exists
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = users[0];

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Check if email exists
router.post('/check-email', async (req, res) => {
    try {
        const { email } = req.body;

        const [users] = await db.query('SELECT id, name, email FROM users WHERE email = ?', [email]);

        res.json({
            exists: users.length > 0,
            user: users[0] || null
        });

    } catch (error) {
        console.error('Check email error:', error);
        res.status(500).json({ error: 'Failed to check email' });
    }
});

// Send chat message
router.post('/send-message', async (req, res) => {
    try {
        const { user_id, message } = req.body;

        if (!user_id || !message) {
            return res.status(400).json({ error: 'User ID and message are required' });
        }

        // Save message
        await db.query(
            'INSERT INTO chat_messages (user_id, message) VALUES (?, ?)',
            [user_id, message]
        );

        // Update or create conversation
        const [existing] = await db.query(
            'SELECT id FROM chat_conversations WHERE user_id = ? AND status != "resolved"',
            [user_id]
        );

        if (existing.length === 0) {
            await db.query(
                'INSERT INTO chat_conversations (user_id, status) VALUES (?, "pending")',
                [user_id]
            );
        }

        res.json({ success: true, message: 'Message sent successfully' });

    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Get user's chat history
router.get('/chat-history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const [messages] = await db.query(
            'SELECT id, message, created_at FROM chat_messages WHERE user_id = ? ORDER BY created_at ASC',
            [userId]
        );

        const [conversations] = await db.query(
            'SELECT * FROM chat_conversations WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );

        res.json({ messages, conversations });

    } catch (error) {
        console.error('Get chat history error:', error);
        res.status(500).json({ error: 'Failed to get chat history' });
    }
});

// Get user by ID
router.get('/user/:id', async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, name, email FROM users WHERE id = ?', [req.params.id]);

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(users[0]);

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
});

module.exports = router;