const db = require('../config/db');

// Get all messages
const getAllMessages = (req, res) => {
    db.query('SELECT * FROM messages ORDER BY id DESC', (err, results) => {
        if (err) {
            console.error('Error fetching messages:', err);
            return res.status(500).json({ error: 'Failed to fetch messages' });
        }
        res.json(results);
    });
};

// Create new message (Public)
const createMessage = (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    const query = 'INSERT INTO messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)';
    const params = [name, email, phone, subject, message];

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error creating message:', err);
            return res.status(500).json({ error: 'Failed to send message' });
        }
        res.status(201).json({ message: 'Message sent successfully', id: results.insertId });
    });
};

// Delete message
const deleteMessage = (req, res) => {
    db.query('DELETE FROM messages WHERE id = ?', [req.params.id], (err) => {
        if (err) {
            console.error('Error deleting message:', err);
            return res.status(500).json({ error: 'Failed to delete message' });
        }
        res.json({ message: 'Message deleted successfully' });
    });
};

module.exports = {
    getAllMessages,
    createMessage,
    deleteMessage
};
