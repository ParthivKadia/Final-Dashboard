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
    <div className="site-page site-page-padding">
      <div className="orders-shell">

        {/* ── Header ── */}
        <div className="site-page-header">
          <div>
            <h1 className="site-page-title">{title}</h1>
            <p className="site-page-subtitle">{subtitle}</p>
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