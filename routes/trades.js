/**
 * Trades Route
 * Mission 3: Take order endpoint
 */

const express = require('express');
const router = express.Router();
const db = require('../db');
const requireAuth = require('../middleware/auth-middleware');
const { sendGalacticBuf } = require('../middleware/galacticbuf-middleware');

// POST /trades - Take an order and create a trade
router.post('/trades', requireAuth, (req, res) => {
    // Validate order_id is present
    if (!req.body.order_id) {
        return res.status(400).send('Bad Request: order_id is required');
    }

    const orderId = req.body.order_id;

    // Check if order exists
    const order = db.getOrder(orderId);
    if (!order) {
        return res.status(404).send('Not Found: Order does not exist');
    }

    // Check if order is active
    if (order.status !== 'ACTIVE') {
        return res.status(404).send('Not Found: Order is not active');
    }

    // Create the trade
    const tradeId = db.createTrade(orderId, req.user);

    // Update order status to FILLED
    db.updateOrderStatus(orderId, 'FILLED');

    // Return trade_id in GalacticBuf format
    sendGalacticBuf(res, { trade_id: tradeId });
});

module.exports = router;
