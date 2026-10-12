const ORDER_API_BASE = import.meta.env.VITE_ORDER_API_URL || 'https://order.atmin.io.vn';
const PAYMENT_API_BASE = import.meta.env.VITE_PAYMENT_API_URL || 'https://payment.atmin.io.vn';

export const api = {
  // Orders
  getOrders: async () => {
    const res = await fetch(`${ORDER_API_BASE}/api/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  getOrderById: async (id) => {
    const res = await fetch(`${ORDER_API_BASE}/api/orders/${id}`);
    if (!res.ok) throw new Error('Order not found');
    return res.json();
  },

  createOrder: async (orderData) => {
    const res = await fetch(`${ORDER_API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) throw new Error('Failed to create order');
    return res.json();
  },

  createBatchOrders: async (count = 5, failurePercent = 0) => {
    const res = await fetch(`${ORDER_API_BASE}/api/orders/batch?count=${count}&failurePercent=${failurePercent}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to create batch orders');
    return res.json();
  },

  clearOrders: async () => {
    const res = await fetch(`${ORDER_API_BASE}/api/orders`, { method: 'DELETE' });
    return res.json();
  },

  getOrderMetrics: async () => {
    const res = await fetch(`${ORDER_API_BASE}/api/orders/metrics`);
    if (!res.ok) throw new Error('Failed to fetch order metrics');
    return res.json();
  },

  testDirectPaymentWithCircuitBreaker: async (orderId) => {
    const res = await fetch(`${ORDER_API_BASE}/api/orders/${orderId}/test-sync-payment`, {
      method: 'POST'
    });
    return res.json();
  },

  // Dead Letter Topic (DLT)
  getDltMessages: async () => {
    const res = await fetch(`${ORDER_API_BASE}/api/orders/dlt`);
    if (!res.ok) throw new Error('Failed to fetch DLT messages');
    return res.json();
  },

  replayDltOrder: async (orderId) => {
    const res = await fetch(`${ORDER_API_BASE}/api/orders/dlt/replay/${orderId}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to replay order');
    return res.json();
  },

  // Payment & Transactions
  getTransactions: async () => {
    const res = await fetch(`${PAYMENT_API_BASE}/api/payment/transactions`);
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return res.json();
  },

  getPaymentMetrics: async () => {
    const res = await fetch(`${PAYMENT_API_BASE}/api/payment/metrics`);
    if (!res.ok) throw new Error('Failed to fetch payment metrics');
    return res.json();
  },

  clearTransactions: async () => {
    const res = await fetch(`${PAYMENT_API_BASE}/api/payment/transactions`, { method: 'DELETE' });
    return res.json();
  },

  // Chaos Engineering Configuration
  getChaosConfig: async () => {
    const res = await fetch(`${PAYMENT_API_BASE}/api/chaos/config`);
    if (!res.ok) throw new Error('Failed to fetch chaos config');
    return res.json();
  },

  updateChaosConfig: async (config) => {
    const res = await fetch(`${PAYMENT_API_BASE}/api/chaos/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    if (!res.ok) throw new Error('Failed to update chaos config');
    return res.json();
  },

  // Health & Actuator
  checkHealth: async () => {
    const health = {
      orderService: { status: 'DOWN', latency: null },
      paymentService: { status: 'DOWN', latency: null },
      circuitBreakerState: 'UNKNOWN'
    };

    const t0 = performance.now();
    try {
      const res = await fetch(`${ORDER_API_BASE}/actuator/health`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        health.orderService.status = 'UP';
        health.orderService.latency = Math.round(performance.now() - t0);
      }
    } catch (e) {
      health.orderService.status = 'DOWN';
    }

    const t1 = performance.now();
    try {
      const res = await fetch(`${PAYMENT_API_BASE}/actuator/health`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        health.paymentService.status = 'UP';
        health.paymentService.latency = Math.round(performance.now() - t1);
      }
    } catch (e) {
      health.paymentService.status = 'DOWN';
    }

    try {
      const res = await fetch(`${ORDER_API_BASE}/actuator/circuitbreakers`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const data = await res.json();
        const cb = data?.circuitBreakers?.paymentService;
        if (cb && cb.state) {
          health.circuitBreakerState = cb.state;
        }
      }
    } catch (e) {
      // ignore
    }

    return health;
  }
};
