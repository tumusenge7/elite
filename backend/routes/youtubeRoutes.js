const express = require('express');
const router = express.Router();

// GET youtube videos (placeholder)
router.get('/videos', (req, res) => {
    res.json({
        videos: [],
        message: 'YouTube integration coming soon'
    });
});

module.exports = router;