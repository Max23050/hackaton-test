/**
 * GalacticBuf Middleware
 * Handles parsing and encoding of GalacticBuf binary protocol
 */

const GalacticBuf = require('../galacticbuf');

/**
 * Middleware to parse GalacticBuf binary request bodies
 */
function parseGalacticBuf(req, res, next) {
    // Only parse if Content-Type indicates binary data
    const contentType = req.get('Content-Type');

    if (req.method === 'POST' || req.method === 'PUT') {
        const chunks = [];

        req.on('data', chunk => {
            chunks.push(chunk);
        });

        req.on('end', () => {
            try {
                if (chunks.length > 0) {
                    const buffer = Buffer.concat(chunks);
                    req.body = GalacticBuf.decode(buffer);
                } else {
                    req.body = {};
                }
                next();
            } catch (error) {
                res.status(400).send('Invalid GalacticBuf format');
            }
        });

        req.on('error', (error) => {
            res.status(400).send('Error reading request body');
        });
    } else {
        req.body = {};
        next();
    }
}

/**
 * Helper to send GalacticBuf encoded responses
 */
function sendGalacticBuf(res, data) {
    const buffer = GalacticBuf.encode(data);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(buffer);
}

module.exports = {
    parseGalacticBuf,
    sendGalacticBuf
};
