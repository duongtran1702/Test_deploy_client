import React from 'react';
import { X, CheckCircle2, AlertTriangle, ArrowRight, Layers, FileJson, Clock } from 'lucide-react';

export default function OrderDetailModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Layers size={20} color="#6366f1" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Order Trace & Telemetry</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {order.orderId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.4rem', borderRadius: '50%' }}
            id="btn-close-modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Distributed Lifecycle Visualization */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Event-Driven Architecture Lifecycle
          </h4>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            {/* Step 1 */}
            <div style={{ textAlign: 'center', minWidth: 100 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', fontWeight: 700, fontSize: '0.8rem' }}>
                1
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>Order Service</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>POST /api/orders</div>
            </div>

            <ArrowRight size={16} color="var(--text-subtle)" />

            {/* Step 2 */}
            <div style={{ textAlign: 'center', minWidth: 100 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', fontWeight: 700, fontSize: '0.8rem' }}>
                2
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>Kafka Topic</div>
              <div style={{ fontSize: '0.7rem', color: '#06b6d4' }}>orders.v1</div>
            </div>

            <ArrowRight size={16} color="var(--text-subtle)" />

            {/* Step 3 */}
            <div style={{ textAlign: 'center', minWidth: 100 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#8b5cf6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', fontWeight: 700, fontSize: '0.8rem' }}>
                3
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>Payment Service</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Kafka Consumer</div>
            </div>

            <ArrowRight size={16} color="var(--text-subtle)" />

            {/* Step 4 */}
            <div style={{ textAlign: 'center', minWidth: 100 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: order.status === 'CONFIRMED' ? '#10b981' : (order.status === 'DLT_ROUTED' ? '#f43f5e' : '#f59e0b'),
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.5rem',
                fontWeight: 700,
                fontSize: '0.8rem'
              }}>
                4
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{order.status}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {order.status === 'DLT_ROUTED' ? 'Sent to DLT' : 'Ack / Committed'}
              </div>
            </div>
          </div>
        </div>

        {/* Details List */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>Customer</div>
            <div style={{ fontWeight: 600 }}>{order.customerId}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>Item Purchased</div>
            <div style={{ fontWeight: 600 }}>{order.item}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>Amount</div>
            <div style={{ fontWeight: 600, color: '#34d399' }}>${Number(order.amount).toFixed(2)}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>Status</div>
            <div style={{ fontWeight: 600 }}>{order.status}</div>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ color: 'var(--text-muted)' }}>Distributed Correlation ID (MDC Header)</div>
            <code style={{ fontSize: '0.8rem', color: '#06b6d4' }}>{order.correlationId || 'N/A'}</code>
          </div>
          {order.note && (
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ color: 'var(--text-muted)' }}>Audit Log / Note</div>
              <div style={{ color: 'var(--text-main)', fontSize: '0.8rem' }}>{order.note}</div>
            </div>
          )}
        </div>

        {/* Raw Payload */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <FileJson size={14} /> Full JSON Payload
          </div>
          <pre style={{
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8rem',
            overflowX: 'auto',
            color: '#a5b4fc',
            border: '1px solid var(--border-color)'
          }}>
            {JSON.stringify(order, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
