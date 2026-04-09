const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let pool = null;

async function getConnection() {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '3306'),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 5
        });
    }
    return pool;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const url = req.url;
    console.log(`${req.method} ${url}`);

    try {
        // Health check
        if (url === '/api/health' && req.method === 'GET') {
            return res.json({ status: 'ok', message: 'Server running' });
        }

        // Login
        if (url === '/api/users/login' && req.method === 'POST') {
            const { email, password } = req.body;
            const connection = await getConnection();

            const [users] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
            if (users.length === 0) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const user = users[0];
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET);
            return res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
        }

        // Register
        if (url === '/api/users/register' && req.method === 'POST') {
            const { name, email, password } = req.body;
            const connection = await getConnection();

            const [existing] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);
            if (existing.length > 0) {
                return res.status(400).json({ error: 'Email already registered' });
            }

            const hashed = await bcrypt.hash(password, 10);
            const [result] = await connection.execute('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashed, 'user']);
            const token = jwt.sign({ userId: result.insertId, email, role: 'user' }, JWT_SECRET);

            return res.json({ success: true, token, user: { id: result.insertId, name, email, role: 'user' } });
        }

        // Check email
        if (url === '/api/users/check-email' && req.method === 'POST') {
            const { email } = req.body;
            const connection = await getConnection();
            const [users] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);
            return res.json({ exists: users.length > 0 });
        }

        // Get projects
        if (url === '/api/projects' && req.method === 'GET') {
            const connection = await getConnection();
            const [projects] = await connection.execute('SELECT * FROM projects ORDER BY created_at DESC');
            return res.json(projects);
        }

        // Get services
        if (url === '/api/services' && req.method === 'GET') {
            const connection = await getConnection();
            const [services] = await connection.execute('SELECT * FROM services');
            return res.json(services);
        }

        // Protected routes - require auth
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }

        // Send message
        if (url === '/api/users/send-message' && req.method === 'POST') {
            const { user_id, message } = req.body;
            const connection = await getConnection();
            await connection.execute('INSERT INTO chat_messages (user_id, message) VALUES (?, ?)', [user_id, message]);
            return res.json({ success: true, message: { id: Date.now(), message, created_at: new Date() } });
        }

        // Get chat history
        if (url.match(/^\/api\/users\/chat-history\/\d+$/) && req.method === 'GET') {
            const userId = parseInt(url.split('/').pop());
            const connection = await getConnection();
            const [messages] = await connection.execute('SELECT * FROM chat_messages WHERE user_id = ? ORDER BY created_at ASC', [userId]);
            return res.json({ messages });
        }

        // Admin chat sessions
        if (url === '/api/admin/chat-sessions' && req.method === 'GET') {
            const connection = await getConnection();
            const [sessions] = await connection.execute(`
        SELECT cs.*, u.name, u.email 
        FROM chat_sessions cs 
        JOIN users u ON cs.user_id = u.id 
        WHERE cs.is_active = true
      `);
            return res.json(sessions);
        }

        return res.status(404).json({ error: 'Endpoint not found' });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: error.message });
    }
}