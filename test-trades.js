/**
 * Test the /trades endpoint with GalacticBuf protocol
 */

const http = require('http');
const GalacticBuf = require('./galacticbuf');

function testTradesEndpoint() {
    console.log('Testing POST /trades endpoint...\n');

    // Test 1: Without authentication (should return 401)
    console.log('Test 1: No authentication token');
    const request1Data = GalacticBuf.encode({ order_id: 'order-001' });

    const options1 = {
        hostname: 'localhost',
        port: 8080,
        path: '/trades',
        method: 'POST',
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Length': request1Data.length
        }
    };

    const req1 = http.request(options1, (res) => {
        console.log(`Status: ${res.statusCode} (expected: 401)`);
        console.log(`Result: ${res.statusCode === 401 ? '✓' : '✗'}\n`);

        // Test 2: With valid authentication (should return 200 and trade_id)
        console.log('Test 2: Valid authentication token');
        const request2Data = GalacticBuf.encode({ order_id: 'order-001' });

        const options2 = {
            hostname: 'localhost',
            port: 8080,
            path: '/trades',
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Length': request2Data.length,
                'Authorization': 'Bearer buyer-token-67890'
            }
        };

        const req2 = http.request(options2, (res2) => {
            console.log(`Status: ${res2.statusCode} (expected: 200)`);

            const chunks = [];
            res2.on('data', (chunk) => chunks.push(chunk));
            res2.on('end', () => {
                const responseBuffer = Buffer.concat(chunks);
                const decoded = GalacticBuf.decode(responseBuffer);
                console.log('Response:', decoded);
                console.log(`Result: ${res2.statusCode === 200 && decoded.trade_id ? '✓' : '✗'}\n`);

                // Test 3: Try to take the same order again (should return 404 - not active)
                console.log('Test 3: Take already filled order');
                const request3Data = GalacticBuf.encode({ order_id: 'order-001' });

                const options3 = {
                    hostname: 'localhost',
                    port: 8080,
                    path: '/trades',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/octet-stream',
                        'Content-Length': request3Data.length,
                        'Authorization': 'Bearer buyer-token-67890'
                    }
                };

                const req3 = http.request(options3, (res3) => {
                    console.log(`Status: ${res3.statusCode} (expected: 404)`);
                    console.log(`Result: ${res3.statusCode === 404 ? '✓' : '✗'}\n`);

                    // Test 4: Missing order_id (should return 400)
                    console.log('Test 4: Missing order_id');
                    const request4Data = GalacticBuf.encode({ wrong_field: 'value' });

                    const options4 = {
                        hostname: 'localhost',
                        port: 8080,
                        path: '/trades',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/octet-stream',
                            'Content-Length': request4Data.length,
                            'Authorization': 'Bearer buyer-token-67890'
                        }
                    };

                    const req4 = http.request(options4, (res4) => {
                        console.log(`Status: ${res4.statusCode} (expected: 400)`);
                        console.log(`Result: ${res4.statusCode === 400 ? '✓' : '✗'}\n`);

                        console.log('All /trades endpoint tests completed!');
                        process.exit(0);
                    });

                    req4.on('error', (error) => console.error('Error:', error));
                    req4.write(request4Data);
                    req4.end();
                });

                req3.on('error', (error) => console.error('Error:', error));
                req3.write(request3Data);
                req3.end();
            });
        });

        req2.on('error', (error) => console.error('Error:', error));
        req2.write(request2Data);
        req2.end();
    });

    req1.on('error', (error) => console.error('Error:', error));
    req1.write(request1Data);
    req1.end();
}

// Wait a moment for server to be ready
setTimeout(testTradesEndpoint, 500);
