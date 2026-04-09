const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Simple in-memory storage for testing
const users = [];
const messages = [];
const JWT_SECRET = 'test-secret-key';

// ==================== ADD DEFAULT ADMIN USER ====================
// Create default admin user on startup
async function createDefaultAdmin() {
    const existingAdmin = users.find(u => u.email === 'admin@elite.com');
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const adminUser = {
            id: users.length + 1,
            name: 'Admin',
            email: 'admin@elite.com',
            password: hashedPassword,
            role: 'admin'
        };
        users.push(adminUser);
        console.log('✅ Default admin user created');
        console.log('   Email: admin@elite.com');
        console.log('   Password: admin123');
    }
}

// ==================== MIDDLEWARE ====================
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Admin middleware - FIXED: This was missing!
const authenticateAdmin = (req, res, next) => {
    authenticateToken(req, res, () => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        next();
    });
};

// ==================== TEST ENDPOINTS ====================
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running', timestamp: new Date().toISOString() });
});

// ==================== USER AUTHENTICATION ====================
// Register
app.post('/api/users/register', async (req, res) => {
    console.log('📝 Register request:', req.body);
    const { name, email, password } = req.body;

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
        id: users.length + 1,
        name,
        email,
        password: hashedPassword,
        role: 'user'
    };

    users.push(user);

    const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
    );

    console.log('✅ User registered:', email);
    res.json({
        success: true,
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
});

// Login
app.post('/api/users/login', async (req, res) => {
    console.log('🔐 Login request:', req.body.email);
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
        console.log('❌ User not found:', email);
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        console.log('❌ Invalid password for:', email);
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
    );

    console.log('✅ Login successful:', email);
    res.json({
        success: true,
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
});

// Check email
app.post('/api/users/check-email', (req, res) => {
    const { email } = req.body;
    const exists = users.some(u => u.email === email);
    res.json({ exists });
});

// ==================== CHAT ENDPOINTS ====================
// Get chat history
app.get('/api/users/chat-history/:userId', authenticateToken, (req, res) => {
    const userId = parseInt(req.params.userId);
    const userMessages = messages.filter(m => m.user_id === userId);
    console.log(`📜 Chat history for user ${userId}: ${userMessages.length} messages`);
    res.json({ messages: userMessages });
});

// Send message
app.post('/api/users/send-message', authenticateToken, (req, res) => {
    const { user_id, message } = req.body;
    console.log(`💬 Send message from user ${user_id}: ${message}`);

    if (req.user.userId !== user_id) {
        return res.status(403).json({ error: 'Access denied' });
    }

    const newMessage = {
        id: messages.length + 1,
        user_id,
        message,
        created_at: new Date().toISOString(),
        is_admin_reply: false
    };

    messages.push(newMessage);
    console.log(`✅ Message saved. Total messages: ${messages.length}`);

    res.json({
        success: true,
        message: newMessage
    });
});

// ==================== ADMIN ENDPOINTS ====================
// Get all chat sessions (admin only)
app.get('/api/admin/chat-sessions', authenticateAdmin, (req, res) => {
    console.log('📊 Admin fetching chat sessions');

    const sessions = users.filter(u => u.role === 'user').map(u => {
        const userMessages = messages.filter(m => m.user_id === u.id);
        const lastMsg = userMessages[userMessages.length - 1];

        return {
            id: u.id,
            user_id: u.id,
            name: u.name,
            email: u.email,
            is_active: true,
            unread_count: userMessages.filter(m => !m.is_admin_reply && m.status !== 'read').length,
            last_message: lastMsg?.message || 'No messages yet',
            last_message_at: lastMsg?.created_at || new Date().toISOString()
        };
    });

    console.log(`📊 Found ${sessions.length} chat sessions`);
    res.json(sessions);
});

// Get messages for specific user (admin only)
app.get('/api/admin/chat-messages/:userId', authenticateAdmin, (req, res) => {
    const userId = parseInt(req.params.userId);
    console.log(`📜 Admin fetching messages for user ${userId}`);

    const userMessages = messages.filter(m => m.user_id === userId);
    console.log(`📜 Found ${userMessages.length} messages`);

    res.json({ messages: userMessages });
});

// Admin reply
app.post('/api/admin/reply', authenticateAdmin, (req, res) => {
    const { user_id, reply } = req.body;
    console.log(`📝 Admin replying to user ${user_id}: ${reply}`);

    const newMessage = {
        id: messages.length + 1,
        user_id,
        message: reply,
        created_at: new Date().toISOString(),
        is_admin_reply: true
    };

    messages.push(newMessage);
    console.log(`✅ Admin reply saved. Total messages: ${messages.length}`);

    res.json({ success: true });
});

// End session (admin only)
app.post('/api/admin/end-session/:userId', authenticateAdmin, (req, res) => {
    const userId = parseInt(req.params.userId);
    console.log(`🔚 Admin ending session for user ${userId}`);
    res.json({ success: true });
});

// ==================== DEBUG ENDPOINTS ====================
// Debug - get all messages (admin only)
app.get('/api/debug/messages', authenticateAdmin, (req, res) => {
    console.log('🐛 Debug: Fetching all messages');
    res.json({
        count: messages.length,
        messages: messages,
        users: users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role }))
    });
});

// Debug - get all users (admin only)
app.get('/api/debug/users', authenticateAdmin, (req, res) => {
    console.log('🐛 Debug: Fetching all users');
    res.json({
        count: users.length,
        users: users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role }))
    });
});

// ==================== MOCK ENDPOINTS FOR ADMIN DASHBOARD ====================
app.get('/api/projects', (req, res) => {
    res.json([
        {
            id: 1,
            title: "Luxury Villa",
            category: "Residential",
            location: "Beverly Hills",
            image: "",
            description: "Modern luxury villa with pool",
            year: 2024
        }
    ]);
});

app.get('/api/services', (req, res) => {
    res.json([
        {
            id: 1,
            name: "Construction",
            description: "Full construction services"
        },
        {
            id: 2,
            name: "Renovation",
            description: "Home renovation and remodeling"
        }
    ]);
});

app.get('/api/messages', authenticateAdmin, (req, res) => {
    res.json([]);
});

app.post('/api/projects', authenticateAdmin, (req, res) => {
    res.json({ success: true, id: Date.now() });
});

app.put('/api/projects/:id', authenticateAdmin, (req, res) => {
    res.json({ success: true });
});

app.delete('/api/projects/:id', authenticateAdmin, (req, res) => {
    res.json({ success: true });
});

app.post('/api/services', authenticateAdmin, (req, res) => {
    res.json({ success: true, id: Date.now() });
});

app.put('/api/services/:id', authenticateAdmin, (req, res) => {
    res.json({ success: true });
});

app.delete('/api/services/:id', authenticateAdmin, (req, res) => {
    res.json({ success: true });
});

app.delete('/api/messages/:id', authenticateAdmin, (req, res) => {
    res.json({ success: true });
});

// ==================== START SERVER ====================
async function startServer() {
    await createDefaultAdmin();

    app.listen(PORT, () => {
        console.log('\n=================================');
        console.log('🚀 CHAT SERVER IS RUNNING');
        console.log('=================================');
        console.log(`📡 URL: http://localhost:${PORT}`);
        console.log(`✅ Health: http://localhost:${PORT}/api/health`);
        console.log(`🔐 Login: POST http://localhost:${PORT}/api/users/login`);
        console.log('\n📝 Admin Credentials:');
        console.log('   Email: admin@elite.com');
        console.log('   Password: admin123');
        console.log('\n📝 Test User (create one via chat widget):');
        console.log('   Register through the chat widget');
        console.log('\n💬 Test endpoints:');
        console.log(`   GET  http://localhost:${PORT}/api/debug/users (admin only)`);
        console.log(`   GET  http://localhost:${PORT}/api/debug/messages (admin only)`);
        console.log('=================================\n');
    });
}

startServer();