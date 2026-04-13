require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const crypto = require('crypto');

const db = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const messageRoutes = require('./routes/messageRoutes');
const adminRoutes = require('./routes/adminRoutes');
const youtubeRoutes = require('./routes/youtubeRoutes');

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use((req, res, next) => {
    req.id = crypto.randomUUID();
    res.setHeader('X-Request-Id', req.id);
    next();
});
app.use(express.json({ limit: '1mb' }));

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 50,
    standardHeaders: true,
    legacyHeaders: false
});

const publicMessageLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/ready', async (req, res) => {
    try {
        await db.ping();
        res.json({ status: 'ok', db: 'ok' });
    } catch (err) {
        res.status(503).json({ status: 'error', db: 'down', error: err.message });
    }
});

app.use('/api/projects', projectRoutes);
app.use('/api/services', serviceRoutes);
// Apply stronger limits to auth + public contact form
app.use('/api/users', authLimiter, userRoutes);
app.use('/api/messages', (req, res, next) => {
    if (req.method === 'POST') {
        return publicMessageLimiter(req, res, next);
    }
    return next();
}, messageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/youtube', youtubeRoutes);

// Basic JSON error handler (expanded in advanced_features)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error('Unhandled error:', { requestId: req.id, err });
    res.status(500).json({ error: 'Server error', requestId: req.id });
});

app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});