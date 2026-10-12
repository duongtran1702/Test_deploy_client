import React from 'react';
import { Layers, Activity, RefreshCw, ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';

export default function Navbar({ health, onRefresh, autoRefresh, setAutoRefresh }) {
  const getCircuitBreakerBadge = (state) => {
    switch (state) {
      case 'CLOSED':
        return (
          <span className="status-pill status-online" title="Circuit Breaker CLOSED (Healthy, traffic flowing)">
            <ShieldCheck size={14} /> CB: CLOSED
          </span>
        );
      case 'OPEN':
        return (
          <span className="status-pill status-offline" title="Circuit Breaker OPEN (Tripped, traffic blocked/fallback)">
            <ShieldAlert size={14} /> CB: OPEN (TRIPPED)
          </span>
        );
      case 'HALF_OPEN':
        return (
          <span className="status-pill status-degraded" title="Circuit Breaker HALF_OPEN (Trial calls)">
            <Activity size={14} /> CB: HALF-OPEN
          </span>
        );
      default:
        return (
          <span className="status-pill status-online">
            <ShieldCheck size={14} /> CB: ACTIVE
          </span>
        );
    }
  };

  return (
    <header className="header-container">
      <div className="brand-wrapper">
        <div className="brand-logo">
          <Layers size={22} color="#ffffff" />
        </div>
        <div>
          <h1 className="brand-title">Enterprise Microservices Studio</h1>
          <div className="brand-subtitle">
            <span>Spring Boot 4.x</span>
            <span>•</span>
            <span>Java 21 LTS</span>
            <span>•</span>
            <span>Apache Kafka (KRaft)</span>
            <span>•</span>
            <span>Resilience4j</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Service 1: Order Service */}
        <div className={`status-pill ${health.orderService.status === 'UP' ? 'status-online' : 'status-offline'}`}>
          <div className={`status-dot ${health.orderService.status === 'UP' ? 'online' : 'offline'}`} />
          <span>Order-Service (:8081)</span>
          {health.orderService.latency && <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>{health.orderService.latency}ms</span>}
        </div>

        {/* Service 2: Payment Service */}
        <div className={`status-pill ${health.paymentService.status === 'UP' ? 'status-online' : 'status-offline'}`}>
          <div className={`status-dot ${health.paymentService.status === 'UP' ? 'online' : 'offline'}`} />
          <span>Payment-Service (:8082)</span>
          {health.paymentService.latency && <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>{health.paymentService.latency}ms</span>}
        </div>

        {/* Circuit Breaker */}
        {getCircuitBreakerBadge(health.circuitBreakerState)}

        {/* Auto Refresh toggle */}
        <button
          className={`btn btn-secondary ${autoRefresh ? 'active' : ''}`}
          onClick={() => setAutoRefresh(!autoRefresh)}
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
          id="btn-toggle-autorefresh"
        >
          <Activity size={14} className={autoRefresh ? 'pulse' : ''} />
          {autoRefresh ? 'Auto 2s ON' : 'Auto OFF'}
        </button>

        <button
          className="btn btn-secondary"
          onClick={onRefresh}
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
          id="btn-manual-refresh"
          title="Refresh Data"
        >
          <RefreshCw size={14} />
        </button>
      </div>
    </header>
  );
}
