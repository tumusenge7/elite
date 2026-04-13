const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();

const JWT_SECRET =
    process.env.JWT_SECRET || 'elite-construction-jwt-secret-change-in-production';

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token.' });
    }
}

function requireAdmin(req, res, next) {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    return next();
}

router.get('/chat-sessions', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [rows] = await db.query(
            `
            SELECT
              u.id AS user_id,
              u.name,
              u.email,
              (
                SELECT cm.message
                FROM chat_messages cm
                WHERE cm.user_id = u.id
                ORDER BY cm.created_at DESC, cm.id DESC
                LIMIT 1
              ) AS last_message,
              (
                SELECT cm.created_at
                FROM chat_messages cm
                WHERE cm.user_id = u.id
                ORDER BY cm.created_at DESC, cm.id DESC
                LIMIT 1
              ) AS last_message_at,
              (
                SELECT COUNT(*)
                FROM chat_messages cm
                WHERE cm.user_id = u.id
                  AND cm.is_admin_reply = 0
                  AND cm.status <> 'read'
              ) AS unread_count
            FROM users u
            WHERE u.role = 'user'
              AND EXISTS (
                SELECT 1
                FROM chat_messages cm
                WHERE cm.user_id = u.id
              )
            ORDER BY last_message_at DESC
            `
        );

        const sessions = rows.map((r) => ({
            id: r.user_id,
            user_id: r.user_id,
            name: r.name,
            email: r.email,
            is_active: true,
            unread_count: Number(r.unread_count || 0),
            last_message: r.last_message || 'No messages yet',
            last_message_at: r.last_message_at || new Date().toISOString()
        }));

        res.json(sessions);
    } catch (error) {
        console.error('Admin chat sessions error:', error);
        res.status(500).json({ error: 'Failed to fetch chat sessions' });
    }
});

router.get(
    '/chat-messages/:userId',
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const userId = Number(req.params.userId);
            if (!Number.isFinite(userId)) {
                return res.status(400).json({ error: 'Invalid userId' });
            }

            const [messages] = await db.query(
                `
                SELECT id, user_id, message, created_at, is_admin_reply, status
                FROM chat_messages
                WHERE user_id = ?
                ORDER BY created_at ASC, id ASC
                `,
                [userId]
            );

            // Mark user messages as read when admin views them
            await db.query(
                `
                UPDATE chat_messages
                SET status = 'read'
                WHERE user_id = ?
                  AND is_admin_reply = 0
                  AND status <> 'read'
                `,
                [userId]
            );

            res.json({ messages });
        } catch (error) {
            console.error('Admin chat messages error:', error);
            res.status(500).json({ error: 'Failed to fetch chat messages' });
        }
    }
);

router.post('/reply', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { user_id, reply } = req.body;
        const userId = Number(user_id);

        if (!Number.isFinite(userId) || !reply || !String(reply).trim()) {
            return res.status(400).json({ error: 'user_id and reply are required' });
        }

        await db.query(
            'INSERT INTO chat_messages (user_id, message, is_admin_reply, status) VALUES (?, ?, 1, ?)',
            [userId, String(reply).trim(), 'sent']
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Admin reply error:', error);
        res.status(500).json({ error: 'Failed to send reply' });
    }
});

router.post(
    '/end-session/:userId',
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const userId = Number(req.params.userId);
            if (!Number.isFinite(userId)) {
                return res.status(400).json({ error: 'Invalid userId' });
            }

            await db.query(
                'UPDATE chat_conversations SET status = "resolved" WHERE user_id = ? AND status <> "resolved"',
                [userId]
            );

            // User requested: remove chat from admin dashboard.
            // Delete chat history so the session disappears from /chat-sessions.
            await db.query('DELETE FROM chat_messages WHERE user_id = ?', [userId]);
            await db.query('DELETE FROM chat_conversations WHERE user_id = ?', [userId]);

            res.json({ success: true });
        } catch (error) {
            console.error('End session error:', error);
            res.status(500).json({ error: 'Failed to end session' });
        }
    }
);

module.exports = router;

