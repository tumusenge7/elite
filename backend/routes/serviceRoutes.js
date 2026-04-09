const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'elite-construction-jwt-secret-change-in-production';

// In-memory storage
let services = [
    {
        id: 1,
        name: 'Architectural Design',
        description: 'Complete architectural design services from concept to completion'
    },
    {
        id: 2,
        name: 'Construction Management',
        description: 'Professional construction management and project oversight'
    },
    {
        id: 3,
        name: 'Interior Design',
        description: 'Custom interior design solutions for residential and commercial spaces'
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

// GET all services (public)
router.get('/', (req, res) => {
    try {
        console.log('📋 Returning', services.length, 'services');
        res.json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});

// CREATE service (protected)
router.post('/', authenticateToken, (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Service name is required' });
        }

        const newService = {
            id: Date.now(),
            name,
            description: description || ''
        };

        services.push(newService);

        console.log('✅ Service created:', name);
        res.status(201).json(newService);

    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ error: 'Failed to create service' });
    }
});

// UPDATE service (protected)
router.put('/:id', authenticateToken, (req, res) => {
    try {
        const { name, description } = req.body;
        const serviceId = parseInt(req.params.id);

        const serviceIndex = services.findIndex(s => s.id === serviceId);
        if (serviceIndex === -1) {
            return res.status(404).json({ error: 'Service not found' });
        }

        services[serviceIndex] = {
            ...services[serviceIndex],
            name: name || services[serviceIndex].name,
            description: description !== undefined ? description : services[serviceIndex].description
        };

        console.log('✅ Service updated:', name);
        res.json(services[serviceIndex]);

    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ error: 'Failed to update service' });
    }
});

// DELETE service (protected)
router.delete('/:id', authenticateToken, (req, res) => {
    try {
        const serviceId = parseInt(req.params.id);

        const serviceIndex = services.findIndex(s => s.id === serviceId);
        if (serviceIndex === -1) {
            return res.status(404).json({ error: 'Service not found' });
        }

        const deletedService = services[serviceIndex];
        services = services.filter(s => s.id !== serviceId);

        console.log('✅ Service deleted:', deletedService.name);
        res.json({ message: 'Service deleted successfully' });

    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ error: 'Failed to delete service' });
    }
});

module.exports = router;