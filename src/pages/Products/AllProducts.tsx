// src/pages/Products/AllProducts.tsx
// All colours/surfaces come from site-theme.css — zero inline style={{ color/bg }} needed.

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { createProduct, deleteProduct } from '../../services/productService';
import { useAppStore } from '../../store/useAppStore';
import { useProductStore } from '../../store/useProductStore';
import { useCategoryStore } from '../../store/useCategoryStore';
import { useAuth } from '../../hooks/useAuth';
import type { Product, CreateProductRequestBody, Store } from '../../types/store';
import CategorySelector from '../Categories/CategorySelector';
import CloudinaryUploadWidget from '../../ImageUpload';
import { generateSlug } from '../../utils/slug';
import LayoutToggle from '../../layout/LayoutToggle';
import { MobileDrawerRow, DrawerField } from '../../components/common/MobileDrawer';
import { CardImageSlider } from './Inventory';

// ─── Helpers ───────────────────────────────────────────────────────────────────

const getStatus = (p: Product) => {
  if (!p.inStock || p.stockCount === 0) return 'out';
  if (p.stockCount <= 10) return 'low';
  return 'active';
};

const STATUS_LABEL: Record<string, string> = {
  active: 'Active', low: 'Low Stock', out: 'Out of Stock',
};

const MAX_ADDITIONAL_IMAGES = 2;

const emptyForm = (): CreateProductRequestBody => ({
  name: '', description: '', price: 0, compareAtPrice: 0,
  currency: 'INR', imageUrl: '', images: [], categoryIds: [],
  inStock: true, stockCount: 0, isFeatured: false, tags: [], slug: '',
});

const PAGE_SIZE = 10;

// ─── Category helpers ──────────────────────────────────────────────────────────

type FlatCategory = { id: number; name: string; parentId?: number | null; isActive?: boolean };

const isRoot = (c: FlatCategory) => c.parentId == null || c.parentId === 0;

function buildCatPathMap(cats: FlatCategory[]): Map<number, string> {
  const byId = new Map<number, FlatCategory>(cats.map(c => [c.id, c]));
  const getPath = (id: number, visited = new Set<number>()): string => {
    if (visited.has(id)) return byId.get(id)?.name ?? `#${id}`;
    visited.add(id);
    const cat = byId.get(id);
    if (!cat) return `#${id}`;
    if (isRoot(cat)) return cat.name;
    return `${getPath(cat.parentId as number, visited)} > ${cat.name}`;
  };
  const map = new Map<number, string>();
  for (const cat of cats) map.set(cat.id, getPath(cat.id));
  return map;
}

function flattenAndSort(cats: FlatCategory[]): FlatCategory[] {
  const byId = new Map<number, FlatCategory>(cats.map(c => [c.id, c]));
  const result: FlatCategory[] = [];
  const visited = new Set<number>();
  const visit = (id: number) => {
    if (visited.has(id)) return;
    visited.add(id);
    const cat = byId.get(id);
    if (!cat) return;
    if (!isRoot(cat) && cat.parentId) visit(cat.parentId);
    result.push(cat);
  };
  for (const cat of cats) visit(cat.id);
  return result;
}

// ─── Slug Cell ────────────────────────────────────────────────────────────────

export function SlugCell({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(slug).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const display = slug.length > 10 ? slug.slice(0, 10) + '…' : slug;

  return (
    <div className="flex items-center gap-1.5 group">
      <span className="site-mono text-xs site-subtext whitespace-nowrap" title={slug}>
        {display}
      </span>
      <button
        onClick={handleCopy}
        title={copied ? 'Copied!' : `Copy: ${slug}`}
        className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center w-5 h-5 rounded"
        style={{
          backgroundColor: copied ? 'var(--success-bg)' : 'var(--surface-secondary)',
          border: '1px solid var(--border-medium)',
          color: copied ? 'var(--success-text)' : 'var(--text-muted)',
          flexShrink: 0,
        }}
      >
        {copied ? (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
            <path d="M2 8V2a1 1 0 011-1h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function AllProducts() {
  const navigate = useNavigate();
  const { isVerifying } = useAuth();

  const { stores, activeStore, setActiveStore } = useAppStore();
  const { fetchPage, errors: cacheErrors, invalidate } = useProductStore();
  const { fetchCategories, getCategories } = useCategoryStore();

  const storeUsername    = activeStore?.username ?? '';
  const cachedCategories = getCategories(storeUsername) ?? [];
  const catPathMap       = buildCatPathMap(cachedCategories);
  const resolveCategoryNames = (ids: number[]) =>
    ids.length === 0 ? '—' : ids.map(id => catPathMap.get(id) ?? `#${id}`).join(', ');
  const sortedCategories = flattenAndSort(cachedCategories).filter(c => c.isActive !== false);

  const [products, setProducts]           = useState<Product[]>([]);
  const [total, setTotal]                 = useState(0);
  const [hasMore, setHasMore]             = useState(false);
  const [currentPage, setCurrentPage]     = useState(1);
  const [loading, setLoading]             = useState(false);
  const [fetchError, setFetchError]       = useState<string | null>(null);
  const [storeDropdown, setStoreDropdown] = useState(false);

  const [search, setSearch]           = useState('');
  const [filterCatId, setFilterCatId] = useState<number | 'All'>('All');
  const [sortBy, setSortBy]           = useState('name');
  const [viewMode, setViewMode]       = useState<'table' | 'grid'>('table');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm]             = useState<CreateProductRequestBody>(emptyForm());
  const [tagsInput, setTagsInput]   = useState('');
  const [saving, setSaving]         = useState(false);
  const [formError, setFormError]   = useState<string | null>(null);
  const [activeTab, setActiveTab]   = useState<'basic' | 'pricing' | 'inventory'>('basic');

  const [deleteTarget, setDeleteTarget] = useState<{ slug: string; name: string } | null>(null);
  const [deleting, setDeleting]         = useState(false);

  useEffect(() => {
    if (storeUsername) fetchCategories(storeUsername);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeUsername]);

  const loadPage = useCallback(async (page: number, catId: number | 'All', force = false) => {
    if (!storeUsername) return;
    setLoading(true); setFetchError(null);
    const result = await fetchPage({
      username: storeUsername, page, pageSize: PAGE_SIZE,
      ...(catId !== 'All' ? { category: [catId] as any } : {}),
    }, force);
    if (result) { setProducts(result.products); setTotal(result.total); setHasMore(result.hasMore); }
    else {
      const key = `${storeUsername}::${page}::${PAGE_SIZE}::${catId !== 'All' ? catId : ''}`;
      const knownError = cacheErrors[key];
      if (knownError) setFetchError(knownError);
    }
    setLoading(false);
  }, [storeUsername, fetchPage, cacheErrors]);

  useEffect(() => {
    if (storeUsername && !isVerifying) loadPage(currentPage, filterCatId);
  }, [storeUsername, currentPage, filterCatId, isVerifying, loadPage]);

  const switchStore = (store: Store) => {
    setActiveStore(store); setStoreDropdown(false); setCurrentPage(1);
    setFilterCatId('All'); setSearch('');
    setSelectedIds([]); setProducts([]); setFetchError(null);
  };

  // ── No status filter on AllProducts — show everything ──
  const filtered = products
    .filter(p => {
      const q = search.toLowerCase();
      return !q || p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc')  return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'stock')      return b.stockCount - a.stockCount;
      return a.name.localeCompare(b.name);
    });

  const stats = [
    { label: 'Total',        value: total,                                                  key: 'total'  },
    { label: 'Active',       value: products.filter(p => getStatus(p) === 'active').length, key: 'active' },
    { label: 'Low Stock',    value: products.filter(p => getStatus(p) === 'low').length,    key: 'low'    },
    { label: 'Out of Stock', value: products.filter(p => getStatus(p) === 'out').length,    key: 'out'    },
  ];

  const totalPages   = Math.ceil(total / PAGE_SIZE);
  const toggleSelect = (id: string) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const openDialog = () => {
    setForm(emptyForm()); setTagsInput(''); setFormError(null);
    setActiveTab('basic'); setShowDialog(true);
  };

  const handleNameChange = (name: string) =>
    setForm(prev => ({ ...prev, name, slug: generateSlug(name) }));

  const handleMainImageUpload = useCallback((url: string) =>
    setForm(prev => ({ ...prev, imageUrl: url })), []);

  const handleAdditionalImageUpload = useCallback((url: string) =>
    setForm(prev => (prev.images ?? []).length >= MAX_ADDITIONAL_IMAGES ? prev
      : { ...prev, images: [...(prev.images ?? []), url] }), []);

  const removeAdditionalImage = (index: number) =>
    setForm(prev => ({ ...prev, images: (prev.images ?? []).filter((_, i) => i !== index) }));

  const handleSave = async () => {
    if (!form.name.trim())             { setActiveTab('basic');   setFormError('Product name is required.'); return; }
    if (!form.slug.trim())             { setActiveTab('basic');   setFormError('Slug is required.'); return; }
    if (form.categoryIds.length === 0) { setActiveTab('basic');   setFormError('Select at least one category.'); return; }
    if (form.price <= 0)               { setActiveTab('pricing'); setFormError('Price must be > 0.'); return; }
    setSaving(true); setFormError(null);
    try {
      await createProduct(storeUsername, { ...form, tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean) });
      invalidate(storeUsername); setShowDialog(false); loadPage(currentPage, filterCatId, true);
    } catch (err: any) { setFormError(err?.message || 'Failed to create product.'); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(storeUsername, deleteTarget.slug);
      invalidate(storeUsername); setDeleteTarget(null); loadPage(currentPage, filterCatId, true);
    } catch (err: any) { setFetchError(err?.message || 'Failed to delete product.'); }
    finally { setDeleting(false); }
  };

  if (isVerifying) return (
    <div className="site-page flex items-center justify-center h-screen">
      <p className="text-sm site-subtext">Loading…</p>
    </div>
  );

  return (
    <div className="site-page site-page-padding min-w-0 max-w-full overflow-x-hidden">

      {/* ── Page Header ── */}
      <div className="site-page-header">
        <div>
          <h1 className="site-page-title">Products</h1>

          {stores.length === 0 && <p className="site-page-subtitle">Loading store…</p>}
          {stores.length === 1 && <p className="site-page-subtitle">@{activeStore?.username}</p>}

          {stores.length > 1 && (
            <div className="relative mt-1.5">
              <button className="site-store-trigger" onClick={() => setStoreDropdown(v => !v)}>
                {activeStore?.logoUrl && (
                  <img src={activeStore.logoUrl} alt="" className="w-4 h-4 rounded-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                )}
                <span className="site-subtext">@{activeStore?.username}</span>
                <span className="site-badge site-badge--brand">{stores.length} stores</span>
                <span className="site-text-muted text-xs">▾</span>
              </button>

              {storeDropdown && (
                <>
                  <div className="fixed inset-0 z-[100]" onClick={() => setStoreDropdown(false)} />
                  <div className="site-dropdown">
                    <p className="site-dropdown-label">Switch Store</p>
                    {stores.map(store => (
                      <button key={store.id} onClick={() => switchStore(store)}
                        className={`site-dropdown-item ${activeStore?.id === store.id ? 'site-dropdown-item--active' : ''}`}>
                        <div className="site-thumb site-thumb-sm">
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
                        {activeStore?.id === store.id && (
                          <span className="text-xs font-bold site-text-brand">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button className="site-btn site-btn-ghost site-btn-sm"
            onClick={() => navigate('/products/categories')}>
            Categories
          </button>
          <button className="site-btn site-btn-primary site-btn-sm"
            onClick={openDialog} disabled={!storeUsername}>
            + Add Product
          </button>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {fetchError && !loading && (
        <div className="site-banner site-banner-error mb-5">
          <span>⚠️ {fetchError}</span>
          <button className="text-xs font-semibold underline ml-4"
            onClick={() => loadPage(currentPage, filterCatId, true)}>Retry</button>
        </div>
      )}

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {stats.map(s => (
          <div key={s.label} className="site-stat-card">
            <span className="site-stat-card-label">{s.label}</span>
            <div className="site-stat-card-value">
              {loading
                ? <span className="site-skeleton inline-block w-8 h-6 rounded" />
                : s.value
              }
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="site-card site-card-body mb-4 flex flex-col sm:flex-row flex-wrap gap-3">
        <div className="site-search-wrap flex-1 min-w-0 sm:min-w-[200px]">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or slug…" className="site-input" />
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          <select
            value={filterCatId === 'All' ? '' : String(filterCatId)}
            onChange={e => {
              setFilterCatId(e.target.value === '' ? 'All' : Number(e.target.value));
              setCurrentPage(1); setSelectedIds([]);
            }}
            className="site-input" style={{ maxWidth: '200px' }}>
            <option value="">All Categories</option>
            {sortedCategories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="site-input" style={{ maxWidth: '100px' }}>
            <option value="name">Name A–Z</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="stock">Stock ↓</option>
          </select>

          <LayoutToggle
            value={viewMode}
            onChange={setViewMode}
            options={['table', 'grid']}
          />
        </div>
      </div>

      {/* ── Selection Bar ── */}
      {selectedIds.length > 0 && (
        <div className="site-banner site-banner-info mb-3 flex items-center gap-4 flex-wrap">
          <span>{selectedIds.length} selected</span>
          <button className="site-btn site-btn-danger site-btn-sm">Delete Selected</button>
          <button className="ml-auto text-xl leading-none" onClick={() => setSelectedIds([])}>×</button>
        </div>
      )}

      {/* ── Loading Skeletons ── */}
      {loading && (
        <div className="site-card overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="site-skeleton-row">
              <div className="site-skeleton site-skeleton-circle" style={{ borderRadius: '0.75rem' }} />
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

      {/* ── TABLE VIEW ── */}
      {!loading && !fetchError && viewMode === 'table' && (
      <div className="site-card min-w-0">

        {/* ── Desktop table (hidden on mobile) ── */}
        <div className="hidden sm:block overflow-x-auto w-full" style={{ overflowY: 'hidden' }}>
          <table className="site-table min-w-[750px]">
            <thead>
              <tr>
                <th className="py-3 pl-4 w-10">
                  <input type="checkbox" className="rounded"
                    onChange={e => setSelectedIds(e.target.checked ? filtered.map(p => p.id) : [])} />
                </th>
                {['Product', 'Slug', 'Categories', 'Price', 'Stock', 'Featured', 'Status', 'Actions'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const status   = getStatus(p);
                const catNames = resolveCategoryNames(p.categoryIds ?? []);
                return (
                  <tr key={p.id}
                    style={{ backgroundColor: selectedIds.includes(p.id) ? 'rgba(26,86,219,0.06)' : undefined }}>
                    <td className="py-3 pl-4">
                      <input type="checkbox" className="rounded"
                        checked={selectedIds.includes(p.id)} onChange={() => toggleSelect(p.id)} />
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="site-thumb site-thumb-md">
                          {p.imageUrl
                            ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover"
                                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            : <span className="text-lg">📦</span>
                          }
                        </div>
                        <div>
                          <p className="text-sm font-semibold site-heading whitespace-nowrap">{p.name}</p>
                          <p className="text-xs site-subtext">₹{p.compareAtPrice?.toLocaleString()} MRP</p>
                        </div>
                      </div>
                    </td>
                    <td><SlugCell slug={p.slug} /></td>
                    <td>
                      <span className="text-xs px-2 py-1 rounded-lg site-surface-secondary site-heading block max-w-[180px] site-truncate"
                        title={catNames}>{catNames}</span>
                    </td>
                    <td className="text-sm font-bold site-heading">₹{p.price.toLocaleString()}</td>
                    <td>
                      <span className={`text-sm font-semibold ${
                        p.stockCount === 0      ? 'text-[var(--status-out-text)]'
                        : p.stockCount <= 10    ? 'text-[var(--status-low-text)]'
                        : 'site-heading'
                      }`}>
                        {p.stockCount}
                        {p.stockCount > 0 && p.stockCount <= 10 && (
                          <span className="text-[10px] ml-1 font-bold text-[var(--status-out-text)]">LOW</span>
                        )}
                      </span>
                    </td>
                    <td>
                      {p.isFeatured
                        ? <span className="site-featured-badge">⭐ Featured</span>
                        : <span className="site-text-muted">—</span>
                      }
                    </td>
                    <td>
                      <span className={`site-badge site-badge--${status}`}>
                        <span className="site-badge-dot" />
                        {STATUS_LABEL[status]}
                      </span>
                    </td>
                    <td>
                      <button className="site-btn site-btn-danger site-btn-sm"
                        onClick={() => setDeleteTarget({ slug: p.slug, name: p.name })}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="site-empty-state">
              <div className="site-empty-icon">📦</div>
              <p className="site-empty-title">No products found</p>
              <p className="site-empty-desc">Try adjusting filters or add your first product</p>
              <button className="site-btn site-btn-primary site-btn-sm mt-4" onClick={openDialog}>
                + Add Product
              </button>
            </div>
          )}
        </div>

        {/* ── Mobile card list (shown only on mobile) ── */}
        <div className="sm:hidden">
          {filtered.map(p => {
            const status   = getStatus(p);
            const catNames = resolveCategoryNames(p.categoryIds ?? []);
            return (
              <MobileDrawerRow
                key={p.id}
                isSelected={selectedIds.includes(p.id)}
                onSelect={() => toggleSelect(p.id)}
                thumb={
                  <div className="site-thumb" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.625rem' }}>
                    {p.imageUrl
                      ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      : <span className="text-xl">📦</span>
                    }
                  </div>
                }
                primary={p.name}
                secondary={
                  <>
                    ₹{p.price.toLocaleString()}
                    {p.compareAtPrice > p.price && (
                      <span className="site-price-strike ml-1">₹{p.compareAtPrice.toLocaleString()}</span>
                    )}
                  </>
                }
                badge={
                  <span className={`site-badge site-badge--${status}`}>
                    <span className="site-badge-dot" />
                    {STATUS_LABEL[status]}
                  </span>
                }
                drawer={
                  <>
                    <div className="flex gap-2 flex-wrap">
                      <DrawerField label="Slug">
                        <span className="site-mono text-[11px]">{p.slug}</span>
                      </DrawerField>
                      <DrawerField label="Stock">
                        <span className={
                          p.stockCount === 0 ? 'text-[var(--status-out-text)]'
                          : p.stockCount <= 10 ? 'text-[var(--status-low-text)]' : ''
                        }>
                          {p.stockCount}
                          {p.stockCount > 0 && p.stockCount <= 10 && (
                            <span className="text-[10px] ml-1">LOW</span>
                          )}
                        </span>
                      </DrawerField>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <DrawerField label="Categories">{catNames}</DrawerField>
                      <DrawerField label="Featured">{p.isFeatured ? '⭐ Yes' : '—'}</DrawerField>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button className="site-btn site-btn-danger site-btn-sm flex-1"
                        onClick={() => setDeleteTarget({ slug: p.slug, name: p.name })}>
                        Delete
                      </button>
                    </div>
                  </>
                }
              />
            );
          })}
          {filtered.length === 0 && (
            <div className="site-empty-state">
              <div className="site-empty-icon">📦</div>
              <p className="site-empty-title">No products found</p>
              <p className="site-empty-desc">Try adjusting filters or add your first product</p>
              <button className="site-btn site-btn-primary site-btn-sm mt-4" onClick={openDialog}>
                + Add Product
              </button>
            </div>
          )}
        </div>

        {/* ── Pagination ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 site-border-top">
          <span className="text-sm site-subtext">
            Showing {filtered.length} of {total} products
          </span>
          <div className="site-pagination">
            <button className="site-page-btn" disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>←</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(n => n === 1 || n === totalPages || Math.abs(n - currentPage) <= 1)
              .reduce<(number | '...')[]>((acc, n, i, arr) => {
                if (i > 0 && n - (arr[i - 1] as number) > 1) acc.push('...');
                acc.push(n); return acc;
              }, [])
              .map((n, i) => n === '...'
                ? <span key={`e${i}`} className="w-8 text-center site-text-muted">…</span>
                : <button key={n}
                    className={`site-page-btn ${currentPage === n ? 'site-page-btn--active' : ''}`}
                    onClick={() => setCurrentPage(n as number)}>{n}</button>
              )}
            <button className="site-page-btn" disabled={!hasMore}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>→</button>
          </div>
        </div>
      </div>
    )}

      {/* ── GRID VIEW ── */}
      {!loading && !fetchError && viewMode === 'grid' && (
        <div className="p-4">
          {filtered.length === 0 ? (
            <div className="site-empty-state">
              <div className="site-empty-icon">📦</div>
              <p className="site-empty-title">No products found</p>
              <p className="site-empty-desc">Try adjusting filters or add your first product</p>
              <button className="site-btn site-btn-primary site-btn-sm mt-4" onClick={openDialog}>+ Add Product</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map(p => {
                const status   = getStatus(p);
                const catNames = resolveCategoryNames(p.categoryIds ?? []);
                const allImgs  = [p.imageUrl, ...(p.images ?? [])].filter(u => typeof u === 'string' && u.trim() !== '');
                return (
                  <div key={p.id}
                    className="group site-card overflow-hidden hover:shadow-md transition-all flex flex-col"
                    style={{ borderRadius: '1rem' }}>

                    <div className="relative">
                      <CardImageSlider mainUrl={p.imageUrl ?? ''} extras={p.images ?? []} />
                      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
                        <span className={`site-badge site-badge--${status}`}>
                          <span className="site-badge-dot" />
                          {STATUS_LABEL[status]}
                        </span>
                        {p.isFeatured && (
                          <span className="site-featured-badge">⭐ Featured</span>
                        )}
                      </div>
                    </div>

                    <div className="p-3 flex flex-col gap-1.5 flex-1">
                      <p className="text-sm font-semibold site-heading leading-snug line-clamp-2">{p.name}</p>
                      <p className="text-[10px] site-mono site-text-muted site-truncate">{p.slug}</p>
                      {catNames !== '—' && (
                        <span className="text-[10px] site-surface-secondary site-subtext px-1.5 py-0.5 rounded-md site-truncate block"
                          title={catNames}>{catNames}</span>
                      )}

                      <div className="flex items-baseline gap-1.5 mt-auto pt-1">
                        <span className="text-sm font-bold site-heading">₹{p.price.toLocaleString()}</span>
                        {p.compareAtPrice > p.price && (
                          <span className="site-price-strike">₹{p.compareAtPrice.toLocaleString()}</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs site-subtext">
                        <span className={`font-semibold ${
                          p.stockCount === 0   ? 'text-[var(--status-out-text)]'
                          : p.stockCount <= 9  ? 'text-[var(--status-low-text)]'
                          : 'site-heading'
                        }`}>
                          Qty: {p.stockCount}
                          {p.stockCount > 0 && p.stockCount <= 9 && (
                            <span className="text-[var(--status-out-text)] ml-1">LOW</span>
                          )}
                        </span>
                        {allImgs.length > 1 && (
                          <span className="text-[10px] site-text-muted">{allImgs.length} photos</span>
                        )}
                      </div>

                      <button className="site-btn site-btn-danger site-btn-sm w-full mt-1"
                        onClick={() => setDeleteTarget({ slug: p.slug, name: p.name })}>
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── ADD PRODUCT DIALOG ── */}
      {showDialog && createPortal(
        <div className="site-modal-overlay">
          <div className="site-modal">
            <div className="site-modal-header">
              <div>
                <h2 className="h3 site-heading">Add New Product</h2>
                <p className="text-xs site-subtext mt-0.5">Adding to @{storeUsername}</p>
              </div>
              <button className="site-btn-icon" onClick={() => setShowDialog(false)}>×</button>
            </div>

            <div className="site-tabs-underline shrink-0">
              {([
                { id: 'basic',     label: 'Basic',     desc: 'Name, slug, category' },
                { id: 'pricing',   label: 'Pricing',   desc: 'Price, MRP'           },
                { id: 'inventory', label: 'Inventory', desc: 'Stock, featured'      },
              ] as const).map(tab => (
                <button key={tab.id}
                  className={`site-tab-underline ${activeTab === tab.id ? 'site-tab-underline--active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}>
                  <div className="text-xs font-bold">{tab.label}</div>
                  <div className="text-[10px] mt-0.5 hidden sm:block site-text-muted">{tab.desc}</div>
                </button>
              ))}
            </div>

            <div className="site-modal-body space-y-4">
              {/* Basic Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  <div>
                    <label className="site-label">Product Name <span className="text-[var(--danger-solid)]">*</span></label>
                    <input value={form.name} onChange={e => handleNameChange(e.target.value)}
                      placeholder="e.g. Wireless Earbuds Pro" className="site-input" />
                  </div>
                  <div>
                    <label className="site-label">Slug <span className="text-[var(--danger-solid)]">*</span></label>
                    <input value={form.slug} readOnly onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                      placeholder="wireless-earbuds-pro" className="site-input site-input-mono" />
                    <p className="text-[11px] mt-1 site-text-muted">Auto-generated · must be unique</p>
                  </div>
                  <CategorySelector storeUsername={storeUsername} selectedIds={form.categoryIds}
                    onChange={ids => setForm(f => ({ ...f, categoryIds: ids }))} allowCreate required />
                  <div>
                    <label className="site-label">Tags <span className="font-normal text-xs site-text-muted">(comma separated)</span></label>
                    <input value={tagsInput} onChange={e => setTagsInput(e.target.value)}
                      placeholder="wireless, earbuds" className="site-input" />
                  </div>
                  <div>
                    <label className="site-label">Description</label>
                    <textarea value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Describe your product…" rows={3} className="site-input" />
                  </div>
                  <div>
                    <label className="site-label">Main Image</label>
                    <div className="flex items-center gap-3 flex-wrap">
                      <CloudinaryUploadWidget onUpload={handleMainImageUpload} />
                      {form.imageUrl && (
                        <div className="relative w-16 h-16 site-thumb shrink-0"
                          style={{ border: '1px solid var(--border-medium)' }}>
                          <img src={form.imageUrl} alt="Main" className="w-full h-full object-cover" />
                          <button type="button"
                            className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center hover:bg-red-600"
                            onClick={() => setForm(f => ({ ...f, imageUrl: '' }))}>✕</button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="site-label">
                      Additional Images <span className="font-normal text-xs site-text-muted">({(form.images ?? []).length}/{MAX_ADDITIONAL_IMAGES})</span>
                    </label>
                    <div className="flex items-center gap-3 flex-wrap">
                      {(form.images ?? []).map((url, i) => (
                        <div key={url} className="relative w-16 h-16 site-thumb shrink-0"
                          style={{ border: '1px solid var(--border-medium)' }}>
                          <img src={url} alt={`Extra ${i + 1}`} className="w-full h-full object-cover" />
                          <button type="button"
                            className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center hover:bg-red-600"
                            onClick={() => removeAdditionalImage(i)}>✕</button>
                        </div>
                      ))}
                      {(form.images ?? []).length < MAX_ADDITIONAL_IMAGES && (
                        <CloudinaryUploadWidget onUpload={handleAdditionalImageUpload} />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing Tab */}
              {activeTab === 'pricing' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="site-label">Selling Price <span className="text-[var(--danger-solid)]">*</span></label>
                      <div className="site-input-prefix">
                        <span className="site-input-prefix-icon">₹</span>
                        <input type="number" min="0" value={form.price || ''}
                          onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                          placeholder="0.00" className="site-input" />
                      </div>
                    </div>
                    <div>
                      <label className="site-label">MRP / Compare At</label>
                      <div className="site-input-prefix">
                        <span className="site-input-prefix-icon">₹</span>
                        <input type="number" min="0" value={form.compareAtPrice || ''}
                          onChange={e => setForm(f => ({ ...f, compareAtPrice: Number(e.target.value) }))}
                          placeholder="0.00" className="site-input" />
                      </div>
                    </div>
                  </div>
                  {form.compareAtPrice > form.price && form.price > 0 && (
                    <div className="site-price-save">
                      <span className="text-2xl">🎉</span>
                      <div>
                        <p className="font-bold">{Math.round((1 - form.price / form.compareAtPrice) * 100)}% OFF</p>
                        <p className="text-xs font-normal site-text-muted">
                          Customers save ₹{(form.compareAtPrice - form.price).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="site-label">Currency</label>
                    <select value={form.currency}
                      onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} className="site-input">
                      <option value="INR">INR (₹) — Indian Rupee</option>
                      <option value="USD">USD ($) — US Dollar</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Inventory Tab */}
              {activeTab === 'inventory' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="site-label">Stock Count <span className="text-[var(--danger-solid)]">*</span></label>
                      <input type="number" min="0" value={form.stockCount || ''}
                        onChange={e => setForm(f => ({ ...f, stockCount: Number(e.target.value) }))}
                        placeholder="0" className="site-input" />
                    </div>
                    <div>
                      <label className="site-label">Availability</label>
                      <select value={form.inStock ? 'true' : 'false'}
                        onChange={e => setForm(f => ({ ...f, inStock: e.target.value === 'true' }))}
                        className="site-input">
                        <option value="true">✅ In Stock</option>
                        <option value="false">❌ Out of Stock</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="site-label">Featured / Sale Event</label>
                    <div className={`site-toggle-wrap ${form.isFeatured ? 'site-toggle-wrap--on' : ''}`}
                      onClick={() => setForm(f => ({ ...f, isFeatured: !f.isFeatured }))}>
                      <div className={`site-toggle-track ${form.isFeatured ? 'site-toggle-track--on' : ''}`}>
                        <span className="site-toggle-thumb" />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-bold ${form.isFeatured ? 'text-[var(--featured-text)]' : 'site-heading'}`}>
                          {form.isFeatured ? '⭐ Featured Product' : 'Not Featured'}
                        </p>
                        <p className="text-xs mt-0.5 site-text-muted">Flag for special occasions or sale campaigns</p>
                      </div>
                    </div>
                  </div>

                  <div className={`site-banner ${
                    !form.inStock || form.stockCount === 0 ? 'site-banner-error'
                    : form.stockCount <= 10 ? ''
                    : 'site-banner-success'
                  }`} style={form.stockCount > 0 && form.stockCount <= 10
                    ? { backgroundColor: 'var(--status-low-bg)', border: '1px solid rgba(247,144,9,0.3)', color: 'var(--status-low-text)' }
                    : undefined}>
                    <p className="font-semibold text-sm">Status Preview</p>
                    <p className="text-sm">
                      {!form.inStock || form.stockCount === 0 ? '❌ Out of Stock' : form.stockCount <= 10 ? '⚠️ Low Stock' : '✅ Active'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {formError && (
              <div className="site-banner site-banner-error mx-6 mb-0 shrink-0">
                <span>⚠️ {formError}</span>
                <button onClick={() => setFormError(null)} className="text-lg leading-none opacity-60 hover:opacity-100">×</button>
              </div>
            )}

            <div className="site-modal-footer">
              <div className="flex gap-2 mr-auto">
                {activeTab !== 'basic' && (
                  <button className="site-btn site-btn-ghost site-btn-sm"
                    onClick={() => setActiveTab(activeTab === 'inventory' ? 'pricing' : 'basic')}>← Back</button>
                )}
                {activeTab !== 'inventory' && (
                  <button className="site-btn site-btn-outline site-btn-sm"
                    onClick={() => setActiveTab(activeTab === 'basic' ? 'pricing' : 'inventory')}>Next →</button>
                )}
              </div>
              <button className="site-btn site-btn-ghost site-btn-sm" onClick={() => setShowDialog(false)}>Cancel</button>
              <button className="site-btn site-btn-primary site-btn-sm" onClick={handleSave} disabled={saving}>
                {saving ? <><span className="site-spinner" /> Saving…</> : 'Add Product'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── DELETE CONFIRM ── */}
      {deleteTarget && createPortal(
        <div className="site-modal-overlay">
          <div className="site-modal site-modal-sm">
            <div className="site-modal-body text-center">
              {/* <div className="text-4xl mb-3">🗑️</div> */}
              <h2 className="h3 site-heading mb-2">Delete Product?</h2>
              <p className="text-sm site-subtext mb-1">You are about to delete:</p>
              <p className="text-sm font-semibold site-heading mb-4">"{deleteTarget.name}"</p>
              <p className="text-xs text-[var(--danger-solid)] mb-2">This action cannot be undone.</p>
            </div>
            <div className="site-modal-footer">
              <button className="site-btn site-btn-ghost flex-1" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="site-btn flex-1 disabled:opacity-50"
                style={{ backgroundColor: 'var(--danger-solid)', color: '#fff', border: 'none',
                         borderRadius: '0.75rem', padding: '0.625rem 1.25rem', fontWeight: 600,
                         cursor: deleting ? 'not-allowed' : 'pointer' }}
                onClick={confirmDelete} disabled={deleting}>
                {deleting ? <><span className="site-spinner" /> Deleting…</> : 'Delete'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}