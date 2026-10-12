import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import MetricsCards from './components/MetricsCards';
import OrderSimulator from './components/OrderSimulator';
import OrderTable from './components/OrderTable';
import OrderDetailModal from './components/OrderDetailModal';
import ChaosControl from './components/ChaosControl';
import DltInspector from './components/DltInspector';
import ArchitectureModal from './components/ArchitectureModal';
import { api } from './api';
import { ShoppingBag, Flame, Skull, HelpCircle, Layers } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('ORDERS');
  const [orders, setOrders] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [dltMessages, setDltMessages] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showArchModal, setShowArchModal] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [health, setHealth] = useState({
    orderService: { status: 'DOWN', latency: null },
    paymentService: { status: 'DOWN', latency: null },
    circuitBreakerState: 'CLOSED'
  });

  const fetchData = useCallback(async () => {
    // 1. Fetch Health
    try {
      const h = await api.checkHealth();
      setHealth(h);
    } catch (e) {
      // ignore
    }

    // 2. Fetch Orders & Metrics
    try {
      const o = await api.getOrders();
      setOrders(o);
      const m = await api.getOrderMetrics();
      setMetrics(m);
    } catch (e) {
      // order service not reachable yet
    }

    // 3. Fetch DLT
    try {
      const dlt = await api.getDltMessages();
      setDltMessages(dlt);
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
    try {
      await api.clearOrders();
      await api.clearTransactions();
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        health={health}
        onRefresh={fetchData}
        autoRefresh={autoRefresh}
        setAutoRefresh={setAutoRefresh}
      />

      <main className="main-content">
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="tabs-container">
            <button
              className={`tab-btn ${activeTab === 'ORDERS' ? 'active' : ''}`}
              onClick={() => setActiveTab('ORDERS')}
              id="tab-orders"
            >
              <ShoppingBag size={16} /> Order Management & Events
            </button>
            <button
              className={`tab-btn ${activeTab === 'CHAOS' ? 'active' : ''}`}
              onClick={() => setActiveTab('CHAOS')}
              id="tab-chaos"
            >
              <Flame size={16} color="#f43f5e" /> Chaos Engineering Lab
            </button>
            <button
              className={`tab-btn ${activeTab === 'DLT' ? 'active' : ''}`}
              onClick={() => setActiveTab('DLT')}
              id="tab-dlt"
            >
              <Skull size={16} color="#fb7185" /> Dead Letter Topic ({dltMessages.length})
            </button>
          </div>

          <button
            className="btn btn-secondary"
            onClick={() => setShowArchModal(true)}
            id="btn-open-arch"
          >
            <HelpCircle size={15} color="#6366f1" /> Architecture Blueprint & Guide
          </button>
        </div>

        {/* Global Realtime Metrics */}
        <MetricsCards orderMetrics={metrics} dltCount={dltMessages.length} />

        {/* Main View Area */}
        {activeTab === 'ORDERS' && (
          <>
            <OrderSimulator onOrderCreated={fetchData} onClear={handleClearOrders} />
            <OrderTable
              orders={orders}
              onSelectOrder={setSelectedOrder}
              onOrderUpdated={fetchData}
            />
          </>
        )}

        {activeTab === 'CHAOS' && (
          <div>
            <ChaosControl onChaosUpdated={fetchData} />
            <OrderTable
              orders={orders}
              onSelectOrder={setSelectedOrder}
              onOrderUpdated={fetchData}
            />
          </div>
        )}

        {activeTab === 'DLT' && (
          <DltInspector onReplayed={fetchData} />
        )}
      </main>

      {/* Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      {/* Blueprint Architecture Modal */}
      <ArchitectureModal
        isOpen={showArchModal}
        onClose={() => setShowArchModal(false)}
      />
    </div>
  );
}
