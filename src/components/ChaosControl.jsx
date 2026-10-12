import React, { useState, useEffect } from 'react';
import { Flame, ShieldAlert, Sliders, Save, CheckCircle2, AlertOctagon, RotateCcw } from 'lucide-react';
import { api } from '../api';

export default function ChaosControl({ onChaosUpdated }) {
  const [config, setConfig] = useState({
    failureRatePercent: 0,
    simulatedLatencyMs: 0,
    simulateGatewayDown: false,
    forceDLTRouting: false
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const current = await api.getChaosConfig();
      setConfig(current);
    } catch (e) {
      // payment service might not be running yet
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await api.updateChaosConfig(config);
      setMessage({ type: 'success', text: 'Chaos settings applied to Payment Service!' });
      if (onChaosUpdated) onChaosUpdated();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update chaos config: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    const clean = {
      failureRatePercent: 0,
      simulatedLatencyMs: 0,
      simulateGatewayDown: false,
      forceDLTRouting: false
    };
    setConfig(clean);
    setSaving(true);
    try {
      await api.updateChaosConfig(clean);
      setMessage({ type: 'success', text: 'Chaos engineering reset to normal healthy mode!' });
      if (onChaosUpdated) onChaosUpdated();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f43f5e' }}>
            <Flame size={20} /> Chaos Engineering & Resilience Lab
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Inject artificial faults, latency, and fatal exceptions to test Circuit Breaker, Exponential Retries, and DLT routing live!
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={saving}
            id="btn-reset-chaos"
          >
            <RotateCcw size={14} /> Reset Healthy
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
            id="btn-apply-chaos"
          >
            <Save size={14} /> {saving ? 'Applying...' : 'Apply Chaos Rules'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {/* Slider 1: Failure Rate */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Random Failure Rate</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: config.failureRatePercent > 0 ? '#f59e0b' : '#10b981' }}>
              {config.failureRatePercent}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="10"
            value={config.failureRatePercent}
            onChange={(e) => setConfig({ ...config, failureRatePercent: Number(e.target.value) })}
            style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
            id="slider-failure-rate"
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.5rem' }}>
            Causes payment consumer to fail randomly. Triggers Kafka 3-attempt exponential retry backoff.
          </p>
        </div>

        {/* Slider 2: Latency */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Simulated Latency (Delay)</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: config.simulatedLatencyMs > 0 ? '#06b6d4' : '#10b981' }}>
              {config.simulatedLatencyMs} ms
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="3000"
            step="250"
            value={config.simulatedLatencyMs}
            onChange={(e) => setConfig({ ...config, simulatedLatencyMs: Number(e.target.value) })}
            style={{ width: '100%', accentColor: '#06b6d4', cursor: 'pointer' }}
            id="slider-latency"
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.5rem' }}>
            Simulates slow network or third-party bank slowdown. Tests consumer concurrency & timeout limits.
          </p>
        </div>

        {/* Toggles */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.85rem', justifyContent: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}>
            <input
              type="checkbox"
              checked={config.simulateGatewayDown}
              onChange={(e) => setConfig({ ...config, simulateGatewayDown: e.target.checked })}
              id="toggle-gateway-down"
            />
            <span style={{ color: config.simulateGatewayDown ? '#f43f5e' : 'var(--text-main)' }}>
              Simulate Payment Gateway 503 Outage (Trips Circuit Breaker)
            </span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}>
            <input
              type="checkbox"
              checked={config.forceDLTRouting}
              onChange={(e) => setConfig({ ...config, forceDLTRouting: e.target.checked })}
              id="toggle-force-dlt"
            />
            <span style={{ color: config.forceDLTRouting ? '#f43f5e' : 'var(--text-main)' }}>
              Force Unrecoverable Exception (Direct DLT Routing)
            </span>
          </label>
        </div>
      </div>

      {message && (
        <div style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.85rem',
          backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
          color: message.type === 'success' ? '#34d399' : '#fb7185',
          border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`
        }}>
          {message.text}
        </div>
      )}
    </div>
  );
}
