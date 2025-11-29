/**
 * GalacticBuf Protocol Test
 * Tests encoding and decoding of all data types
 */

const GalacticBuf = require('./galacticbuf');

console.log('Testing GalacticBuf Protocol...\n');

// Test 1: Simple integer and string
console.log('Test 1: Integer and String');
const test1 = {
    user_id: 1001,
    name: 'Alice'
};
const encoded1 = GalacticBuf.encode(test1);
const decoded1 = GalacticBuf.decode(encoded1);
console.log('Original:', test1);
console.log('Decoded:', decoded1);
console.log('Match:', JSON.stringify(test1) === JSON.stringify(decoded1) ? '✓' : '✗');
console.log();

// Test 2: Integer, String, and List of integers
console.log('Test 2: Integer, String, and List');
const test2 = {
    user_id: 1001,
    name: 'Alice',
    scores: [100, 200, 300]
};
const encoded2 = GalacticBuf.encode(test2);
const decoded2 = GalacticBuf.decode(encoded2);
console.log('Original:', test2);
console.log('Decoded:', decoded2);
console.log('Match:', JSON.stringify(test2) === JSON.stringify(decoded2) ? '✓' : '✗');
console.log('Encoded length:', encoded2.length, 'bytes (expected: 69)');
console.log();

// Test 3: List of objects
console.log('Test 3: List of Objects');
const test3 = {
    timestamp: 1698765432,
    trades: [
        { id: 1, price: 100 },
        { id: 2, price: 200 }
    ]
};
const encoded3 = GalacticBuf.encode(test3);
const decoded3 = GalacticBuf.decode(encoded3);
console.log('Original:', JSON.stringify(test3, null, 2));
console.log('Decoded:', JSON.stringify(decoded3, null, 2));
console.log('Match:', JSON.stringify(test3) === JSON.stringify(decoded3) ? '✓' : '✗');
console.log('Encoded length:', encoded3.length, 'bytes (expected: 90)');
console.log();

// Test 4: Simple trade response
console.log('Test 4: Trade Response (order_id)');
const test4 = {
    order_id: 'order-001'
};
const encoded4 = GalacticBuf.encode(test4);
const decoded4 = GalacticBuf.decode(encoded4);
console.log('Original:', test4);
console.log('Decoded:', decoded4);
console.log('Match:', JSON.stringify(test4) === JSON.stringify(decoded4) ? '✓' : '✗');
console.log();

// Test 5: Trade ID response
console.log('Test 5: Trade ID Response');
const test5 = {
    trade_id: 'trade-123456789'
};
const encoded5 = GalacticBuf.encode(test5);
const decoded5 = GalacticBuf.decode(encoded5);
console.log('Original:', test5);
console.log('Decoded:', decoded5);
console.log('Match:', JSON.stringify(test5) === JSON.stringify(decoded5) ? '✓' : '✗');
console.log();

// Test 6: Nested object
console.log('Test 6: Nested Object');
const test6 = {
    order: {
        id: 'order-001',
        price: 100
    }
};
const encoded6 = GalacticBuf.encode(test6);
const decoded6 = GalacticBuf.decode(encoded6);
console.log('Original:', JSON.stringify(test6, null, 2));
console.log('Decoded:', JSON.stringify(decoded6, null, 2));
console.log('Match:', JSON.stringify(test6) === JSON.stringify(decoded6) ? '✓' : '✗');
console.log();

console.log('All tests completed!');
