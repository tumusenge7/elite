const db = require('../config/db');

// Get all projects
const getAllProjects = (req, res) => {
    db.query('SELECT * FROM projects ORDER BY id DESC', (err, results) => {
        if (err) {
            console.error('Error fetching projects:', err);
            return res.status(500).json({ error: 'Failed to fetch projects' });
        }
        res.json(results);
    });
};

const createProject = (req, res) => {
    const { title, category, location, description, year } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const query = 'INSERT INTO projects (title, category, location, description, year, image) VALUES (?, ?, ?, ?, ?, ?)';
    const params = [title, category, location, description, year, image];

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error creating project:', err);
            return res.status(500).json({ error: 'Failed to create project' });
        }
        res.status(201).json({ message: 'Project created successfully', id: results.insertId });
    });
};

const updateProject = (req, res) => {
    const { title, category, location, description, year } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    let query = 'UPDATE projects SET title=?, category=?, location=?, description=?, year=?';
    let params = [title, category, location, description, year];

    if (image) {
        query += ', image=?';
        params.push(image);
    }

    query += ' WHERE id=?';
    params.push(req.params.id);

    db.query(query, params, (err) => {
        if (err) {
            console.error('Error updating project:', err);
            return res.status(500).json({ error: 'Failed to update project' });
        }
        res.json({ message: 'Project updated successfully' });
    });
};

// Delete project
const deleteProject = (req, res) => {
    db.query('DELETE FROM projects WHERE id = ?', [req.params.id], (err) => {
        if (err) {
            console.error('Error deleting project:', err);
            return res.status(500).json({ error: 'Failed to delete project' });
        }
        res.json({ message: 'Project deleted successfully' });
    });
};

module.exports = {
    getAllProjects,
    createProject,
    updateProject,
    deleteProject
};
