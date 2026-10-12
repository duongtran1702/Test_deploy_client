import React from 'react';
import { ShoppingCart, CheckCircle2, Clock, AlertTriangle, Skull, ShieldCheck } from 'lucide-react';

export default function MetricsCards({ orderMetrics, dltCount }) {
  const total = orderMetrics?.totalOrders || 0;
  const confirmed = orderMetrics?.confirmedOrders || 0;
  const pending = orderMetrics?.pendingOrders || 0;
  const failed = orderMetrics?.failedOrders || 0;
  const dlt = dltCount !== undefined ? dltCount : (orderMetrics?.dltRoutedOrders || 0);
  const successRate = total > 0 ? Math.round((confirmed / total) * 100) : 100;

  const cards = [
    {
      title: 'Total Ingested',
      value: total,
      subtext: 'Events produced to Kafka',
      icon: ShoppingCart,
      color: '#6366f1',
      bg: 'rgba(99, 102, 241, 0.12)'
    },
    {
      title: 'Confirmed / Settled',
      value: confirmed,
      subtext: `${successRate}% Overall Success`,
      icon: CheckCircle2,
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.12)'
    },
    {
      title: 'In Flight / Pending',
      value: pending,
      subtext: 'Consumer pipeline active',
      icon: Clock,
      color: '#06b6d4',
      bg: 'rgba(6, 182, 212, 0.12)'
    },
    {
      title: 'Payment Declined',
      value: failed,
      subtext: 'Business / credit rejections',
      icon: AlertTriangle,
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.12)'
    },
    {
      title: 'Dead Letter Topic (DLT)',
      value: dlt,
      subtext: 'Poison pills & retry exhausted',
      icon: Skull,
      color: '#f43f5e',
      bg: 'rgba(244, 63, 94, 0.12)'
    }
  ];

  return (
    <div className="grid-metrics">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {card.title}
              </span>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-sm)',
                backgroundColor: card.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={18} color={card.color} />
              </div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 700, letterSpacing: '-0.02em', color: card.color }}>
              {card.value}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.25rem' }}>
              {card.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
}
