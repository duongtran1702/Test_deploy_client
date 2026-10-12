import React from 'react';
import { X, Server, Layers, ShieldCheck, Terminal, CheckCircle2, Cpu, Copy } from 'lucide-react';

export default function ArchitectureModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 860, padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Server size={22} color="#6366f1" /> Production Microservices Blueprint
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Spring Boot 4.x • Java 21 LTS • Apache Kafka KRaft • Resilience4j
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.4rem', borderRadius: '50%' }}
            id="btn-close-arch-modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Feature Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#34d399', marginBottom: '0.35rem' }}>
              🛡️ Circuit Breaker & Fallback
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Resilience4j monitors downstream failure rates. If failure &gt; 50%, circuit flips to OPEN, triggering graceful degradation fallbacks without cascading timeouts.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f59e0b', marginBottom: '0.35rem' }}>
              🔁 Exponential BackOff Retry
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Kafka Consumer intercepts transient network faults and retries 3 times with doubling interval (500ms → 1000ms → 2000ms) before exhausting.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f43f5e', marginBottom: '0.35rem' }}>
              ☠️ Dead Letter Topic (DLT)
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              DeadLetterPublishingRecoverer routes unprocessable messages to <code>orders.v1.DLT</code>, preventing poison pill head-of-line blocking while enabling replay.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#06b6d4', marginBottom: '0.35rem' }}>
              🔒 Idempotent Consumer
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Deduplication by message UUID guarantees exactly-once processing semantics at application level even during at-least-once Kafka deliveries.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#a855f7', marginBottom: '0.35rem' }}>
              🔍 MDC Distributed Tracing
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <code>X-Correlation-Id</code> header is injected at HTTP boundary and propagated across Kafka record headers for complete end-to-end log observability.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#38bdf8', marginBottom: '0.35rem' }}>
              ⚡ Java 21 Generational ZGC
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Docker containers run with <code>-XX:+UseZGC -XX:+ZGenerational</code> ensuring ultra-low latency &lt;1ms garbage collection pauses for financial workloads.
            </p>
          </div>
        </div>

        {/* Quick Commands */}
        <div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Terminal size={16} /> Quick Start Commands
          </h4>

          <div style={{ background: 'rgba(0, 0, 0, 0.5)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.8' }}>
            <div><span style={{ color: '#64748b' }}># 1. Start all infrastructure and microservices with Docker Compose:</span></div>
            <code style={{ color: '#34d399' }}>docker compose up --build -d</code>

            <div style={{ marginTop: '0.5rem' }}><span style={{ color: '#64748b' }}># 2. Or run microservices locally with Java 21 Gradle wrapper:</span></div>
            <code style={{ color: '#38bdf8' }}>cd server && .\gradlew.bat :order-service:bootRun</code><br />
            <code style={{ color: '#38bdf8' }}>cd server && .\gradlew.bat :payment-service:bootRun</code>

            <div style={{ marginTop: '0.5rem' }}><span style={{ color: '#64748b' }}># 3. Access Web Dashboards:</span></div>
            <div>React Tester UI: <a href="http://localhost:3000" target="_blank" style={{ color: '#6366f1' }}>http://localhost:3000</a></div>
            <div>Kafka UI (Browser Inspector): <a href="http://localhost:8090" target="_blank" style={{ color: '#6366f1' }}>http://localhost:8090</a></div>
            <div>Order Service Swagger: <a href="http://localhost:8081/swagger-ui.html" target="_blank" style={{ color: '#6366f1' }}>http://localhost:8081/swagger-ui.html</a></div>
            <div>Payment Service Swagger: <a href="http://localhost:8082/swagger-ui.html" target="_blank" style={{ color: '#6366f1' }}>http://localhost:8082/swagger-ui.html</a></div>
          </div>
        </div>
      </div>
    </div>
  );
}
