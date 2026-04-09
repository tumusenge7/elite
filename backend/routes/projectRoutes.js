const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'elite-construction-jwt-secret-change-in-production';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token.' });
    }
};

// GET all projects
router.get('/', async (req, res) => {
    try {
        console.log('📋 Fetching all projects...');
        const [rows] = await db.query(
            'SELECT id, title, category, location, image, description, year FROM projects ORDER BY year DESC, id DESC'
        );
        console.log(`✅ Found ${rows.length} projects`);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects', details: error.message });
    }
});

// GET single project
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, title, category, location, image, description, year FROM projects WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});

// CREATE project
router.post('/', authenticateToken, async (req, res) => {
    try {
        console.log('📝 Received POST data:', req.body);

        const { title, category, location, image, description, year } = req.body;

        // Validation
        if (!title || !title.trim()) {
            return res.status(400).json({ error: 'Title is required' });
        }
        if (!category || !category.trim()) {
            return res.status(400).json({ error: 'Category is required' });
        }

        const projectYear = year ? parseInt(year) : new Date().getFullYear();

        const [result] = await db.query(
            `INSERT INTO projects (title, category, location, image, description, year) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [title.trim(), category.trim(), location || null, image || null, description || null, projectYear]
        );

        const [newProject] = await db.query(
            'SELECT id, title, category, location, image, description, year FROM projects WHERE id = ?',
            [result.insertId]
        );

        console.log('✅ Project created successfully:', newProject[0]);
        res.status(201).json(newProject[0]);

    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project', details: error.message });
    }
});

// UPDATE project
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const projectId = req.params.id;
        console.log(`✏️ Updating project ID: ${projectId}`);
        console.log('Update data:', req.body);

        const { title, category, location, image, description, year } = req.body;

        // Check if project exists
        const [existing] = await db.query('SELECT id FROM projects WHERE id = ?', [projectId]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Build update query
        const updates = [];
        const values = [];

        if (title !== undefined && title !== null) {
            updates.push('title = ?');
            values.push(title.trim());
        }
        if (category !== undefined && category !== null) {
            updates.push('category = ?');
            values.push(category.trim());
        }
        if (location !== undefined) {
            updates.push('location = ?');
            values.push(location || null);
        }
        if (image !== undefined) {
            updates.push('image = ?');
            values.push(image || null);
        }
        if (description !== undefined) {
            updates.push('description = ?');
            values.push(description || null);
        }
        if (year !== undefined && year !== null) {
            updates.push('year = ?');
            values.push(parseInt(year));
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(projectId);

        await db.query(
            `UPDATE projects SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        const [updated] = await db.query(
            'SELECT id, title, category, location, image, description, year FROM projects WHERE id = ?',
            [projectId]
        );

        console.log('✅ Project updated successfully:', updated[0]);
        res.json(updated[0]);

    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Failed to update project', details: error.message });
    }
});

// DELETE project
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const projectId = req.params.id;
        console.log(`🗑️ Deleting project ID: ${projectId}`);

        // Check if project exists
        const [existing] = await db.query('SELECT id, title FROM projects WHERE id = ?', [projectId]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        await db.query('DELETE FROM projects WHERE id = ?', [projectId]);

        console.log('✅ Project deleted:', existing[0].title);
        res.json({ message: 'Project deleted successfully', id: parseInt(projectId) });

    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Failed to delete project', details: error.message });
    }
});

module.exports = router;