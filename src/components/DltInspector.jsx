import React, { useState, useEffect } from 'react';
import { Skull, RotateCcw, AlertTriangle, Layers, CheckCircle2, RefreshCw } from 'lucide-react';
import { api } from '../api';

export default function DltInspector({ onReplayed }) {
  const [dltMessages, setDltMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replayingKey, setReplayingKey] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);

  useEffect(() => {
    loadDlt();
  }, []);

  const loadDlt = async () => {
    setLoading(true);
    try {
      const list = await api.getDltMessages();
      setDltMessages(list);
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleReplay = async (key) => {
    setReplayingKey(key);
    setStatusMsg(null);
    try {
      const res = await api.replayDltOrder(key);
      setStatusMsg({ type: 'success', text: `Message for Order ${key.substring(0, 8)}... successfully replayed back to orders.v1!` });
      await loadDlt();
      if (onReplayed) onReplayed();
    } catch (err) {
      setStatusMsg({ type: 'error', text: `Failed to replay: ${err.message}` });
    } finally {
      setReplayingKey(null);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f43f5e' }}>
            <Skull size={20} /> Kafka Dead Letter Topic (DLT) Inspector & Replay
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Topic: <code style={{ color: '#f43f5e' }}>orders.v1.DLT</code>. Messages routed here automatically when 3 retries fail or poison pills are caught.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={loadDlt}
          disabled={loading}
          id="btn-refresh-dlt"
        >
          <RefreshCw size={14} className={loading ? 'pulse' : ''} /> Refresh DLT
        </button>
      </div>

      {statusMsg && (
        <div style={{
          marginBottom: '1rem',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.85rem',
          backgroundColor: statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
          color: statusMsg.type === 'success' ? '#34d399' : '#fb7185',
          border: `1px solid ${statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`
        }}>
          {statusMsg.text}
        </div>
      )}

      {dltMessages.length === 0 ? (
        <div style={{
          padding: '2.5rem',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.01)',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--border-color)'
        }}>
          <CheckCircle2 size={32} color="#10b981" style={{ margin: '0 auto 0.75rem' }} />
          <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#34d399' }}>Dead Letter Topic is Clean</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            No poisoned or unprocessable messages currently in the DLT queue. To test, check "Poison Pill" when creating an order or enable "Force DLT Routing" in Chaos Lab!
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Message Key / Order ID</th>
                <th>Topic</th>
                <th>Partition / Offset</th>
                <th>Timestamp</th>
                <th>Payload Snippet</th>
                <th style={{ textAlign: 'right' }}>Recovery Action</th>
              </tr>
            </thead>
            <tbody>
              {dltMessages.map((msg, i) => (
                <tr key={i}>
                  <td>
                    <code style={{ color: '#f43f5e', fontWeight: 600 }}>
                      {msg.key ? msg.key.substring(0, 10) + '...' : 'Unknown'}
                    </code>
                  </td>
                  <td>
                    <code style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{msg.topic}</code>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem' }}>P-{msg.partition} : #{msg.offset}</span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : 'N/A'}
                  </td>
                  <td>
                    <pre style={{ margin: 0, fontSize: '0.75rem', maxHeight: 40, overflow: 'hidden', color: '#94a3b8' }}>
                      {typeof msg.payload === 'object' ? JSON.stringify(msg.payload) : String(msg.payload)}
                    </pre>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-warning"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                      onClick={() => handleReplay(msg.key)}
                      disabled={replayingKey === msg.key}
                      title="Replay message back into Kafka orders.v1"
                      id={`btn-replay-${i}`}
                    >
                      <RotateCcw size={13} />
                      {replayingKey === msg.key ? 'Replaying...' : 'Replay to Kafka'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
