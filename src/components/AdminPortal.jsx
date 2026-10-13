import React, { useState } from 'react';
import { Truck, XCircle, Package, RefreshCw, Trash2, Search, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { api } from '../api';

export default function AdminPortal({ orders, metrics, onRefresh, onClear }) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleShipOrder = async (orderId) => {
    if (!window.confirm(`Xác nhận xuất kho cho đơn hàng #${orderId.substring(0, 8)}?`)) return;
    setActionLoading(orderId);
    try {
      await api.shipOrder(orderId);
      setFeedback({ type: 'success', message: `Đơn hàng #${orderId.substring(0, 8)} đã được xuất kho thành công!` });
      if (onRefresh) onRefresh();
    } catch (err) {
      setFeedback({ type: 'error', message: `Lỗi xuất kho: ${err.message}` });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm(`Bạn có chắc chắn muốn HỦY đơn hàng #${orderId.substring(0, 8)}?`)) return;
    setActionLoading(orderId);
    try {
      await api.cancelOrder(orderId);
      setFeedback({ type: 'success', message: `Đã hủy đơn hàng #${orderId.substring(0, 8)} thành công!` });
      if (onRefresh) onRefresh();
    } catch (err) {
      setFeedback({ type: 'error', message: `Lỗi hủy đơn: ${err.message}` });
    } finally {
      setActionLoading(null);
    }
  };

  const filteredOrders = orders.filter((ord) => {
    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'PENDING' && (ord.status === 'PENDING' || ord.status === 'CONFIRMED')) ||
      ord.status === filterStatus;

    const matchesSearch =
      ord.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="status-pill status-degraded"><Clock size={12} /> Chờ xử lý</span>;
      case 'CONFIRMED':
        return <span className="status-pill status-online"><CheckCircle size={12} /> Đã xác nhận</span>;
      case 'SHIPPED':
        return <span className="status-pill badge-shipped"><Truck size={12} /> Đã xuất kho</span>;
      case 'CANCELLED':
        return <span className="status-pill badge-cancelled"><XCircle size={12} /> Đã hủy</span>;
      default:
        return <span className="status-pill status-offline">{status}</span>;
    }
  };

  const totalCount = orders.length;
  const pendingCount = orders.filter((o) => o.status === 'PENDING' || o.status === 'CONFIRMED').length;
  const shippedCount = orders.filter((o) => o.status === 'SHIPPED').length;
  const cancelledCount = orders.filter((o) => o.status === 'CANCELLED').length;

  return (
    <div>
      {/* Metric Cards Thống Kê Admin */}
      <div className="grid-metrics">
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tổng Số Đơn Hàng</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.25rem' }}>
            {totalCount}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--amber)' }}>Chờ Xử Lý / Đã Nhận</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--amber)', marginTop: '0.25rem' }}>
            {pendingCount}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--cyan)' }}>Đã Xuất Kho (Shipped)</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--cyan)', marginTop: '0.25rem' }}>
            {shippedCount}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--rose)' }}>Đã Hủy (Cancelled)</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--rose)', marginTop: '0.25rem' }}>
            {cancelledCount}
          </div>
        </div>
      </div>

      {feedback && (
        <div
          style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
            border: `1px solid ${feedback.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
            color: feedback.type === 'success' ? '#34d399' : '#fb7185',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback(null)}
            style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Control Bar: Bộ lọc & Tìm kiếm */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: '0.25rem' }}>Lọc:</span>
            <button
              className={`tab-btn ${filterStatus === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilterStatus('ALL')}
              style={{ padding: '0.4rem 0.85rem' }}
            >
              Tất cả ({totalCount})
            </button>
            <button
              className={`tab-btn ${filterStatus === 'PENDING' ? 'active' : ''}`}
              onClick={() => setFilterStatus('PENDING')}
              style={{ padding: '0.4rem 0.85rem' }}
            >
              Chờ xử lý ({pendingCount})
            </button>
            <button
              className={`tab-btn ${filterStatus === 'SHIPPED' ? 'active' : ''}`}
              onClick={() => setFilterStatus('SHIPPED')}
              style={{ padding: '0.4rem 0.85rem' }}
            >
              Đã xuất kho ({shippedCount})
            </button>
            <button
              className={`tab-btn ${filterStatus === 'CANCELLED' ? 'active' : ''}`}
              onClick={() => setFilterStatus('CANCELLED')}
              style={{ padding: '0.4rem 0.85rem' }}
            >
              Đã hủy ({cancelledCount})
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ position: 'relative', width: '240px' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.2rem', fontSize: '0.85rem' }}
                placeholder="Tìm khách hàng / mã đơn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="btn btn-secondary" onClick={onRefresh} title="Làm mới">
              <RefreshCw size={15} />
            </button>
            <button
              className="btn btn-danger"
              onClick={onClear}
              title="Xóa tất cả đơn mẫu"
              style={{ fontSize: '0.8rem', padding: '0.55rem 0.9rem' }}
            >
              <Trash2 size={14} /> Xóa Dữ Liệu
            </button>
          </div>
        </div>
      </div>

      {/* Bảng Đơn Hàng Admin */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={18} color="var(--primary)" /> Danh Sách Đơn Hàng Cần Quản Lý
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Hiển thị {filteredOrders.length} / {totalCount} đơn
          </span>
        </div>

        {filteredOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
            <Package size={40} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
            <p>Không tìm thấy đơn hàng nào phù hợp với bộ lọc.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Mã Đơn</th>
                  <th>Khách Hàng</th>
                  <th>Sản Phẩm & Chi Tiết</th>
                  <th>Giá Trị</th>
                  <th>Trạng Thái</th>
                  <th>Thời Gian Đặt</th>
                  <th style={{ textAlign: 'center' }}>Thao Tác Quản Trị</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((ord) => {
                  const isShipped = ord.status === 'SHIPPED';
                  const isCancelled = ord.status === 'CANCELLED';
                  const canAction = !isShipped && !isCancelled;

                  return (
                    <tr key={ord.id}>
                      <td>
                        <code style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          #{ord.id.substring(0, 8)}
                        </code>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                        {ord.customerId}
                      </td>
                      <td>
                        <span style={{ display: 'block', fontWeight: 500 }}>{ord.item}</span>
                        {ord.note && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                            {ord.note}
                          </span>
                        )}
                      </td>
                      <td style={{ color: 'var(--emerald)', fontWeight: 700 }}>
                        ${Number(ord.amount).toLocaleString()}
                      </td>
                      <td>{getStatusBadge(ord.status)}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(ord.createdAt).toLocaleTimeString()} - {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                          {/* Nút Xuất Kho */}
                          <button
                            className="btn btn-ship"
                            onClick={() => handleShipOrder(ord.id)}
                            disabled={!canAction || actionLoading === ord.id}
                            style={{
                              padding: '0.4rem 0.85rem',
                              fontSize: '0.8rem',
                              opacity: canAction ? 1 : 0.35,
                              cursor: canAction ? 'pointer' : 'not-allowed'
                            }}
                            title={isShipped ? 'Đơn này đã được xuất kho' : 'Xác nhận xuất kho cho đơn này'}
                          >
                            <Truck size={14} /> Xuất Kho
                          </button>

                          {/* Nút Hủy Đơn */}
                          <button
                            className="btn btn-cancel"
                            onClick={() => handleCancelOrder(ord.id)}
                            disabled={!canAction || actionLoading === ord.id}
                            style={{
                              padding: '0.4rem 0.85rem',
                              fontSize: '0.8rem',
                              opacity: canAction ? 1 : 0.35,
                              cursor: canAction ? 'pointer' : 'not-allowed'
                            }}
                            title={isCancelled ? 'Đơn này đã bị hủy' : 'Hủy đơn hàng này'}
                          >
                            <XCircle size={14} /> Hủy Đơn
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
