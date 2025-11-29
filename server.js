/**
 * Galactic Energy Exchange Server
 * Main Express application for hackathon missions
 */

const express = require('express');
const { parseGalacticBuf } = require('./middleware/galacticbuf-middleware');
const healthRouter = require('./routes/health');
const tradesRouter = require('./routes/trades');

const app = express();
const PORT = 8080;

// Apply GalacticBuf middleware for binary protocol parsing
app.use(parseGalacticBuf);

// Register routes
app.use('/', healthRouter);
app.use('/', tradesRouter);

// Start server
app.listen(PORT, () => {
    console.log(`Galactic Energy Exchange running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});
