const db = require('../config/db');

// Get all services
const getAllServices = (req, res) => {
    db.query('SELECT * FROM services', (err, results) => {
        if (err) {
            console.error('Error fetching services:', err);
            return res.status(500).json({ error: 'Failed to fetch services' });
        }
        res.json(results);
    });
};

// Get single service by ID
const getServiceById = (req, res) => {
    db.query('SELECT * FROM services WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            console.error('Error fetching service:', err);
            return res.status(500).json({ error: 'Failed to fetch service' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Service not found' });
        }
        res.json(results[0]);
    });
};

// Update service
const updateService = (req, res) => {
    const { name, description, detailed_description, gallery } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    let query = 'UPDATE services SET name=?, description=?, detailed_description=?';
    let params = [name, description, detailed_description];

    if (image) {
        query += ', main_image=?';
        params.push(image);
    }

    if (gallery) {
        query += ', gallery_images=?';
        params.push(gallery);
    }

    query += ' WHERE id=?';
    params.push(req.params.id);

    db.query(query, params, (err) => {
        if (err) {
            console.error('Error updating service:', err);
            return res.status(500).json({ error: 'Failed to update service' });
        }
        res.json({ message: 'Service updated successfully' });
    });
};

// Create service
const createService = (req, res) => {
    const { name, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const query = 'INSERT INTO services (name, description, main_image) VALUES (?, ?, ?)';
    const params = [name, description, image];

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error creating service:', err);
            return res.status(500).json({ error: 'Failed to create service' });
        }
        res.status(201).json({ message: 'Service created successfully', id: results.insertId });
    });
};

// Delete service
const deleteService = (req, res) => {
    db.query('DELETE FROM services WHERE id = ?', [req.params.id], (err) => {
        if (err) {
            console.error('Error deleting service:', err);
            return res.status(500).json({ error: 'Failed to delete service' });
        }
        res.json({ message: 'Service deleted successfully' });
    });
};

module.exports = {
    getAllServices,
    getServiceById,
    updateService,
    createService,
    deleteService
};
