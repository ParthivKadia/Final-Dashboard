import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/shared/stores/useAppStore';
import { useOrderStore } from '@/shared/stores/useOrderStore';
import type { OrderStatus, PaymentStatus } from '@/shared/types/store';
import { Mail } from 'lucide-react';

type OrdersListPageProps = {
  title: string;
  subtitle: string;
  defaultStatus: 'All' | OrderStatus;
};

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

const PAGE_SIZE = 10;

export default function OrdersListPage({
  title,
  subtitle,
  defaultStatus,
}: OrdersListPageProps) {
  const navigate = useNavigate();
  const { activeStore } = useAppStore();
  const { fetchOrders, getOrders } = useOrderStore();

  const storeUsername = activeStore?.username ?? '';

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'All' | OrderStatus>(defaultStatus);
  const [selectedPayment, setSelectedPayment] = useState<'All' | PaymentStatus>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const loadOrders = useCallback(async (page: number, force = false) => {
    if (!storeUsername) return;
    const key = {
      username: storeUsername,
      page,
      pageSize: PAGE_SIZE,
      status: selectedStatus === 'All' ? undefined : selectedStatus,
      paymentStatus: selectedPayment === 'All' ? undefined : selectedPayment,
      search: search || undefined,
    };
    const result = await fetchOrders(key, force);
    return result;
  }, [storeUsername, fetchOrders, selectedStatus, selectedPayment, search]);

  useEffect(() => {
    if (storeUsername) {
      loadOrders(currentPage);
    }
  }, [storeUsername, currentPage, loadOrders]);

  const cachedData = getOrders({
    username: storeUsername,
    page: currentPage,
    pageSize: PAGE_SIZE,
    status: selectedStatus === 'All' ? undefined : selectedStatus,
    paymentStatus: selectedPayment === 'All' ? undefined : selectedPayment,
    search: search || undefined,
  });

  const orders = cachedData?.orders ?? [];
  const total = cachedData?.total ?? 0;
  const hasMore = cachedData?.hasMore ?? false;
  const loading = Object.values(fetchOrders({ username: storeUsername, page: currentPage, pageSize: PAGE_SIZE }) || {})[0] === true;

  const stats = [
    { label: 'Total Orders',      value: total },
    { label: 'Revenue',           value: `₹${orders.reduce((s, o) => s + o.total, 0).toLocaleString()}` },
    { label: 'Paid Orders',       value: orders.filter(o => o.paymentStatus === 'Paid').length },
    { label: 'Returns / Cancels', value: orders.filter(o => o.status === 'Returned' || o.status === 'Cancelled').length },
  ];

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const toggleSelect = (id: string) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const allSelected = orders.length > 0 && orders.every(o => selectedIds.includes(o.id));

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    setSelectedIds([]);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value as 'All' | OrderStatus);
    setCurrentPage(1);
    setSelectedIds([]);
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPayment(e.target.value as 'All' | PaymentStatus);
    setCurrentPage(1);
    setSelectedIds([]);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSelectedIds([]);
    }
  };

  const handleRefresh = async () => {
    await loadOrders(currentPage, true);
  };

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
            <button className="site-btn site-btn-ghost site-btn-sm" onClick={handleRefresh} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh'}
            </button>
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
                onChange={handleSearchChange}
                placeholder="Search order ID, customer, email, city…"
              />
            </div>
            <select
              className="site-input"
              value={selectedStatus}
              onChange={handleStatusChange}
            >
              {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'].map(s => (
                <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
              ))}
            </select>
            <select
              className="site-input"
              value={selectedPayment}
              onChange={handlePaymentChange}
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
          {loading && orders.length === 0 ? (
            <div className="orders-table-wrap">
              <table className="site-table orders-table">
                <thead>
                  <tr>
                    <th style={{ width: '44px' }}><input type="checkbox" disabled /></th>
                    {['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Payment', 'Status', 'City', 'Actions'].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td><input type="checkbox" disabled /></td>
                      <td><div className="site-skeleton site-skeleton-block h-4 w-24" /></td>
                      <td><div className="orders-customer-name site-skeleton site-skeleton-block h-4 w-32" /></td>
                      <td><div className="site-skeleton site-skeleton-block h-4 w-16" /></td>
                      <td><div className="site-skeleton site-skeleton-block h-4 w-20" /></td>
                      <td><div className="site-skeleton site-skeleton-block h-4 w-24" /></td>
                      <td><div className="site-skeleton site-skeleton-block h-4 w-16" /></td>
                      <td><div className="site-skeleton site-skeleton-block h-4 w-20" /></td>
                      <td><div className="site-skeleton site-skeleton-block h-6 w-28" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : orders.length > 0 ? (
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
                          onChange={e => setSelectedIds(e.target.checked ? orders.map(o => o.id) : [])}
                        />
                      </th>
                      {['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Payment', 'Status', 'City', 'Actions'].map(h => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => {
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
                          <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{order.itemCount}</td>
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
                              <button
                                className="site-btn site-btn-outline site-btn-sm"
                                onClick={() => navigate(`/orders/${order.id}`)}
                              >
                                View
                              </button>
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
                {orders.map(order => {
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
                          { label: 'Items', value: String(order.itemCount) },
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
                        <button
                          className="site-btn site-btn-outline site-btn-sm"
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          View
                        </button>
                        <button className="site-btn site-btn-ghost site-btn-sm">Update</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="site-empty-state">
              <Mail className="site-empty-icon w-12 h-12 text-muted-foreground" aria-hidden="true" />
              <p className="site-empty-title">No orders found</p>
              <p className="site-empty-desc">Try changing your search or filters</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 site-border-top">
              <span className="text-sm site-subtext">
                Showing {orders.length} of {total} orders
              </span>
              <div className="site-pagination">
                <button className="site-page-btn" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>←</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(n => n === 1 || n === totalPages || Math.abs(n - currentPage) <= 1)
                  .reduce<(number | '...')[]>((acc, n, i, arr) => {
                    if (i > 0 && n - (arr[i - 1] as number) > 1) acc.push('...');
                    acc.push(n); return acc;
                  }, [])
                  .map((n, i) => n === '...'
                    ? <span key={`e${i}`} className="w-8 text-center site-text-muted">…</span>
                    : <button key={n} className={`site-page-btn ${currentPage === n ? 'site-page-btn--active' : ''}`} onClick={() => handlePageChange(n as number)}>{n}</button>
                  )}
                <button className="site-page-btn" disabled={!hasMore || currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>→</button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}