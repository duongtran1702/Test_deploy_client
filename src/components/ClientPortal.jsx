import React, { useState } from 'react';
import { ShoppingCart, CheckCircle, Clock, Truck, XCircle, Package, Sparkles } from 'lucide-react';
import { api } from '../api';

const MOCK_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'MacBook Pro 16" M3 Max',
    category: 'Laptop',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    desc: 'Chip Apple M3 Max 16-core, 36GB Unified Memory, 1TB SSD Liquid Retina XDR.'
  },
  {
    id: 'prod-2',
    name: 'iPhone 16 Pro Max 256GB',
    category: 'Smartphone',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
    desc: 'Titanium nguyên khối, Camera 48MP Zoom 5x, Chip Apple A18 Pro mạnh mẽ.'
  },
  {
    id: 'prod-3',
    name: 'Sony WH-1000XM5 ANC',
    category: 'Audio',
    price: 399,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    desc: 'Chống ồn chủ động đỉnh cao, thời lượng pin 30 giờ, âm thanh Hi-Res Audio.'
  },
  {
    id: 'prod-4',
    name: 'Keychron Q1 Pro Custom',
    category: 'Keyboard',
    price: 199,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    desc: 'Bàn phím cơ nhôm CNC 75%, kết nối Bluetooth 5.1 & Type-C, hot-swap.'
  },
  {
    id: 'prod-5',
    name: 'Dell UltraSharp 27" 4K',
    category: 'Monitor',
    price: 699,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
    desc: 'Tấm nền IPS Black chuẩn đồ họa, 98% DCI-P3, cổng kết nối Type-C 90W PD.'
  },
  {
    id: 'prod-6',
    name: 'Logitech MX Master 3S',
    category: 'Accessory',
    price: 99,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
    desc: 'Cảm biến 8K DPI trên mọi bề mặt, nút cuộn siêu tốc MagSpeed, click êm ái.'
  }
];

export default function ClientPortal({ orders, onOrderCreated }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customerName, setCustomerName] = useState('Nguyễn Văn An');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleOpenOrder = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setSuccessMessage(null);
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !customerName.trim()) return;

    setLoading(true);
    try {
      const totalAmount = selectedProduct.price * quantity;
      await api.createOrder({
        customerId: customerName.trim(),
        item: `${selectedProduct.name} (x${quantity})`,
        amount: totalAmount,
        simulateFailure: false,
        simulatePoisonPill: false
      });

      setSuccessMessage(`Đặt hàng thành công! Đơn hàng của bạn đang được xử lý.`);
      setSelectedProduct(null);
      if (onOrderCreated) onOrderCreated();
    } catch (err) {
      alert(`Lỗi đặt hàng: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="status-pill status-degraded"><Clock size={13} /> Chờ xác nhận</span>;
      case 'CONFIRMED':
        return <span className="status-pill status-online"><CheckCircle size={13} /> Đã nhận đơn</span>;
      case 'SHIPPED':
        return <span className="status-pill badge-shipped"><Truck size={13} /> Đã xuất kho</span>;
      case 'CANCELLED':
        return <span className="status-pill badge-cancelled"><XCircle size={13} /> Đã hủy</span>;
      default:
        return <span className="status-pill status-offline">{status}</span>;
    }
  };

  return (
    <div>
      {/* Banner Khách Hàng */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.8))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="product-badge" style={{ position: 'static' }}>
                <Sparkles size={12} /> Cổng Khách Hàng
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
              Cửa Hàng Công Nghệ Trực Tuyến
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Chọn sản phẩm yêu thích và bấm đặt hàng ngay. Đơn hàng sẽ được chuyển tức thì qua Event-Driven Architecture.
            </p>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', display: 'block' }}>Người mua mặc định:</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>{customerName}</span>
          </div>
        </div>

        {successMessage && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={18} /> {successMessage}
          </div>
        )}
      </div>

      {/* Danh mục sản phẩm */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Package size={20} color="var(--primary)" /> Danh Sách Sản Phẩm Mẫu
        </h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{MOCK_PRODUCTS.length} sản phẩm có sẵn</span>
      </div>

      <div className="product-grid">
        {MOCK_PRODUCTS.map((prod) => (
          <div key={prod.id} className="product-card">
            <span className="product-badge">{prod.category}</span>
            <div className="product-image-wrap">
              <img src={prod.image} alt={prod.name} className="product-image" loading="lazy" />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.35rem' }}>
                {prod.name}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', flex: 1, lineHeight: 1.4 }}>
                {prod.desc}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'block' }}>Giá bán</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--emerald)' }}>
                    ${prod.price.toLocaleString()}
                  </span>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => handleOpenOrder(prod)}
                  style={{ padding: '0.5rem 1rem' }}
                >
                  <ShoppingCart size={15} /> Mua Ngay
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lịch sử đặt hàng của Khách */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} color="var(--cyan)" /> Lịch Sử Đơn Hàng Của Bạn
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Tổng số: {orders.length} đơn
          </span>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <Package size={40} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
            <p>Bạn chưa có đơn hàng nào. Hãy chọn một sản phẩm ở trên để đặt hàng!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Mã Đơn</th>
                  <th>Sản Phẩm</th>
                  <th>Tổng Tiền</th>
                  <th>Thời Gian</th>
                  <th>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr key={ord.id}>
                    <td>
                      <code style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        #{ord.id.substring(0, 8)}...
                      </code>
                    </td>
                    <td style={{ fontWeight: 600 }}>{ord.item}</td>
                    <td style={{ color: 'var(--emerald)', fontWeight: 600 }}>
                      ${Number(ord.amount).toLocaleString()}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(ord.createdAt).toLocaleTimeString()} - {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td>{getStatusBadge(ord.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Đặt Hàng */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingCart size={20} color="var(--primary)" /> Xác Nhận Đặt Hàng
              </h3>
              <button
                onClick={() => setSelectedProduct(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmOrder}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>{selectedProduct.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--cyan)' }}>{selectedProduct.category}</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--emerald)', marginTop: '0.25rem' }}>
                    ${selectedProduct.price.toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Họ và tên người nhận:
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nhập tên khách hàng"
                  required
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Số lượng:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ padding: '0.4rem 0.8rem' }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: '1.1rem', fontWeight: 600, minWidth: '30px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setQuantity(quantity + 1)}
                    style={{ padding: '0.4rem 0.8rem' }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderTop: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Tổng thanh toán:</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--emerald)' }}>
                  ${(selectedProduct.price * quantity).toLocaleString()}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedProduct(null)}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Đang gửi Kafka...' : 'Xác Nhận Đặt Hàng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
