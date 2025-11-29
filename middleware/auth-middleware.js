/**
 * Authentication Middleware
 * Validates Bearer tokens from Authorization header
 */

const db = require('../db');

/**
 * Middleware to validate authentication token
 */
function requireAuth(req, res, next) {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        return res.status(401).send('Unauthorized');
    }

    // Extract token from "Bearer <token>" format
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).send('Unauthorized');
    }

    const token = parts[1];

    // Validate token
    if (!db.validateToken(token)) {
        return res.status(401).send('Unauthorized');
    }

    // Attach user to request
    req.user = db.getUserByToken(token);

    next();
}

module.exports = requireAuth;
