const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            console.error('Login query error:', err);
            return res.status(500).json({ error: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = results[0];
        let isMatch = false;
        try {
            isMatch = await bcrypt.compare(password, user.password);
        } catch {
            isMatch = password === user.password;
        }

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: { id: user.id, username: user.username }
        });
    });
};

const register = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Username already exists' });
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    } catch (err) {
        res.status(500).json({ error: 'Encryption error' });
    }
};

module.exports = { login, register };
