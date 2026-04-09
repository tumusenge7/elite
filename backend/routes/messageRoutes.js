const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'elite-construction-jwt-secret-change-in-production';

// In-memory storage
let messages = [
    {
        id: 1,
        name: 'blaise',
        email: 'john@example.com',
        subject: 'Project Inquiry',
        message: 'I am interested in your construction services for a new project.',
        created_at: new Date().toISOString()
    }
];

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};

// GET all messages (protected)
router.get('/', authenticateToken, (req, res) => {
    try {
        console.log('📋 Returning', messages.length, 'messages');
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// POST new message (public)
router.post('/', (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required' });
        }

        const newMessage = {
            id: Date.now(),
            name,
            email,
            subject: subject || null,
            message,
            created_at: new Date().toISOString()
        };

        messages.push(newMessage);

        console.log('📧 New message from:', name);
        res.status(201).json({
            id: newMessage.id,
            message: 'Message sent successfully'
        });

    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Failed to save message' });
    }
});

// DELETE message (protected)
router.delete('/:id', authenticateToken, (req, res) => {
    try {
        const messageId = parseInt(req.params.id);

        const messageIndex = messages.findIndex(m => m.id === messageId);
        if (messageIndex === -1) {
            return res.status(404).json({ error: 'Message not found' });
        }

        messages = messages.filter(m => m.id !== messageId);

        console.log('✅ Message deleted, ID:', messageId);
        res.json({ message: 'Message deleted successfully' });

    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ error: 'Failed to delete message' });
    }
});

module.exports = router;