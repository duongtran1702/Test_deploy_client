import React, { useState } from 'react';
import { Search, Eye, Zap, CheckCircle2, Clock, AlertTriangle, Skull, RefreshCw } from 'lucide-react';
import { api } from '../api';

export default function OrderTable({ orders, onSelectOrder, onOrderUpdated }) {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [directTestingId, setDirectTestingId] = useState(null);
  const [directResult, setDirectResult] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="status-pill status-online">
            <CheckCircle2 size={13} /> Confirmed
          </span>
        );
      case 'PENDING':
        return (
          <span className="status-pill" style={{ background: 'rgba(6, 182, 212, 0.12)', color: '#22d3ee', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
            <Clock size={13} className="pulse" /> In Kafka
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="status-pill status-degraded">
            <Clock size={13} className="pulse" /> Processing
          </span>
        );
      case 'FAILED':
        return (
          <span className="status-pill status-degraded">
            <AlertTriangle size={13} /> Declined
          </span>
        );
      case 'DLT_ROUTED':
        return (
          <span className="status-pill status-offline">
            <Skull size={13} /> DLT Routed
          </span>
        );
      default:
        return <span className="status-pill">{status}</span>;
    }
  };

  const handleTestDirect = async (e, orderId) => {
    e.stopPropagation();
    setDirectTestingId(orderId);
    setDirectResult(null);
    try {
      const res = await api.testDirectPaymentWithCircuitBreaker(orderId);
      setDirectResult({ id: orderId, data: res });
      onOrderUpdated();
    } catch (err) {
      setDirectResult({ id: orderId, error: err.message });
    } finally {
      setDirectTestingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = filter === 'ALL' || o.status === filter;
    const matchesSearch =
      o.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerId?.toLowerCase().includes(search.toLowerCase()) ||
      o.item?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Live Orders & Kafka Event Stream</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Real-time state transitions updated via consumer event acknowledgments.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', minWidth: 220 }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: 11, color: 'var(--text-subtle)' }} />
            <input
              type="text"
              placeholder="Search by ID, customer..."
              className="form-input"
              style={{ paddingLeft: '2rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="input-search-orders"
            />
          </div>

          <div className="tabs-container" style={{ padding: '0.2rem' }}>
            {['ALL', 'CONFIRMED', 'PENDING', 'FAILED', 'DLT_ROUTED'].map((f) => (
              <button
                key={f}
                className={`tab-btn ${filter === f ? 'active' : ''}`}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {directResult && (
        <div style={{
          marginBottom: '1rem',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          background: directResult.data?.fallbackActive ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
          border: `1px solid ${directResult.data?.fallbackActive ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
          fontSize: '0.85rem'
        }}>
          <strong>Resilience4j Direct Sync Result (Order {directResult.id.substring(0, 8)}): </strong>
          {directResult.data?.fallbackActive ? (
            <span style={{ color: '#fbbf24' }}>
              ⚠️ FALLBACK TRIGGERED! Reason: {directResult.data?.errorMessage || directResult.data?.message} (Circuit Breaker protected call)
            </span>
          ) : (
            <span style={{ color: '#34d399' }}>
              ✅ Succeeded directly! Status: {directResult.data?.status || 'OK'}
            </span>
          )}
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Item</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Correlation / Trace ID</th>
              <th>Created At</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No orders found. Produce an order from the generator above or trigger a batch!
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.orderId} style={{ cursor: 'pointer' }} onClick={() => onSelectOrder(order)}>
                  <td>
                    <code style={{ color: '#6366f1', fontWeight: 600 }}>
                      {order.orderId ? order.orderId.substring(0, 8) + '...' : 'N/A'}
                    </code>
                  </td>
                  <td style={{ fontWeight: 500 }}>{order.customerId}</td>
                  <td>{order.item}</td>
                  <td style={{ fontWeight: 600 }}>${Number(order.amount).toFixed(2)}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>
                    <code style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                      {order.correlationId ? order.correlationId.substring(0, 12) + '...' : 'none'}
                    </code>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : 'Just now'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.35rem' }} onClick={(e) => e.stopPropagation()}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                        onClick={() => onSelectOrder(order)}
                        title="View details & payload"
                      >
                        <Eye size={13} /> View
                      </button>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                        onClick={(e) => handleTestDirect(e, order.orderId)}
                        disabled={directTestingId === order.orderId}
                        title="Test direct sync REST call with Circuit Breaker"
                      >
                        <Zap size={13} color="#f59e0b" />
                        {directTestingId === order.orderId ? 'Testing...' : 'Test CB'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
