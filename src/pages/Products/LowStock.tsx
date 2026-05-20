// src/pages/Products/LowStock.tsx

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { useProductStore } from '../../store/useProductStore';
import { useCategoryStore } from '../../store/useCategoryStore';
import { useAuth } from '../../hooks/useAuth';
import { updateProduct } from '../../services/productService';
import type { Product, Store, UpdateProductRequestBody } from '../../types/store';
import { MobileDrawerRow, DrawerField } from '../../components/common/MobileDrawer';

// ─── Constants ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 50;

// Stock thresholds (per product requirement):
//   stock === 0              → 'out'      (Out of Stock)
//   stock > 0 && stock < 10 → 'critical' (Low Stock, needs attention)
//   stock >= 10 (healthy)   → filtered out of this page entirely
const LOW_STOCK_MAX = 9;  // stock 1–9  → shown on this page (low stock); stock ≥ 10 → healthy, excluded
const CRITICAL_MAX  = 4;  // stock 1–4  → 'critical'; stock 5–9 → 'warning'; stock 0 / !inStock → 'out'

// ─── Types ─────────────────────────────────────────────────────────────────────

type Urgency    = 'out' | 'critical' | 'warning';
type FilterType = 'all' | Urgency;

type LowStockItem = {
  id:             string;
  name:           string;
  sku:            string;
  slug:           string;
  category:       string;
  stock:          number;
  inStock:        boolean;
  price:          number;
  compareAtPrice: number;
  currency:       string;
  imageUrl:       string;
  images:         string[];
  categoryIds:    number[];
  isFeatured:     boolean;
  tags:           string[];
  description:    string;
  urgency:        Urgency;
  daysLeft:       number;
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Urgency classification:
 *  out      → stock === 0 OR inStock flag is false
 *  critical → stock 1–CRITICAL_MAX  (1–4)
 *  warning  → stock CRITICAL_MAX+1 – LOW_STOCK_MAX  (5–9)
 */
function getUrgency(stock: number, inStock: boolean): Urgency {
  if (!inStock || stock === 0) return 'out';       // stock = 0 or flag off → Out of Stock
  if (stock <= CRITICAL_MAX)   return 'critical';  // stock 1–4             → Critical
  return 'warning';                                // stock 5–9             → Low Stock (warning)
}

function estimateDaysLeft(stock: number, urgency: Urgency): number {
  if (urgency === 'out')      return 0;
  if (urgency === 'critical') return Math.max(1, Math.round(stock * 0.6));
  return Math.max(1, Math.round(stock * 1.2));
}

function suggestedReorderQty(): number {
  return 50; // sensible flat default — merchant can adjust in modal
}

/**
 * Only include a product if:
 *  - inStock is false, OR
 *  - stock === 0, OR
 *  - stock is between 1 and LOW_STOCK_MAX (inclusive)
 */
function toDisplayItem(p: Product, catMap: Map<number, string>): LowStockItem | null {
  const isHealthy = p.inStock && p.stockCount > LOW_STOCK_MAX;
  if (isHealthy) return null;

  const urgency = getUrgency(p.stockCount, p.inStock);

  const categoryNames = (p.categoryIds ?? [])
    .map(id => catMap.get(id) ?? '')
    .filter(Boolean)
    .join(', ') || '—';

  return {
    id:             p.id,
    name:           p.name,
    sku:            p.slug.toUpperCase().replace(/-/g, '').slice(0, 8),
    slug:           p.slug,
    category:       categoryNames,
    stock:          p.stockCount,
    inStock:        p.inStock,
    price:          p.price,
    compareAtPrice: p.compareAtPrice ?? 0,
    currency:       p.currency ?? 'INR',
    imageUrl:       p.imageUrl ?? '',
    images:         p.images ?? [],
    categoryIds:    p.categoryIds ?? [],
    isFeatured:     p.isFeatured ?? false,
    tags:           p.tags ?? [],
    description:    p.description ?? '',
    urgency,
    daysLeft: estimateDaysLeft(p.stockCount, urgency),
  };
}

// ─── Urgency Config ────────────────────────────────────────────────────────────

const URGENCY_CONFIG: Record<Urgency, {
  label:       string;
  badgeCls:    string;      // maps to site-badge--* CSS class
  borderColor: string;
  barColor:    string;
  priority:    string;
  dotStyle:    React.CSSProperties;
}> = {
  out: {
    label:       'Out of Stock',
    badgeCls:    'site-badge--out',
    borderColor: 'rgba(240,68,56,0.25)',
    barColor:    'var(--status-out-dot)',
    priority:    'P0',
    dotStyle:    { backgroundColor: 'var(--status-out-dot)' },
  },
  critical: {
    label:       'Critical',
    badgeCls:    'site-badge--low',
    borderColor: 'rgba(247,144,9,0.30)',
    barColor:    'var(--status-low-dot)',
    priority:    'P1',
    dotStyle:    { backgroundColor: 'var(--status-low-dot)' },
  },
  warning: {
    label:       'Low Stock',
    badgeCls:    'site-badge--featured',
    borderColor: 'rgba(247,144,9,0.18)',
    barColor:    'var(--featured-color)',
    priority:    'P2',
    dotStyle:    { backgroundColor: 'var(--featured-color)' },
  },
};

// ─── Store Switcher ────────────────────────────────────────────────────────────

function StoreSwitcher({
  stores, activeStore, setActiveStore, onSwitch, storeUsername,
}: {
  stores:         Store[];
  activeStore:    Store | null;
  setActiveStore: (s: Store) => void;
  onSwitch:       (store: Store) => void;
  storeUsername:  string;
}) {
  const [open, setOpen] = useState(false);

  if (stores.length <= 1) {
    return (
      <p className="site-page-subtitle">
        {storeUsername ? `@${storeUsername} · ` : ''}Monitor and restock before you run out
      </p>
    );
  }

  return (
    <div className="relative mt-1.5">
      <button className="site-store-trigger" onClick={() => setOpen(v => !v)}>
        {activeStore?.logoUrl && (
          <img src={activeStore.logoUrl} alt="" className="w-4 h-4 rounded-full object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        )}
        <span className="site-subtext">@{activeStore?.username}</span>
        <span className="site-badge site-badge--brand">{stores.length} stores</span>
        <span className="site-text-muted text-xs">▾</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[100]" onClick={() => setOpen(false)} />
          <div className="site-dropdown">
            <p className="site-dropdown-label">Switch Store</p>
            {stores.map(store => (
              <button key={store.id}
                className={`site-dropdown-item ${activeStore?.id === store.id ? 'site-dropdown-item--active' : ''}`}
                onClick={() => { setActiveStore(store); setOpen(false); onSwitch(store); }}>
                <div className="site-thumb site-thumb-sm"
                  style={{ borderRadius: '0.75rem', width: '2rem', height: '2rem' }}>
                  {store.logoUrl
                    ? <img src={store.logoUrl} alt={store.name} className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    : <span className="text-base">🏪</span>
                  }
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-semibold truncate ${activeStore?.id === store.id ? 'site-text-brand' : 'site-heading'}`}>
                    {store.name}
                  </p>
                  <p className="text-xs truncate site-subtext">@{store.username}</p>
                </div>
                {activeStore?.id === store.id && <span className="text-xs font-bold site-text-brand">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Reorder Modal ─────────────────────────────────────────────────────────────

function ReorderModal({
  item, qty, onQtyChange, onClose, onConfirm, saving, error,
}: {
  item:        LowStockItem;
  qty:         string;
  onQtyChange: (v: string) => void;
  onClose:     () => void;
  onConfirm:   (qty: number) => void;
  saving:      boolean;
  error:       string | null;
}) {
  const num = Number(qty);
  const uc  = URGENCY_CONFIG[item.urgency];

  return (
    <div className="site-modal-overlay">
      <div className="site-modal site-modal-sm">
        <div className="site-modal-header">
          <div>
            <h2 className="h3 site-heading">Place Reorder</h2>
            <p className="text-xs site-text-muted mt-0.5">{item.name}</p>
          </div>
          <button className="site-btn-icon" onClick={onClose}>×</button>
        </div>

        <div className="site-modal-body space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`site-badge ${uc.badgeCls}`}>
              <span className="site-badge-dot" style={uc.dotStyle} />
              {uc.priority} · {uc.label}
            </span>
            {item.daysLeft === 0
              ? <span className="text-xs font-bold text-[var(--status-out-text)]">Gone</span>
              : <span className="text-xs site-text-muted">{item.daysLeft} days of stock left</span>
            }
          </div>

          <div className="space-y-2 rounded-xl p-4"
            style={{ backgroundColor: 'var(--surface-secondary)' }}>
            {[
              { label: 'SKU',           value: item.sku,                          cls: 'site-mono'                     },
              { label: 'Current Stock', value: `${item.stock} units`,             cls: 'text-[var(--status-out-text)]' },
              { label: 'Unit Price',    value: `₹${item.price.toLocaleString()}`, cls: 'site-text-brand font-bold'     },
            ].map(row => (
              <div key={row.label} className="flex justify-between items-center">
                <span className="text-xs site-text-muted">{row.label}</span>
                <span className={`text-sm font-semibold site-heading ${row.cls}`}>{row.value}</span>
              </div>
            ))}
          </div>

          <div>
            <label className="site-label">Reorder Quantity</label>
            <input
              type="number" min="1" value={qty}
              onChange={e => onQtyChange(e.target.value)}
              className="site-input"
            />
            {num > 0 && (
              <div className="site-price-save mt-2">
                <span>🧾</span>
                <div>
                  <p className="font-bold text-sm">Total: ₹{(num * item.price).toLocaleString()}</p>
                  <p className="text-xs font-normal" style={{ color: 'var(--success-text)', opacity: 0.8 }}>
                    {num} units × ₹{item.price.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {error && <div className="site-banner site-banner-error text-sm">⚠️ {error}</div>}
        </div>

        <div className="site-modal-footer">
          <button className="site-btn site-btn-ghost flex-1" onClick={onClose} disabled={saving}>Cancel</button>
          <button
            className="site-btn site-btn-primary flex-1"
            onClick={() => onConfirm(num)}
            disabled={saving || num <= 0}
          >
            {saving ? <><span className="site-spinner" /> Updating…</> : 'Confirm Restock'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function LowStock() {
  const navigate        = useNavigate();
  const { isVerifying } = useAuth();

  const { stores, activeStore, setActiveStore }  = useAppStore();
  const { fetchPage, invalidate }                = useProductStore();
  const { fetchCategories, getCategories }       = useCategoryStore();

  const storeUsername    = activeStore?.username ?? '';
  // const cachedCategories = getCategories(storeUsername) ?? [];
  // Build category display map for resolved category names
  // const catMap = new Map<number, string>(cachedCategories.map(c => [c.id, c.name]));

  // ── State ──────────────────────────────────────────────────────────────────
  const [items, setItems]           = useState<LowStockItem[]>([]);
  const [loading, setLoading]       = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter]     = useState<FilterType>('all');

  const [reorderItem, setReorderItem]     = useState<LowStockItem | null>(null);
  const [reorderQty, setReorderQty]       = useState('');
  const [reorderSaving, setReorderSaving] = useState(false);
  const [reorderError, setReorderError]   = useState<string | null>(null);

  // ── Fetch categories (same pattern as Inventory.tsx) ───────────────────────

  useEffect(() => {
    if (storeUsername) fetchCategories(storeUsername);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeUsername]);

  // ── Fetch products ─────────────────────────────────────────────────────────
  // useCallback deps intentionally exclude getCategories/cacheErrors — both
  // change on every render and would cause infinite re-fetch loops.

  const fetchLowStock = useCallback(async (force = false) => {
    if (!storeUsername) return;
    setLoading(true);
    setFetchError(null);

    const result = await fetchPage(
      { username: storeUsername, page: 1, pageSize: PAGE_SIZE },
      force,
    );

    if (result) {
      // Read categories at call-time so we always have the freshest map
      const freshCatMap = new Map<number, string>(
        (getCategories(storeUsername) ?? []).map(c => [c.id, c.name]),
      );

      const lowItems = result.products
        .map(p => toDisplayItem(p, freshCatMap))
        .filter((x): x is LowStockItem => x !== null)
        .sort((a, b) => {
          const order: Record<Urgency, number> = { out: 0, critical: 1, warning: 2 };
          const diff = order[a.urgency] - order[b.urgency];
          return diff !== 0 ? diff : a.daysLeft - b.daysLeft;
        });

      setItems(lowItems);
    } else {
      setFetchError('Failed to load low stock items. Please try again.');
    }

    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeUsername, fetchPage]);

  useEffect(() => {
    if (storeUsername && !isVerifying) fetchLowStock();
  }, [storeUsername, isVerifying, fetchLowStock]);

  // ── Store switch ───────────────────────────────────────────────────────────

  const switchStore = (store: Store) => {
    setActiveStore(store);
    setItems([]); setFetchError(null);
    setSelected([]); setFilter('all');
    setReorderItem(null);
  };

  // ── Derived counts ─────────────────────────────────────────────────────────

  const outCount      = items.filter(i => i.urgency === 'out').length;
  const criticalCount = items.filter(i => i.urgency === 'critical').length;
  const warningCount  = items.filter(i => i.urgency === 'warning').length;

  const filtered = items.filter(i => filter === 'all' || i.urgency === filter);

  const totalReorderValue = items.reduce(
    (s, i) => s + i.price * suggestedReorderQty(), 0,
  );

  // ── Selection ──────────────────────────────────────────────────────────────

  const toggleSelect = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  // ── Reorder ────────────────────────────────────────────────────────────────

  const openReorder = (item: LowStockItem) => {
    setReorderError(null);
    setReorderQty(String(suggestedReorderQty()));
    setReorderItem(item);
  };

  const closeReorder = () => { setReorderItem(null); setReorderError(null); };

  const confirmReorder = async (qty: number) => {
    if (!reorderItem) return;
    setReorderSaving(true);
    setReorderError(null);

    const item = reorderItem;
    const body: UpdateProductRequestBody = {
      name:           item.name,
      slug:           item.slug,
      description:    item.description,
      price:          item.price,
      compareAtPrice: item.compareAtPrice,
      currency:       item.currency,
      imageUrl:       item.imageUrl,
      images:         item.images,
      categoryIds:    item.categoryIds,
      inStock:        true,
      stockCount:     item.stock + qty,
      isFeatured:     item.isFeatured,
      tags:           item.tags,
    };

    try {
      await updateProduct(storeUsername, item.slug, body);
      invalidate(storeUsername);

      const newStock   = item.stock + qty;
      const newUrgency = getUrgency(newStock, true);

      setItems(prev =>
        prev
          .map(i => i.id !== item.id ? i : {
            ...i,
            stock:    newStock,
            inStock:  true,
            urgency:  newUrgency,
            daysLeft: estimateDaysLeft(newStock, newUrgency),
          })
          // Drop from list once stock is healthy (> LOW_STOCK_MAX)
          .filter(i => !i.inStock || i.stock <= LOW_STOCK_MAX),
      );

      setReorderItem(null);
    } catch (err: any) {
      setReorderError(err?.message || 'Failed to update stock. Please try again.');
    } finally {
      setReorderSaving(false);
    }
  };

  // ── Filter tabs ────────────────────────────────────────────────────────────

  const FILTER_TABS: { id: FilterType; label: string; count: number }[] = [
    { id: 'all',      label: 'All',          count: items.length  },
    { id: 'out',      label: 'Out of Stock', count: outCount      },
    { id: 'critical', label: 'Critical',     count: criticalCount },
    { id: 'warning',  label: 'Low Stock',    count: warningCount  },
  ];

  // ── Guard ──────────────────────────────────────────────────────────────────

  if (isVerifying) return (
    <div className="site-page flex items-center justify-center h-screen">
      <p className="text-sm site-subtext">Loading…</p>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="site-page site-page-padding">

      {/* ── Urgent alert banner ── */}
      {!loading && (outCount > 0 || criticalCount > 0) && (
        <div className="site-banner site-banner-error mb-5 flex-col sm:flex-row items-start sm:items-center">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-2xl shrink-0">🚨</span>
            <div className="min-w-0">
              <p className="font-bold text-sm">Urgent Restock Needed</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--danger-text)', opacity: 0.85 }}>
                {outCount > 0 && `${outCount} item${outCount > 1 ? 's' : ''} out of stock`}
                {outCount > 0 && criticalCount > 0 && ' · '}
                {criticalCount > 0 && `${criticalCount} critically low`}. Act now to prevent lost sales.
              </p>
            </div>
          </div>
          <button
            className="site-btn site-btn-sm shrink-0 mt-2 sm:mt-0"
            style={{ backgroundColor: 'var(--danger-solid)', color: '#fff', border: 'none' }}
            onClick={() => setFilter('out')}
          >
            View Out of Stock →
          </button>
        </div>
      )}

      {/* ── Header ── */}
      <div className="site-page-header">
        <div>
          <h1 className="site-page-title">Low Stock Alerts</h1>
          <StoreSwitcher
            stores={stores} activeStore={activeStore}
            setActiveStore={setActiveStore} onSwitch={switchStore}
            storeUsername={storeUsername}
          />
        </div>
        <div className="flex gap-2 flex-wrap shrink-0">
          <button className="site-btn site-btn-ghost site-btn-sm" onClick={() => fetchLowStock(true)}>
            Refresh
          </button>
          <button className="site-btn site-btn-primary site-btn-sm" onClick={() => navigate('/products/add')}>
            + Add Stock
          </button>
        </div>
      </div>

      {/* ── Error banner ── */}
      {fetchError && !loading && (
        <div className="site-banner site-banner-error mb-5">
          <span>⚠️ {fetchError}</span>
          <button className="text-xs font-semibold underline ml-4"
            onClick={() => fetchLowStock(true)}>Retry</button>
        </div>
      )}

      {/* ── Stats — identical markup/classes to Inventory.tsx ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5">
        {[
          {
            label:   'Out of Stock',
            value:   loading ? '—' : outCount,
            // key:     'out',
            // onClick: () => setFilter('out'),
          },
          {
            label:   'Critical',
            value:   loading ? '—' : criticalCount,
            // key:     'critical',
            // onClick: () => setFilter('critical'),
          },
          {
            label:   'Low Stock',
            value:   loading ? '—' : warningCount,
            // key:     'warning',
            // onClick: () => setFilter('warning'),
          },
          {
            label:   'Reorder Value',
            value:   loading ? '—' : `₹${(totalReorderValue / 1000).toFixed(1)}K`,
            // key:     'value',
            // onClick: undefined,
          },
        ].map(s => (
          <div
            // key={s.key}
            className={`site-stat-card`}
            // onClick={s.onClick}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="site-stat-card-label">{s.label}</span>
              {/* {s.badge} */}
            </div>
            {loading
              ? <div className="site-skeleton site-skeleton-block h-8 w-16 rounded" />
              : <p className="site-stat-card-value">{s.value}</p>
            }
          </div>
        ))}
      </div>

      {/* ── Filter tabs ── */}
      <div className="site-tabs mb-4" style={{ width: 'fit-content', maxWidth: '100%' }}>
        {FILTER_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`site-tab ${filter === tab.id ? 'site-tab--active' : ''}`}
            style={{ minWidth: 'auto', padding: '0.5rem 0.875rem' }}
          >
            {tab.label}
            <span
              className="ml-1.5 text-[11px] font-bold px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: filter === tab.id ? 'rgba(255,255,255,0.25)' : 'var(--surface-secondary)',
                color:           filter === tab.id ? '#fff' : 'var(--text-muted)',
              }}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── Bulk action bar ── */}
      {selected.length > 0 && (
        <div className="site-banner site-banner-info mb-3 flex items-center gap-4 flex-wrap">
          <span className="text-sm font-medium">{selected.length} item{selected.length > 1 ? 's' : ''} selected</span>
          <button className="site-btn site-btn-sm site-btn-ghost">🔄 Bulk Reorder</button>
          <button className="ml-auto text-xl leading-none site-text-muted" onClick={() => setSelected([])}>×</button>
        </div>
      )}

      {/* ── Loading skeletons ── */}
      {loading && (
        <div className="site-card overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="site-skeleton-row">
              <div className="site-skeleton site-skeleton-block"
                style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.75rem', flexShrink: 0 }} />
              <div className="flex-1 space-y-2">
                <div className="site-skeleton site-skeleton-block h-3.5 w-48" />
                <div className="site-skeleton site-skeleton-block h-2.5 w-24" />
              </div>
              <div className="site-skeleton site-skeleton-block h-3.5 w-16" />
              <div className="site-skeleton site-skeleton-block h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      )}

      {/* ── Items list ── */}
      {!loading && !fetchError && (
        <>
          {filtered.length === 0 ? (
            <div className="site-card">
              <div className="site-empty-state">
                {/* <div className="site-empty-icon">✅</div> */}
                <p className="site-empty-title">
                  {filter === 'all'
                    ? 'All items are well stocked!'
                    : `No items in "${URGENCY_CONFIG[filter as Urgency]?.label ?? filter}"`}
                </p>
                <p className="site-empty-desc">
                  {filter !== 'all'
                    ? 'Try switching to a different filter to see other items.'
                    : 'Keep monitoring your inventory regularly.'}
                </p>
                {filter !== 'all' && (
                  <button className="site-btn site-btn-outline site-btn-sm mt-4" onClick={() => setFilter('all')}>
                    View All Items
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="site-card overflow-hidden">

              {/* ── Desktop table (hidden on mobile) ── */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="site-table min-w-[720px]">
                  <thead>
                    <tr>
                      <th className="py-3 pl-4 w-10">
                        <input
                          type="checkbox"
                          className="rounded"
                          onChange={e => setSelected(e.target.checked ? filtered.map(i => i.id) : [])}
                        />
                      </th>
                      {['Product', 'Category', 'Stock', 'Status', 'Days Left', 'Reorder Cost', 'Actions'].map(h => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(item => {
                      const uc       = URGENCY_CONFIG[item.urgency];
                      const stockPct = item.urgency === 'out'
                        ? 0
                        : Math.min((item.stock / LOW_STOCK_MAX) * 100, 100);
                      const reorderQty = suggestedReorderQty();

                      return (
                        <tr
                          key={item.id}
                          style={{
                            borderLeft:      `3px solid ${uc.borderColor}`,
                            backgroundColor: selected.includes(item.id) ? 'rgba(26,86,219,0.04)' : undefined,
                          }}
                        >
                          <td className="py-3 pl-4">
                            <input
                              type="checkbox"
                              className="rounded"
                              checked={selected.includes(item.id)}
                              onChange={() => toggleSelect(item.id)}
                            />
                          </td>

                          {/* Product */}
                          <td>
                            <div className="flex items-center gap-2.5">
                              <div className="relative site-thumb shrink-0"
                                style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.75rem' }}>
                                {item.imageUrl
                                  ? <img src={item.imageUrl} alt={item.name}
                                      className="w-full h-full object-cover"
                                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                  : <span className="text-lg">📦</span>
                                }
                              </div>
                              <div>
                                <p className="text-sm font-semibold site-heading whitespace-nowrap">{item.name}</p>
                                <p className="text-[11px] site-mono site-text-muted">{item.sku}</p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td>
                            <span className="text-xs site-subtext px-2 py-1 rounded-lg block max-w-[140px] site-truncate"
                              style={{ backgroundColor: 'var(--surface-secondary)' }}
                              title={item.category}>
                              {item.category}
                            </span>
                          </td>

                          {/* Stock + progress */}
                          <td>
                            <div className="flex flex-col gap-1 min-w-[90px]">
                              <span className={`text-sm font-bold ${
                                item.stock === 0 ? 'text-[var(--status-out-text)]'
                                : item.urgency === 'critical' ? 'text-[var(--status-low-text)]'
                                : 'text-[var(--status-featured-text)]'
                              }`}>
                                {item.stock} units
                              </span>
                              <div className="site-progress-track" style={{ width: '80px' }}>
                                <div
                                  className="site-progress-bar"
                                  style={{ width: `${stockPct}%`, background: uc.barColor }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Status badge */}
                          <td>
                            <span className={`site-badge ${uc.badgeCls}`}>
                              <span className="site-badge-dot" style={uc.dotStyle} />
                              {uc.priority} · {uc.label}
                            </span>
                          </td>

                          {/* Days left */}
                          <td>
                            <span className={`text-sm font-bold ${
                              item.daysLeft === 0 ? 'text-[var(--status-out-text)]'
                              : item.daysLeft <= 3 ? 'text-[var(--status-low-text)]'
                              : 'text-[var(--status-featured-text)]'
                            }`}>
                              {item.daysLeft === 0 ? 'Gone' : `${item.daysLeft}d`}
                            </span>
                          </td>

                          {/* Reorder cost */}
                          <td>
                            <span className="text-sm font-semibold site-text-brand">
                              ₹{(item.price * reorderQty).toLocaleString()}
                            </span>
                            <p className="text-[11px] site-text-muted">{reorderQty} units</p>
                          </td>

                          {/* Actions */}
                          <td>
                            <div className="flex gap-1.5">
                              <button
                                className="site-btn site-btn-primary site-btn-sm"
                                onClick={() => openReorder(item)}
                              >
                                🔄 Restock
                              </button>
                              <button
                                className="site-btn site-btn-ghost site-btn-sm"
                                onClick={() => navigate('/products/inventory')}
                              >
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* ── Mobile card list (shown only on mobile) ── */}
              <div className="sm:hidden">
                {filtered.map(item => {
                  const uc         = URGENCY_CONFIG[item.urgency];
                  const reorderQty = suggestedReorderQty();
                  const stockPct   = item.urgency === 'out'
                    ? 0
                    : Math.min((item.stock / LOW_STOCK_MAX) * 100, 100);

                  return (
                    <MobileDrawerRow
                      key={item.id}
                      isSelected={selected.includes(item.id)}
                      onSelect={() => toggleSelect(item.id)}
                      thumb={
                        <div className="site-thumb shrink-0"
                          style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.625rem' }}>
                          {item.imageUrl
                            ? <img src={item.imageUrl} alt={item.name}
                                className="w-full h-full object-cover"
                                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            : <span className="text-xl">📦</span>
                          }
                        </div>
                      }
                      primary={item.name}
                      secondary={
                        <>
                          <span className="site-mono text-[11px]">{item.sku}</span>
                          <span className="mx-1 site-text-muted">·</span>
                          ₹{item.price.toLocaleString()}
                        </>
                      }
                      badge={
                        <span className={`site-badge ${uc.badgeCls}`}>
                          <span className="site-badge-dot" style={uc.dotStyle} />
                          {uc.label}
                        </span>
                      }
                      drawer={
                        <>
                          {/* Stock progress */}
                          <div className="flex items-center gap-2 mb-1">
                            <div className="site-progress-track flex-1">
                              <div
                                className="site-progress-bar"
                                style={{ width: `${stockPct}%`, background: uc.barColor }}
                              />
                            </div>
                            <span className="text-xs site-text-muted whitespace-nowrap">
                              {item.stock} / {LOW_STOCK_MAX} max
                            </span>
                          </div>

                          <div className="flex gap-2 flex-wrap">
                            <DrawerField label="Days Left">
                              <span className={
                                item.daysLeft === 0  ? 'text-[var(--status-out-text)] font-bold'
                                : item.daysLeft <= 3 ? 'text-[var(--status-low-text)] font-bold'
                                : 'text-[var(--status-featured-text)] font-bold'
                              }>
                                {item.daysLeft === 0 ? 'Gone' : `${item.daysLeft} days`}
                              </span>
                            </DrawerField>
                            <DrawerField label="Suggested Qty">{reorderQty} units</DrawerField>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <DrawerField label="Reorder Cost">
                              <span className="site-text-brand font-bold">
                                ₹{(item.price * reorderQty).toLocaleString()}
                              </span>
                            </DrawerField>
                            <DrawerField label="Category">{item.category}</DrawerField>
                          </div>

                          <div className="flex gap-2 pt-1">
                            <button
                              className="site-btn site-btn-primary site-btn-sm flex-1"
                              onClick={() => openReorder(item)}
                            >
                              🔄 Restock Now
                            </button>
                            <button
                              className="site-btn site-btn-ghost site-btn-sm"
                              onClick={() => navigate('/inventory')}
                            >
                              Edit
                            </button>
                          </div>
                        </>
                      }
                    />
                  );
                })}
              </div>

              {/* ── Footer summary ── */}
              {(outCount > 0 || criticalCount > 0 || warningCount > 0) && (
                <div
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 py-3 site-border-top"
                  style={{
                    backgroundColor: 'var(--status-featured-bg)',
                    borderTop: '1px solid rgba(247,144,9,0.30)',
                  }}
                >
                  <span className="text-lg shrink-0">⚠️</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--status-featured-text)' }}>
                    {outCount > 0 && `${outCount} out of stock`}
                    {outCount > 0 && criticalCount > 0 && ' · '}
                    {criticalCount > 0 && `${criticalCount} critical`}
                    {(outCount > 0 || criticalCount > 0) && warningCount > 0 && ' · '}
                    {warningCount > 0 && `${warningCount} low`}
                    {'. Consider restocking soon.'}
                  </span>
                  <button
                    className="sm:ml-auto shrink-0 site-btn site-btn-sm"
                    style={{ backgroundColor: 'var(--featured-color)', color: '#fff', border: 'none' }}
                    onClick={() => setFilter(outCount > 0 ? 'out' : 'critical')}
                  >
                    View Most Urgent →
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ── Reorder modal ── */}
      {reorderItem && (
        <ReorderModal
          item={reorderItem}
          qty={reorderQty}
          onQtyChange={setReorderQty}
          onClose={closeReorder}
          onConfirm={confirmReorder}
          saving={reorderSaving}
          error={reorderError}
        />
      )}
    </div>
  );
}