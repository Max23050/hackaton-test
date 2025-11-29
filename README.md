# Galactic Energy Exchange

Node.js application for the Energy Hack hackathon implementing three missions.

## Missions Implemented

### ✅ Mission 1: Health Check
- **Endpoint:** `GET /health`
- **Response:** `200 OK`

### ✅ Mission 2: GalacticBuf Serialization
Complete binary protocol implementation supporting:
- 64-bit signed integers (big-endian)
- Variable-length strings
- Homogeneous lists
- Nested objects

### ✅ Mission 3: Take Order
- **Endpoint:** `POST /trades`
- **Authentication:** Bearer token required
- **Request:** `{ order_id: "order-id" }` (GalacticBuf encoded)
- **Response:** `{ trade_id: "trade-id" }` (GalacticBuf encoded)

## Running Locally

```bash
# Install dependencies
npm install

# Start the server
npm start

# Test health check
curl http://localhost:8080/health

# Run GalacticBuf tests
npm test

# Run trades endpoint tests
node test-trades.js
```

The server runs on port 8080.

## Sample Authentication Tokens

For testing purposes, these tokens are pre-configured:
- `sample-token-12345` (user: trader1)
- `buyer-token-67890` (user: buyer1)

## Docker

Build and run with Docker:

```bash
# Build for linux/amd64
docker build --platform linux/amd64 -t registry.k8s.energyhack.cz/team-repo/galactic-energy-exchange:latest .

# Run locally
docker run -p 8080:8080 registry.k8s.energyhack.cz/team-repo/galactic-energy-exchange:latest

# Push to registry
docker login registry.k8s.energyhack.cz -u user.name
docker push registry.k8s.energyhack.cz/team-repo/galactic-energy-exchange:latest
```

## Project Structure

```
.
├── server.js                 # Main Express application
├── galacticbuf.js           # Binary protocol implementation
├── db.js                    # In-memory database
├── middleware/
│   ├── auth-middleware.js   # Authentication
│   └── galacticbuf-middleware.js  # Request/response handling
├── routes/
│   ├── health.js            # Health check endpoint
│   └── trades.js            # Trades endpoint
├── test-galacticbuf.js      # Protocol tests
├── test-trades.js           # Endpoint tests
├── Dockerfile               # Docker configuration
└── package.json             # Dependencies
```

## API Examples

### Health Check
```bash
curl http://localhost:8080/health
# Response: 200 OK
```

### Take Order (requires GalacticBuf encoding)
```bash
# Use the test-trades.js script for a working example
node test-trades.js
```

## Resource Limits
- CPU: 2 cores
- RAM: 2 GB
- Storage: 5 GB
