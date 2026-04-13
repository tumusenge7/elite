const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'elite-construction-jwt-secret-change-in-production';

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

const requireAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    return next();
};

// GET all contact messages (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const page = req.query.page ? Number(req.query.page) : null;
        const limit = req.query.limit ? Number(req.query.limit) : null;

        if (page && limit) {
            const safeLimit = Math.min(Math.max(limit, 1), 100);
            const offset = (Math.max(page, 1) - 1) * safeLimit;
            const [[countRow]] = await db.query(
                'SELECT COUNT(*) AS total FROM contact_messages'
            );
            res.setHeader('X-Total-Count', String(countRow.total));

            const [rows] = await db.query(
                `
                SELECT id, name, email, phone, subject, message, created_at
                FROM contact_messages
                ORDER BY created_at DESC, id DESC
                LIMIT ? OFFSET ?
                `,
                [safeLimit, offset]
            );
            return res.json(rows);
        }

        const [rows] = await db.query(
            'SELECT id, name, email, phone, subject, message, created_at FROM contact_messages ORDER BY created_at DESC, id DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// POST new message (public)
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required' });
        }

        const [result] = await db.query(
            'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
            [
                String(name).trim(),
                String(email).trim(),
                phone ? String(phone).trim() : null,
                subject ? String(subject).trim() : null,
                String(message)
            ]
        );

        res.status(201).json({ id: result.insertId, message: 'Message sent successfully' });

    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Failed to save message' });
    }
});

// DELETE contact message (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const messageId = Number(req.params.id);
        const [existing] = await db.query(
            'SELECT id FROM contact_messages WHERE id = ?',
            [messageId]
        );
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Message not found' });
        }

        await db.query('DELETE FROM contact_messages WHERE id = ?', [messageId]);
        res.json({ message: 'Message deleted successfully', id: messageId });

    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ error: 'Failed to delete message' });
    }
});

module.exports = router;