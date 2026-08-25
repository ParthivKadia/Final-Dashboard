// src/pages/Products/LowStock.tsx

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from "@/shared/stores/useAppStore";
import { useProductStore } from "@/shared/stores/useProductStore";
import { useCategoryStore } from "@/shared/stores/useCategoryStore";
import { useAuth } from "@/shared/hooks/useAuth";
import { updateProduct } from "@/shared/services/productService";
import type { Product, Store, UpdateProductRequestBody } from "@/shared/types/store";
import { MobileDrawerRow, DrawerField } from "@/shared/components/ui/MobileDrawer";
import { Store as StoreIcon } from "lucide-react";

// ─── Constants ─────────────────────────────────────────────────────────────────

export const PAGE_SIZE    = 50;
export const LOW_STOCK_MAX = 9;

// ─── Types ─────────────────────────────────────────────────────────────────────

export type Urgency    = 'out' | 'warning';
type FilterType = 'all' | Urgency;

// ─── Helpers ───────────────────────────────────────────────────────────────────

export function getUrgency(stock: number, inStock: boolean): Urgency {
  if (!inStock || stock === 0) return 'out';
  return 'warning';
}

function estimateDaysLeft(stock: number, urgency: Urgency): number {
  if (urgency === 'out') return 0;
  return Math.max(1, Math.round(stock * 1.2));
}

function suggestedReorderQty(): number {
  return 50;
}

export function resolveCategory(categoryIds: number[], catMap: Map<number, string>): string {
  return (categoryIds ?? [])
    .map(id => catMap.get(id) ?? '')
    .filter(Boolean)
    .join(', ') || '—';
}

// ─── Urgency Config ────────────────────────────────────────────────────────────

const URGENCY_CONFIG: Record<Urgency, {
  label:       string;
  badgeCls:    string;
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
  warning: {
    label:       'Low Stock',
    badgeCls:    'site-badge--low',
    borderColor: 'rgba(247,144,9,0.18)',
    barColor:    'var(--status-low-dot)',
    priority:    'P1',
    dotStyle:    { backgroundColor: 'var(--status-low-dot)' },
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
                    : <StoreIcon className="text-base" aria-hidden="true" />
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
  item:        Product;
  qty:         string;
  onQtyChange: (v: string) => void;
  onClose:     () => void;
  onConfirm:   (qty: number) => void;
  saving:      boolean;
  error:       string | null;
}) {
  const num      = Number(qty);
  const urgency  = getUrgency(item.stockCount, item.inStock);
  const uc       = URGENCY_CONFIG[urgency];
  const daysLeft = estimateDaysLeft(item.stockCount, urgency);

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
            {daysLeft === 0
              ? <span className="text-xs font-bold text-[var(--status-out-text)]">Gone</span>
              : <span className="text-xs site-text-muted">{daysLeft} days of stock left</span>
            }
          </div>

          <div className="space-y-2 rounded-xl p-4"
            style={{ backgroundColor: 'var(--surface-secondary)' }}>
            {[
              { label: 'Current Stock', value: `${item.stockCount} units`,        cls: 'text-[var(--status-out-text)]' },
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
                    {num} units x ₹{item.price.toLocaleString()}
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

  const storeUsername = activeStore?.username ?? '';

  // ── State ──────────────────────────────────────────────────────────────────
  const [items, setItems]           = useState<Product[]>([]);
  const [catMap, setCatMap]         = useState<Map<number, string>>(new Map());
  const [loading, setLoading]       = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter]     = useState<FilterType>('all');

  const [reorderItem, setReorderItem]     = useState<Product | null>(null);
  const [reorderQty, setReorderQty]       = useState('');
  const [reorderSaving, setReorderSaving] = useState(false);
  const [reorderError, setReorderError]   = useState<string | null>(null);

  // ── Fetch categories ───────────────────────────────────────────────────────

  useEffect(() => {
    if (storeUsername) fetchCategories(storeUsername);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeUsername]);

  // ── Fetch products ─────────────────────────────────────────────────────────

  const fetchLowStock = useCallback(async (force = false) => {
    if (!storeUsername) return;
    setLoading(true);
    setFetchError(null);

    const result = await fetchPage(
      { username: storeUsername, page: 1, pageSize: PAGE_SIZE },
      force,
    );

    if (result) {
      const freshCatMap = new Map<number, string>(
        (getCategories(storeUsername) ?? []).map(c => [c.id, c.name]),
      );

      const lowItems = result.products
        .filter(p => !p.inStock || p.stockCount <= LOW_STOCK_MAX)
        .sort((a, b) => {
          const order: Record<Urgency, number> = { out: 0, warning: 1 };
          const ua = getUrgency(a.stockCount, a.inStock);
          const ub = getUrgency(b.stockCount, b.inStock);
          const diff = order[ua] - order[ub];
          return diff !== 0 ? diff : estimateDaysLeft(a.stockCount, ua) - estimateDaysLeft(b.stockCount, ub);
        });

      setItems(lowItems);
      setCatMap(freshCatMap);
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
    setItems([]); setCatMap(new Map()); setFetchError(null);
    setSelected([]); setFilter('all');
    setReorderItem(null);
  };

  // ── Derived counts ─────────────────────────────────────────────────────────

  const outCount     = items.filter(i => getUrgency(i.stockCount, i.inStock) === 'out').length;
  const warningCount = items.filter(i => getUrgency(i.stockCount, i.inStock) === 'warning').length;

  const filtered = items.filter(i =>
    filter === 'all' || getUrgency(i.stockCount, i.inStock) === filter,
  );

  const totalReorderValue = items.reduce(
    (s, i) => s + i.price * suggestedReorderQty(), 0,
  );

  // ── Selection ──────────────────────────────────────────────────────────────

  const toggleSelect = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  // ── Reorder ────────────────────────────────────────────────────────────────

  const openReorder = (item: Product) => {
    setReorderError(null);
    setReorderQty(String(suggestedReorderQty()));
    setReorderItem(item);
  };

  const closeReorder = () => { setReorderItem(null); setReorderError(null); };

  const confirmReorder = async (qty: number) => {
    if (!reorderItem) return;
    setReorderSaving(true);
    setReorderError(null);

    const body: UpdateProductRequestBody = {
      name:           reorderItem.name,
      slug:           reorderItem.slug,
      description:    reorderItem.description,
      price:          reorderItem.price,
      compareAtPrice: reorderItem.compareAtPrice,
      currency:       reorderItem.currency,
      imageUrl:       reorderItem.imageUrl,
      images:         reorderItem.images,
      categoryIds:    reorderItem.categoryIds,
      inStock:        true,
      stockCount:     reorderItem.stockCount + qty,
      isFeatured:     reorderItem.isFeatured,
      tags:           reorderItem.tags,
    };

    try {
      await updateProduct(storeUsername, reorderItem.slug, body);
      invalidate(storeUsername);

      const newStock  = reorderItem.stockCount + qty;
      const isHealthy = newStock > LOW_STOCK_MAX;

      setItems(prev =>
        prev
          .map(i => i.id !== reorderItem.id ? i : { ...i, stockCount: newStock, inStock: true })
          .filter(i => !(i.id === reorderItem.id && isHealthy)),
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
    { id: 'all',     label: 'All',          count: items.length },
    { id: 'out',     label: 'Out of Stock', count: outCount     },
    { id: 'warning', label: 'Low Stock',    count: warningCount },
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
      {!loading && outCount > 0 && (
        <div className="site-banner site-banner-error mb-5 flex-col sm:flex-row items-start sm:items-center">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-2xl shrink-0">🚨</span>
            <div className="min-w-0">
              <p className="font-bold text-sm">Urgent Restock Needed</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--danger-text)', opacity: 0.85 }}>
                {outCount} item{outCount > 1 ? 's' : ''} out of stock. Act now to prevent lost sales.
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
          {/* <h1 className="site-page-title">Low Stock Alerts</h1> */}
          <div className="flex items-center gap-3">
            <button className="site-back-btn" onClick={() => navigate("/products")}>←</button>
            <div>
              <h1 className="site-page-title">Low Stock Alerts</h1>
            </div>
          </div>
          <StoreSwitcher
            stores={stores} activeStore={activeStore}
            setActiveStore={setActiveStore} onSwitch={switchStore}
            storeUsername={storeUsername}
          />
        </div>
        <div className="flex gap-2 flex-wrap shrink-0">
          <button className="site-btn site-btn-ghost" onClick={() => fetchLowStock(true)}>
            Refresh
          </button>
          <button className="site-btn site-btn-primary" onClick={() => navigate('/products')}>
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

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5">
        {[
          { label: 'Out of Stock',  value: loading ? '—' : outCount                                        },
          { label: 'Low Stock',     value: loading ? '—' : warningCount                                    },
          { label: 'Total Alerts',  value: loading ? '—' : items.length                                    },
          { label: 'Reorder Value', value: loading ? '—' : `₹${(totalReorderValue / 1000).toFixed(1)}K`   },
        ].map(s => (
          <div key={s.label} className="site-stat-card">
            <div className="flex items-center justify-between mb-2">
              <span className="site-stat-card-label">{s.label}</span>
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

              {/* ── Desktop table ── */}
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
                      {['Product', 'Category', 'Stock', 'Status', 'Reorder Cost', 'Actions'].map(h => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(item => {
                      const urgency    = getUrgency(item.stockCount, item.inStock);
                      const uc         = URGENCY_CONFIG[urgency];
                      const category   = resolveCategory(item.categoryIds, catMap);
                      const reorderQty = suggestedReorderQty();
                      const stockPct   = urgency === 'out'
                        ? 0
                        : Math.min((item.stockCount / LOW_STOCK_MAX) * 100, 100);

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
                          <td className="max-w-[180px]">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="relative site-thumb shrink-0"
                                style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.75rem' }}>
                                {item.imageUrl
                                  ? <img src={item.imageUrl} alt={item.name}
                                      className="w-full h-full object-cover"
                                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                  : <span className="text-lg">📦</span>
                                }
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold site-heading truncate" title={item.name}>{item.name}</p>
                                <p className="text-[11px] site-mono site-text-muted truncate">{item.slug}</p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td>
                            <span className="text-xs site-subtext px-2 py-1 rounded-lg block max-w-[140px] site-truncate"
                              style={{ backgroundColor: 'var(--surface-secondary)' }}
                              title={category}>
                              {category}
                            </span>
                          </td>

                          {/* Stock + progress */}
                          <td>
                            <div className="flex flex-col gap-1 min-w-[90px]">
                              <span className={`text-sm font-bold ${
                                item.stockCount === 0 ? 'text-[var(--status-out-text)]'
                                : 'text-[var(--status-low-text)]'
                              }`}>
                                {item.stockCount} units
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
                                Restock
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

              {/* ── Mobile card list ── */}
              <div className="sm:hidden">
                {filtered.map(item => {
                  const urgency    = getUrgency(item.stockCount, item.inStock);
                  const uc         = URGENCY_CONFIG[urgency];
                  const daysLeft   = estimateDaysLeft(item.stockCount, urgency);
                  const category   = resolveCategory(item.categoryIds, catMap);
                  const reorderQty = suggestedReorderQty();
                  const stockPct   = urgency === 'out'
                    ? 0
                    : Math.min((item.stockCount / LOW_STOCK_MAX) * 100, 100);

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
                          <span className="site-mono text-[11px]">{item.slug}</span>
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
                          <div className="flex items-center gap-2 mb-1">
                            <div className="site-progress-track flex-1">
                              <div
                                className="site-progress-bar"
                                style={{ width: `${stockPct}%`, background: uc.barColor }}
                              />
                            </div>
                            <span className="text-xs site-text-muted whitespace-nowrap">
                              {item.stockCount} / {LOW_STOCK_MAX} max
                            </span>
                          </div>

                          <div className="flex gap-2 flex-wrap">
                            <DrawerField label="Days Left">
                              <span className={
                                daysLeft === 0  ? 'text-[var(--status-out-text)] font-bold'
                                : daysLeft <= 3 ? 'text-[var(--status-low-text)] font-bold'
                                : 'text-[var(--status-featured-text)] font-bold'
                              }>
                                {daysLeft === 0 ? 'Gone' : `${daysLeft} days`}
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
                            <DrawerField label="Category">{category}</DrawerField>
                          </div>

                          <div className="flex gap-2 pt-1">
                            <button
                              className="site-btn site-btn-primary site-btn-sm"
                              onClick={() => openReorder(item)}
                            >
                              Restock Now
                            </button>
                            <button
                              className="site-btn site-btn-ghost site-btn-sm"
                              onClick={() => navigate('/products/inventory')}
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
              {(outCount > 0 || warningCount > 0) && (
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
                    {outCount > 0 && warningCount > 0 && ' · '}
                    {warningCount > 0 && `${warningCount} low`}
                    {'. Consider restocking soon.'}
                  </span>
                  <button
                    className="sm:ml-auto shrink-0 site-btn site-btn-sm"
                    style={{ backgroundColor: 'var(--featured-color)', color: '#fff', border: 'none' }}
                    onClick={() => setFilter('out')}
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