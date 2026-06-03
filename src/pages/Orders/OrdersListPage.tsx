import { useMemo, useState } from 'react';

type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

type PaymentStatus = 'Paid' | 'Pending' | 'Refunded' | 'Failed';

type Order = {
  id: number;
  orderId: string;
  customer: string;
  email: string;
  items: number;
  total: number;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  date: string;
  city: string;
};

type OrdersListPageProps = {
  title: string;
  subtitle: string;
  defaultStatus: 'All' | OrderStatus;
};

const orders: Order[] = [
  { id: 1, orderId: 'ORD-1001', customer: 'Aarav Sharma', email: 'aarav@gmail.com', items: 3, total: 2499, paymentStatus: 'Paid', status: 'Pending', date: '26 Mar 2026', city: 'Delhi' },
  { id: 2, orderId: 'ORD-1002', customer: 'Priya Mehta', email: 'priya@gmail.com', items: 2, total: 1599, paymentStatus: 'Paid', status: 'Processing', date: '25 Mar 2026', city: 'Mumbai' },
  { id: 3, orderId: 'ORD-1003', customer: 'Rohan Verma', email: 'rohan@gmail.com', items: 1, total: 899, paymentStatus: 'Pending', status: 'Pending', date: '25 Mar 2026', city: 'Pune' },
  { id: 4, orderId: 'ORD-1004', customer: 'Sneha Kapoor', email: 'sneha@gmail.com', items: 4, total: 4999, paymentStatus: 'Paid', status: 'Shipped', date: '24 Mar 2026', city: 'Bengaluru' },
  { id: 5, orderId: 'ORD-1005', customer: 'Kabir Singh', email: 'kabir@gmail.com', items: 2, total: 3299, paymentStatus: 'Paid', status: 'Delivered', date: '23 Mar 2026', city: 'Jaipur' },
  { id: 6, orderId: 'ORD-1006', customer: 'Ananya Rao', email: 'ananya@gmail.com', items: 1, total: 549, paymentStatus: 'Refunded', status: 'Returned', date: '22 Mar 2026', city: 'Hyderabad' },
  { id: 7, orderId: 'ORD-1007', customer: 'Vikram Das', email: 'vikram@gmail.com', items: 5, total: 7199, paymentStatus: 'Failed', status: 'Cancelled', date: '21 Mar 2026', city: 'Kolkata' },
  { id: 8, orderId: 'ORD-1008', customer: 'Isha Patel', email: 'isha@gmail.com', items: 2, total: 1899, paymentStatus: 'Paid', status: 'Shipped', date: '20 Mar 2026', city: 'Ahmedabad' },
  { id: 9, orderId: 'ORD-1009', customer: 'Neel Joshi', email: 'neel@gmail.com', items: 3, total: 2799, paymentStatus: 'Paid', status: 'Delivered', date: '19 Mar 2026', city: 'Surat' },
  { id: 10, orderId: 'ORD-1010', customer: 'Diya Nair', email: 'diya@gmail.com', items: 1, total: 1299, paymentStatus: 'Pending', status: 'Processing', date: '18 Mar 2026', city: 'Chennai' },
];

// Maps to site-theme status token classes
const orderStatusClass: Record<OrderStatus, string> = {
  Pending:    'order-status--pending',
  Processing: 'order-status--processing',
  Shipped:    'order-status--shipped',
  Delivered:  'order-status--delivered',
  Cancelled:  'order-status--cancelled',
  Returned:   'order-status--returned',
};

const paymentStatusClass: Record<PaymentStatus, string> = {
  Paid:     'payment-status--paid',
  Pending:  'payment-status--pending',
  Refunded: 'payment-status--refunded',
  Failed:   'payment-status--failed',
};


export default function OrdersListPage({
  title,
  subtitle,
  defaultStatus,
}: OrdersListPageProps) {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'All' | OrderStatus>(defaultStatus);
  const [selectedPayment, setSelectedPayment] = useState<'All' | PaymentStatus>('All');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const term = search.toLowerCase();
      const matchesSearch =
        order.orderId.toLowerCase().includes(term) ||
        order.customer.toLowerCase().includes(term) ||
        order.email.toLowerCase().includes(term) ||
        order.city.toLowerCase().includes(term);
      const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;
      const matchesPayment = selectedPayment === 'All' || order.paymentStatus === selectedPayment;
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [search, selectedStatus, selectedPayment]);

  const stats = [
    { label: 'Total Orders',      value: filteredOrders.length },
    { label: 'Revenue',           value: `₹${filteredOrders.reduce((s, o) => s + o.total, 0).toLocaleString()}` },
    { label: 'Paid Orders',       value: filteredOrders.filter(o => o.paymentStatus === 'Paid').length },
    { label: 'Returns / Cancels', value: filteredOrders.filter(o => o.status === 'Returned' || o.status === 'Cancelled').length },
  ];

  const toggleSelect = (id: number) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const allSelected =
    filteredOrders.length > 0 &&
    filteredOrders.every(o => selectedIds.includes(o.id));

  return (
<<<<<<< HEAD
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .orders-page {
          min-height: 100vh;
          padding: 24px;
          background: #f8fafc;
          font-family: 'DM Sans', sans-serif;
        }

        .orders-shell {
          max-width: 1400px;
          margin: 0 auto;
        }

        .orders-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .orders-heading h1 {
          margin: 0;
          font-size: 30px;
          line-height: 1.2;
          color: #0f172a;
          font-weight: 700;
        }

        .orders-heading p {
          margin: 6px 0 0;
          font-size: 15px;
          color: #64748b;
        }

        .orders-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .primary-btn,
        .secondary-btn,
        .bulk-btn,
        .small-btn,
        .small-btn-muted {
          border: none;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
        }

        .primary-btn {
          padding: 12px 18px;
          border-radius: 12px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          box-shadow: 0 10px 20px rgba(37, 99, 235, 0.22);
        }

        .secondary-btn {
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid #dbe4f0;
          background: #fff;
          color: #334155;
          font-size: 14px;
          font-weight: 600;
        }

        .primary-btn:hover,
        .secondary-btn:hover,
        .bulk-btn:hover,
        .small-btn:hover,
        .small-btn-muted:hover {
          transform: translateY(-1px);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: #fff;
          border-radius: 18px;
          padding: 20px;
          border: 1px solid #edf2f7;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
          min-width: 0;
        }

        .stat-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .stat-label {
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
        }

        .stat-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .stat-value {
          font-size: 30px;
          font-weight: 700;
          line-height: 1.1;
          word-break: break-word;
        }

        .filters-card {
          background: #fff;
          border-radius: 18px;
          padding: 16px;
          border: 1px solid #edf2f7;
          margin-bottom: 16px;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
        }

        .filters-row {
          display: grid;
          grid-template-columns: minmax(0, 2fr) repeat(2, minmax(180px, 1fr));
          gap: 12px;
        }

        .input,
        .select {
          width: 100%;
          height: 46px;
          border-radius: 12px;
          border: 1.5px solid #dbe4f0;
          background: #f8fafc;
          color: #334155;
          font-size: 14px;
          padding: 0 14px;
          outline: none;
          font-family: inherit;
        }

        .bulk-bar {
          background: #1e40af;
          color: #fff;
          border-radius: 14px;
          padding: 14px 16px;
          margin-bottom: 16px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
        }

        .bulk-text {
          font-size: 14px;
          font-weight: 600;
        }

        .bulk-btn {
          background: rgba(255, 255, 255, 0.16);
          color: #fff;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
        }

        .bulk-close {
          margin-left: auto;
          background: transparent;
          color: #fff;
          border: none;
          font-size: 22px;
          cursor: pointer;
        }

        .table-card {
          background: #fff;
          border-radius: 18px;
          border: 1px solid #edf2f7;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
        }

        .table-wrap {
          width: 100%;
          overflow-x: auto;
        }

        .orders-table {
          width: 100%;
          min-width: 1020px;
          border-collapse: collapse;
        }

        .orders-table thead tr {
          background: #f8fafc;
        }

        .orders-table th {
          padding: 14px 16px;
          text-align: left;
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          white-space: nowrap;
        }

        .orders-table td {
          padding: 16px;
          border-top: 1px solid #f1f5f9;
          vertical-align: middle;
        }

        .selected-row {
          background: #eff6ff;
        }

        .order-id {
          font-size: 13px;
          font-weight: 700;
          color: #2563eb;
        }

        .customer-name {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
        }

        .customer-email {
          margin-top: 3px;
          font-size: 12px;
          color: #94a3b8;
        }

        .muted-text {
          font-size: 13px;
          color: #64748b;
        }

        .strong-text {
          font-size: 14px;
          color: #0f172a;
          font-weight: 700;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 11px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          display: inline-block;
        }

        .action-group {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .small-btn {
          background: #eff6ff;
          color: #2563eb;
          border-radius: 8px;
          padding: 7px 12px;
          font-size: 12px;
          font-weight: 700;
        }

        .small-btn-muted {
          background: #f8fafc;
          color: #475569;
          border-radius: 8px;
          padding: 7px 12px;
          font-size: 12px;
          font-weight: 700;
        }

        .mobile-list {
          display: none;
          padding: 16px;
          gap: 14px;
        }

        .mobile-card {
          border: 1px solid #eef2f7;
          border-radius: 16px;
          padding: 16px;
          background: #fff;
        }

        .mobile-card.selected {
          background: #eff6ff;
          border-color: #bfdbfe;
        }

        .mobile-top {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: flex-start;
          margin-bottom: 14px;
        }

        .mobile-title-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          min-width: 0;
        }

        .mobile-checkbox {
          margin-top: 2px;
          flex-shrink: 0;
        }

        .mobile-order-id {
          font-size: 13px;
          font-weight: 700;
          color: #2563eb;
          margin-bottom: 4px;
        }

        .mobile-meta {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 14px;
        }

        .mobile-meta-item {
          min-width: 0;
        }

        .mobile-meta-label {
          font-size: 11px;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 4px;
          font-weight: 700;
        }

        .mobile-meta-value {
          font-size: 13px;
          color: #0f172a;
          font-weight: 600;
          word-break: break-word;
        }

        .mobile-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 14px;
        }

        .mobile-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .empty-state {
          padding: 56px 20px;
          text-align: center;
          color: #94a3b8;
        }

        .empty-icon {
          font-size: 42px;
          margin-bottom: 10px;
        }

        .empty-title {
          font-size: 16px;
          font-weight: 700;
          color: #334155;
        }

        .empty-subtitle {
          font-size: 13px;
          margin-top: 6px;
        }

        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .orders-page {
            padding: 18px;
          }

          .filters-row {
            grid-template-columns: 1fr;
          }

          .orders-heading h1 {
            font-size: 26px;
          }
        }

        @media (max-width: 768px) {
          .orders-page {
            padding: 14px;
          }

          .orders-header {
            flex-direction: column;
            align-items: stretch;
          }

          .orders-actions {
            width: 100%;
          }

          .orders-actions button {
            flex: 1;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .table-wrap {
            display: none;
          }

          .mobile-list {
            display: grid;
          }

          .bulk-close {
            margin-left: 0;
          }
        }

        @media (max-width: 480px) {
          .orders-heading h1 {
            font-size: 22px;
          }

          .orders-heading p {
            font-size: 14px;
          }

          .mobile-meta {
            grid-template-columns: 1fr;
          }

          .primary-btn,
          .secondary-btn {
            width: 100%;
          }

          .stat-card,
          .filters-card,
          .mobile-card {
            border-radius: 14px;
          }
        }
      `}</style>

      <div className="orders-page">
        <div className="orders-shell">
          <div className="orders-header">
            <div className="orders-heading">
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>

            <div className="orders-actions">
              <button className="site-btn site-btn-primary">Export</button>
              {/* <button className="primary-btn">+ Create Order</button> */}
            </div>
=======
    <div className="site-page site-page-padding">
      <div className="orders-shell">

        {/* ── Header ── */}
        <div className="site-page-header">
          <div>
            <h1 className="site-page-title">{title}</h1>
            <p className="site-page-subtitle">{subtitle}</p>
>>>>>>> main
          </div>
          <div className="orders-actions">
            <button className="site-btn site-btn-ghost site-btn-sm">Export</button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="orders-stats-grid">
          {stats.map(stat => (
            <div key={stat.label} className="site-card orders-stat-card">
              <div className="orders-stat-top">
                <span className="orders-stat-label site-subtext">{stat.label}</span>
              </div>
              <div className="orders-stat-value site-text-brand">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="site-card orders-filters-card">
          <div className="orders-filters-row">
            <div className="site-search-wrap">
              <i className="ti ti-search site-search-icon" aria-hidden="true" />
              <input
                className="site-input"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search order ID, customer, email, city…"
              />
            </div>
            <select
              className="site-input"
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value as 'All' | OrderStatus)}
            >
              {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'].map(s => (
                <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
              ))}
            </select>
            <select
              className="site-input"
              value={selectedPayment}
              onChange={e => setSelectedPayment(e.target.value as 'All' | PaymentStatus)}
            >
              {['All', 'Paid', 'Pending', 'Refunded', 'Failed'].map(s => (
                <option key={s} value={s}>{s === 'All' ? 'All Payments' : s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Bulk Action Bar ── */}
        {selectedIds.length > 0 && (
          <div className="orders-bulk-bar">
            <span className="orders-bulk-text">{selectedIds.length} selected</span>
            <button className="orders-bulk-btn">Mark Shipped</button>
            <button className="orders-bulk-btn">Print Labels</button>
            <button className="orders-bulk-close" onClick={() => setSelectedIds([])}>×</button>
          </div>
        )}

        {/* ── Table Card ── */}
        <div className="site-card orders-table-card">
          {filteredOrders.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="orders-table-wrap">
                <table className="site-table orders-table">
                  <thead>
                    <tr>
                      <th style={{ width: '44px' }}>
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={e => setSelectedIds(e.target.checked ? filteredOrders.map(o => o.id) : [])}
                        />
                      </th>
                      {['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Payment', 'Status', 'City', 'Actions'].map(h => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => {
                      const isSelected = selectedIds.includes(order.id);
                      return (
                        <tr key={order.id} className={isSelected ? 'orders-row--selected' : ''}>
                          <td>
                            <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(order.id)} />
                          </td>
                          <td>
                            <span className="orders-order-id">{order.orderId}</span>
                          </td>
                          <td>
                            <div className="orders-customer-name">{order.customer}</div>
                            <div className="orders-customer-email">{order.email}</div>
                          </td>
                          <td className="site-subtext" style={{ fontSize: '13px' }}>{order.date}</td>
                          <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{order.items}</td>
                          <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>₹{order.total.toLocaleString()}</td>
                          <td>
                            <span className={`site-badge orders-payment-badge ${paymentStatusClass[order.paymentStatus]}`}>
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td>
                            <span className={`site-badge orders-status-badge ${orderStatusClass[order.status]}`}>
                              <span className="site-badge-dot" />
                              {order.status}
                            </span>
                          </td>
                          <td className="site-subtext" style={{ fontSize: '13px' }}>{order.city}</td>
                          <td>
                            <div className="orders-action-group">
                              <button className="site-btn site-btn-outline site-btn-sm">View</button>
                              <button className="site-btn site-btn-ghost site-btn-sm">Update</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="orders-mobile-list">
                {filteredOrders.map(order => {
                  const isSelected = selectedIds.includes(order.id);
                  return (
                    <div key={order.id} className={`orders-mobile-card ${isSelected ? 'orders-mobile-card--selected' : ''}`}>
                      <div className="orders-mobile-top">
                        <div className="orders-mobile-title-row">
                          <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(order.id)} />
                          <div>
                            <div className="orders-order-id">{order.orderId}</div>
                            <div className="orders-customer-name">{order.customer}</div>
                            <div className="orders-customer-email">{order.email}</div>
                          </div>
                        </div>
                      </div>
                      <div className="orders-mobile-meta">
                        {[
                          { label: 'Date', value: order.date },
                          { label: 'City', value: order.city },
                          { label: 'Items', value: String(order.items) },
                          { label: 'Total', value: `₹${order.total.toLocaleString()}` },
                        ].map(({ label, value }) => (
                          <div key={label} className="orders-mobile-meta-item">
                            <div className="orders-mobile-meta-label site-label-xs">{label}</div>
                            <div className="orders-mobile-meta-value site-heading">{value}</div>
                          </div>
                        ))}
                      </div>
                      <div className="orders-mobile-badges">
                        <span className={`site-badge orders-payment-badge ${paymentStatusClass[order.paymentStatus]}`}>
                          {order.paymentStatus}
                        </span>
                        <span className={`site-badge orders-status-badge ${orderStatusClass[order.status]}`}>
                          <span className="site-badge-dot" />
                          {order.status}
                        </span>
                      </div>
                      <div className="orders-action-group">
                        <button className="site-btn site-btn-outline site-btn-sm">View</button>
                        <button className="site-btn site-btn-ghost site-btn-sm">Update</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="site-empty-state">
              <div className="site-empty-icon">📭</div>
              <p className="site-empty-title">No orders found</p>
              <p className="site-empty-desc">Try changing your search or filters</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}