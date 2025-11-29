/**
 * Health Check Route
 * Mission 1: Simple health check endpoint
 */

const express = require('express');
const router = express.Router();

// GET /health - Returns 200 OK
router.get('/health', (req, res) => {
    res.status(200).send('OK');
});

module.exports = router;
