/**
 * In-memory database for the Galactic Energy Exchange
 */

class Database {
    constructor() {
        // Authentication tokens: token -> username
        this.tokens = new Map();

        // Orders: order_id -> { id, seller, energy_amount, price, status }
        this.orders = new Map();

        // Trades: trade_id -> { id, order_id, buyer, timestamp }
        this.trades = new Map();

        // Initialize with some sample data
        this.initializeSampleData();
    }

    initializeSampleData() {
        // Add sample authentication token
        this.tokens.set('sample-token-12345', 'trader1');
        this.tokens.set('buyer-token-67890', 'buyer1');

        // Add sample orders
        this.orders.set('order-001', {
            id: 'order-001',
            seller: 'trader1',
            energy_amount: 1000,
            price: 100,
            status: 'ACTIVE'
        });

        this.orders.set('order-002', {
            id: 'order-002',
            seller: 'trader2',
            energy_amount: 500,
            price: 50,
            status: 'ACTIVE'
        });
    }

    // Authentication methods
    validateToken(token) {
        return this.tokens.has(token);
    }

    getUserByToken(token) {
        return this.tokens.get(token);
    }

    // Order methods
    getOrder(orderId) {
        return this.orders.get(orderId);
    }

    getActiveOrders() {
        const active = [];
        for (const order of this.orders.values()) {
            if (order.status === 'ACTIVE') {
                active.push(order);
            }
        }
        return active;
    }

    updateOrderStatus(orderId, status) {
        const order = this.orders.get(orderId);
        if (order) {
            order.status = status;
            return true;
        }
        return false;
    }

    // Trade methods
    createTrade(orderId, buyer) {
        const tradeId = `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const trade = {
            id: tradeId,
            order_id: orderId,
            buyer: buyer,
            timestamp: Date.now()
        };

        this.trades.set(tradeId, trade);
        return tradeId;
    }

    getTrade(tradeId) {
        return this.trades.get(tradeId);
    }
}

// Export singleton instance
module.exports = new Database();
