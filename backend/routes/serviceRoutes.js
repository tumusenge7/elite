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

// GET all services (public)
router.get('/', async (req, res) => {
    try {
        const page = req.query.page ? Number(req.query.page) : null;
        const limit = req.query.limit ? Number(req.query.limit) : null;

        if (page && limit) {
            const safeLimit = Math.min(Math.max(limit, 1), 100);
            const offset = (Math.max(page, 1) - 1) * safeLimit;
            const [[countRow]] = await db.query('SELECT COUNT(*) AS total FROM services');
            res.setHeader('X-Total-Count', String(countRow.total));

            const [rows] = await db.query(
                'SELECT id, name, description FROM services ORDER BY id DESC LIMIT ? OFFSET ?',
                [safeLimit, offset]
            );
            return res.json(rows);
        }

        const [rows] = await db.query('SELECT id, name, description FROM services ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});

// CREATE service (protected)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Service name is required' });
        }

        const [result] = await db.query(
            'INSERT INTO services (name, description) VALUES (?, ?)',
            [String(name).trim(), description ? String(description) : null]
        );

        const [created] = await db.query(
            'SELECT id, name, description FROM services WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json(created[0]);

    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ error: 'Failed to create service' });
    }
});

// UPDATE service (protected)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { name, description } = req.body;
        const serviceId = Number(req.params.id);

        const [existing] = await db.query(
            'SELECT id FROM services WHERE id = ?',
            [serviceId]
        );
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Service not found' });
        }

        const updates = [];
        const values = [];

        if (name !== undefined) {
            updates.push('name = ?');
            values.push(String(name).trim());
        }
        if (description !== undefined) {
            updates.push('description = ?');
            values.push(description ? String(description) : null);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(serviceId);
        await db.query(`UPDATE services SET ${updates.join(', ')} WHERE id = ?`, values);

        const [updated] = await db.query(
            'SELECT id, name, description FROM services WHERE id = ?',
            [serviceId]
        );
        res.json(updated[0]);

    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ error: 'Failed to update service' });
    }
});

// DELETE service (protected)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const serviceId = Number(req.params.id);
        const [existing] = await db.query(
            'SELECT id FROM services WHERE id = ?',
            [serviceId]
        );
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Service not found' });
        }

        await db.query('DELETE FROM services WHERE id = ?', [serviceId]);
        res.json({ message: 'Service deleted successfully', id: serviceId });

    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ error: 'Failed to delete service' });
    }
});

module.exports = router;