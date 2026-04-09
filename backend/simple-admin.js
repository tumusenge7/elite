const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const JWT_SECRET = 'your-super-secret-key';

// Simple admin credentials (hardcoded for testing)
const ADMIN_CREDENTIALS = {
    email: 'admin@elite.com',
    password: 'admin123'
};

// Login endpoint
app.post('/api/users/login', (req, res) => {
    const { email, password } = req.body;

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        const token = jwt.sign(
            { userId: 1, email: email, role: 'admin' },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token: token,
            user: {
                id: 1,
                name: 'Admin',
                email: email,
                role: 'admin'
            }
        });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Other required endpoints (mock)
app.get('/api/projects', (req, res) => res.json([]));
app.get('/api/services', (req, res) => res.json([]));
app.get('/api/messages', (req, res) => res.json([]));

app.listen(PORT, () => {
    console.log(`\n✅ Simple admin server running on http://localhost:${PORT}`);
    console.log(`📡 Admin login: POST http://localhost:${PORT}/api/users/login`);
    console.log(`🔑 Credentials: admin@elite.com / admin123\n`);
});