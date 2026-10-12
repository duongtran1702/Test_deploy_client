import React, { useState } from 'react';
import { Send, Sparkles, Zap, Trash2, ShieldAlert, Bug } from 'lucide-react';
import { api } from '../api';

export default function OrderSimulator({ onOrderCreated, onClear }) {
  const [customer, setCustomer] = useState('Alice Nguyen');
  const [item, setItem] = useState('MacBook Pro M3 Max');
  const [amount, setAmount] = useState(2499.0);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [simulatePoisonPill, setSimulatePoisonPill] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const sampleItems = [
    { name: 'MacBook Pro M3 Max', price: 2499.0 },
    { name: 'Sony WH-1000XM5 Headphones', price: 399.0 },
    { name: 'Keychron Q1 Pro Mechanical Keyboard', price: 199.0 },
    { name: 'LG UltraFine 32" OLED Monitor', price: 1299.0 },
    { name: 'AWS Cloud Architecture Book', price: 49.99 }
  ];

  const handleItemSelect = (e) => {
    const selected = sampleItems.find((i) => i.name === e.target.value);
    if (selected) {
      setItem(selected.name);
      setAmount(selected.price);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      const res = await api.createOrder({
        customerId: customer,
        item,
        amount: Number(amount),
        simulateFailure,
        simulatePoisonPill
      });
      setFeedback({ type: 'success', msg: `Order created: ${res.orderId.substring(0, 8)}... (${res.status})` });
      onOrderCreated();
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleBatch = async (count, failurePercent = 0) => {
    setLoading(true);
    setFeedback(null);
    try {
      await api.createBatchOrders(count, failurePercent);
      setFeedback({ type: 'success', msg: `Triggered batch creation of ${count} orders!` });
      onOrderCreated();
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={18} color="#6366f1" /> Event Producer & Load Generator
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Produce events to Kafka topic <code style={{ color: '#06b6d4' }}>orders.v1</code> with custom payload or chaos triggers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => handleBatch(5, 0)}
            disabled={loading}
            id="btn-batch-5"
          >
            <Sparkles size={14} color="#06b6d4" /> Batch 5 (Healthy)
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => handleBatch(10, 40)}
            disabled={loading}
            id="btn-batch-chaos"
          >
            <Bug size={14} color="#f59e0b" /> Batch 10 (40% Chaos)
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClear}
            disabled={loading}
            title="Clear all orders"
            id="btn-clear-orders"
          >
            <Trash2 size={14} color="#f43f5e" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            Customer Name
          </label>
          <input
            className="form-input"
            type="text"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            required
            id="input-customer"
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            Product / Item
          </label>
          <select className="form-input" value={item} onChange={handleItemSelect} id="select-item">
            {sampleItems.map((i) => (
              <option key={i.name} value={i.name}>{i.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            Amount ($)
          </label>
          <input
            className="form-input"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            id="input-amount"
          />
        </div>

        {/* Fault Injection Checkboxes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', justifyContent: 'center' }}>
          <label style={{ fontSize: '0.8rem', color: simulateFailure ? '#fbbf24' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={simulateFailure}
              onChange={(e) => setSimulateFailure(e.target.checked)}
              id="check-simulate-failure"
            />
            <ShieldAlert size={14} /> Simulate Payment Failure
          </label>
          <label style={{ fontSize: '0.8rem', color: simulatePoisonPill ? '#fb7185' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={simulatePoisonPill}
              onChange={(e) => setSimulatePoisonPill(e.target.checked)}
              id="check-poison-pill"
            />
            <Bug size={14} /> Poison Pill (Forces DLT Routing)
          </label>
        </div>

        <div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
            id="btn-submit-order"
          >
            <Send size={15} />
            {loading ? 'Publishing...' : 'Produce to Kafka'}
          </button>
        </div>
      </form>

      {feedback && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.85rem',
          backgroundColor: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
          color: feedback.type === 'success' ? '#34d399' : '#fb7185',
          border: `1px solid ${feedback.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`
        }}>
          {feedback.msg}
        </div>
      )}
    </div>
  );
}
