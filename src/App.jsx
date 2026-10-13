import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import ClientPortal from './components/ClientPortal';
import AdminPortal from './components/AdminPortal';
import { api } from './api';
import { ShoppingBag, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('CLIENT'); // 'CLIENT' | 'ADMIN'
  const [orders, setOrders] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [health, setHealth] = useState({
    orderService: { status: 'UP', latency: 45 },
    paymentService: { status: 'UP', latency: 38 },
    circuitBreakerState: 'CLOSED'
  });

  const fetchData = useCallback(async () => {
    // 1. Fetch Orders
    try {
      const o = await api.getOrders();
      setOrders(o);
    } catch (e) {
      // Keep previous orders or empty
    }

    // 2. Fetch Metrics
    try {
      const m = await api.getOrderMetrics();
      setMetrics(m);
    } catch (e) {
      // Mock metrics fallback if server is offline
    }

    // 3. Health check
    try {
      const h = await api.checkHealth();
      setHealth(h);
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchData();
    }, 2500);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  const handleClearOrders = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa toàn bộ đơn hàng mẫu?')) return;
    try {
      await api.clearOrders();
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <Navbar
        health={health}
        onRefresh={fetchData}
        autoRefresh={autoRefresh}
        setAutoRefresh={setAutoRefresh}
      />

      <main className="main-content">
        {/* Navigation Tabs (Client vs Admin) */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div className="tabs-container" style={{ padding: '0.4rem', background: 'rgba(16, 22, 35, 0.85)' }}>
            <button
              className={`tab-btn ${activeTab === 'CLIENT' ? 'active' : ''}`}
              onClick={() => setActiveTab('CLIENT')}
              id="tab-client"
              style={{ padding: '0.65rem 1.75rem', fontSize: '0.95rem' }}
            >
              <ShoppingBag size={18} /> Khách Hàng (Mua & Đặt Hàng)
            </button>
            <button
              className={`tab-btn ${activeTab === 'ADMIN' ? 'active' : ''}`}
              onClick={() => setActiveTab('ADMIN')}
              id="tab-admin"
              style={{ padding: '0.65rem 1.75rem', fontSize: '0.95rem' }}
            >
              <ShieldCheck size={18} color="var(--cyan)" /> Quản Trị Viên (Xuất Kho & Hủy Đơn)
            </button>
          </div>
        </div>

        {/* Tab 1: Client Portal */}
        {activeTab === 'CLIENT' && (
          <ClientPortal
            orders={orders}
            onOrderCreated={fetchData}
          />
        )}

        {/* Tab 2: Admin Portal */}
        {activeTab === 'ADMIN' && (
          <AdminPortal
            orders={orders}
            metrics={metrics}
            onRefresh={fetchData}
            onClear={handleClearOrders}
          />
        )}
      </main>
    </div>
  );
}
