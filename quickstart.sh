#!/bin/bash

echo "🚀 Galactic Energy Exchange - Quick Start"
echo "=========================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "✅ Running tests..."
echo ""
echo "--- GalacticBuf Protocol Tests ---"
node test-galacticbuf.js
echo ""

echo "--- Starting server ---"
node server.js &
SERVER_PID=$!

# Wait for server to start
sleep 2

echo ""
echo "--- Health Check Test ---"
curl -i http://localhost:8080/health
echo ""
echo ""

echo "--- Trades Endpoint Tests ---"
node test-trades.js

# Stop server
echo ""
echo "🛑 Stopping server..."
kill $SERVER_PID

echo ""
echo "✅ All tests completed successfully!"
echo ""
echo "To run the server:"
echo "  npm start"
echo ""
echo "To build Docker image:"
echo "  docker build --platform linux/amd64 -t registry.k8s.energyhack.cz/team-repo/galactic-energy-exchange:latest ."
