// src/pages/Products/Inventory.tsx

import { useEffect, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from "@/shared/stores/useAppStore";
import { useProductStore } from "@/shared/stores/useProductStore";
import { useCategoryStore } from "@/shared/stores/useCategoryStore";
import { useAuth } from "@/shared/hooks/useAuth";
import { updateProduct, deleteProduct } from "@/shared/services/productService";
import CategorySelector from '@/features/categories/pages/CategorySelector';
import CloudinaryUploadWidget from "@/shared/components/forms/CloudinaryUploadWidget";
import type { Product, Store, UpdateProductRequestBody } from "@/shared/types/store";
import LayoutToggle from "@/shared/components/layout/LayoutToggle";
import { SlugCell } from './AllProducts';
import { MobileDrawerRow, DrawerField } from "@/shared/components/ui/MobileDrawer";
import { Store as StoreIcon } from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────

type InventoryItem = {
  id:             string;
  name:           string;
  slug:           string;
  categoryIds:    number[];
  imageUrl:       string;
  stock:          number;
  inStock:        boolean;
  reorderPoint:   number;
  price:          number;
  description:    string;
  compareAtPrice: number;
  currency:       string;
  images:         string[];
  isFeatured:     boolean;
  tags:           string[];
};

type EditForm = Omit<UpdateProductRequestBody, 'images' | 'tags'> & {
  images:    string[];
  tagsInput: string;
};

// ─── Constants ─────────────────────────────────────────────────────────────────

const REORDER_POINT         = 9;
const PAGE_SIZE             = 50;
const MAX_ADDITIONAL_IMAGES = 2;

// ─── Helpers ───────────────────────────────────────────────────────────────────

const toInventoryItem = (p: Product): InventoryItem => ({
  id:             p.id,
  name:           p.name,
  slug:           p.slug,
  categoryIds:    p.categoryIds ?? [],
  imageUrl:       p.imageUrl ?? '',
  stock:          p.stockCount,
  inStock:        p.inStock,
  reorderPoint:   REORDER_POINT,
  price:          p.price,
  description:    p.description ?? '',
  compareAtPrice: p.compareAtPrice ?? 0,
  currency:       p.currency ?? 'INR',
  images:         p.images ?? [],
  isFeatured:     p.isFeatured ?? false,
  tags:           p.tags ?? [],
});

const itemToForm = (item: InventoryItem): EditForm => ({
  name:           item.name,
  slug:           item.slug,
  description:    item.description,
  price:          item.price,
  compareAtPrice: item.compareAtPrice,
  currency:       item.currency,
  imageUrl:       item.imageUrl,
  images:         item.images,
  categoryIds:    item.categoryIds,
  inStock:        item.inStock,
  stockCount:     item.stock,
  isFeatured:     item.isFeatured,
  tagsInput:      item.tags.join(', '),
});

type StockStatus = 'out' | 'low' | 'active';

const getStockStatus = (stock: number, inStock: boolean, reorder: number): StockStatus => {
  if (!inStock || stock === 0) return 'out';
  if (stock <= reorder)        return 'low';
  return 'active';
};

const STATUS_LABEL: Record<StockStatus, string> = {
  out:    'Out of Stock',
  low:    'Low Stock',
  active: 'In Stock',
};

type StatusFilter = '' | StockStatus;

const STATUS_FILTERS: { value: StatusFilter; label: string; dot: string }[] = [
  { value: '',       label: 'All',          dot: 'var(--text-muted)'         },
  { value: 'active', label: 'In Stock',     dot: 'var(--status-active-dot)'  },
  { value: 'low',    label: 'Low Stock',    dot: 'var(--status-low-dot)'     },
  { value: 'out',    label: 'Out of Stock', dot: 'var(--status-out-dot)'     },
];

// ─── Image Gallery (modal detail view) ────────────────────────────────────────

function ImageGallery({ mainUrl, extras }: { mainUrl: string; extras: string[] }) {
  const all           = [mainUrl, ...extras].filter(u => typeof u === 'string' && u.trim() !== '');
  const [idx, setIdx] = useState(0);
  const touchStartX   = useRef<number | null>(null);

  useEffect(() => { setIdx(0); }, [mainUrl, extras.length]);

  if (all.length === 0) {
    return <div className="site-thumb w-full h-48 text-4xl">📦</div>;
  }

  const prev = () => setIdx(i => (i - 1 + all.length) % all.length);
  const next = () => setIdx(i => (i + 1) % all.length);

  return (
    <div className="space-y-2">
      <div
        className="relative w-full h-48 site-thumb select-none"
        onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={e => {
          if (touchStartX.current === null) return;
          const diff = touchStartX.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
          touchStartX.current = null;
        }}
      >
        <img src={all[idx]} alt={`Image ${idx + 1}`}
          className="w-full h-full object-cover transition-opacity duration-200"
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />

        {all.length > 1 && (
          <>
            <button type="button" onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center text-sm hover:bg-black/60 transition-colors">
              ‹
            </button>
            <button type="button" onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center text-sm hover:bg-black/60 transition-colors">
              ›
            </button>
          </>
        )}

        {all.length > 1 && (
          <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {idx + 1}/{all.length}
          </span>
        )}

        {idx === 0 && (
          <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: 'var(--btn-primary-bg)', color: '#fff' }}>
            Main
          </span>
        )}
      </div>

      {all.length > 1 && (
        <div className="flex gap-1.5 justify-center">
          {all.map((url, i) => (
            <button key={i} type="button" onClick={() => setIdx(i)}
              className="w-8 h-8 rounded-lg overflow-hidden transition-all"
              style={{
                border:    i === idx ? '2px solid var(--btn-primary-bg)' : '2px solid transparent',
                opacity:   i === idx ? 1 : 0.6,
                transform: i === idx ? 'scale(1.1)' : 'scale(1)',
              }}>
              <img src={url} alt="" className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Card Image Slider (grid view) ────────────────────────────────────────────

export function CardImageSlider({ mainUrl, extras }: { mainUrl: string; extras: string[] }) {
  const all           = [mainUrl, ...extras].filter(u => typeof u === 'string' && u.trim() !== '');
  const [idx, setIdx] = useState(0);
  const touchStartX   = useRef<number | null>(null);
  const touchStartY   = useRef<number | null>(null);

  useEffect(() => { setIdx(0); }, [mainUrl, extras.length]);

  if (all.length === 0) {
    return (
      <div style={{ paddingBottom: '100%', position: 'relative' }} className="site-surface-secondary w-full">
        <div className="absolute inset-0 flex items-center justify-center text-4xl">📦</div>
      </div>
    );
  }

  const goTo = (i: number) => setIdx(Math.max(0, Math.min(i, all.length - 1)));

  return (
    <div
      className="relative w-full site-surface-secondary select-none"
      style={{ paddingBottom: '100%' }}
      onTouchStart={e => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
      }}
      onTouchEnd={e => {
        if (touchStartX.current === null || touchStartY.current === null) return;
        const dx = touchStartX.current - e.changedTouches[0].clientX;
        const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY);
        if (Math.abs(dx) > 35 && Math.abs(dx) > dy) dx > 0 ? goTo(idx + 1) : goTo(idx - 1);
        touchStartX.current = null;
        touchStartY.current = null;
      }}
    >
      <div className="absolute inset-0">
        <img key={all[idx]} src={all[idx]} alt={`Image ${idx + 1}`}
          className="w-full h-full object-cover" draggable={false}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      </div>

      {all.length > 1 && idx > 0 && (
        <button type="button"
          className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/50 text-white text-sm flex items-center justify-center"
          onClick={e => { e.stopPropagation(); goTo(idx - 1); }}>‹</button>
      )}
      {all.length > 1 && idx < all.length - 1 && (
        <button type="button"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/50 text-white text-sm flex items-center justify-center"
          onClick={e => { e.stopPropagation(); goTo(idx + 1); }}>›</button>
      )}

      {all.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
          {all.map((_, i) => (
            <button key={i} type="button"
              className="rounded-full transition-all duration-200"
              style={{
                width:           i === idx ? '1rem'     : '0.375rem',
                height:          i === idx ? '0.375rem' : '0.375rem',
                backgroundColor: i === idx ? '#fff'     : 'rgba(255,255,255,0.5)',
              }}
              onClick={e => { e.stopPropagation(); goTo(i); }}
            />
          ))}
        </div>
      )}

      {all.length > 1 && (
        <span className="absolute top-2 right-2 z-20 bg-black/50 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full pointer-events-none">
          {idx + 1}/{all.length}
        </span>
      )}
    </div>
  );
}

// ─── Store Switcher ───────────────────────────────────────────────────────────

function StoreSwitcher({ stores, activeStore, setActiveStore, onSwitch, storeUsername }: {
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
        {storeUsername ? `@${storeUsername} · ` : ''}Track stock levels across your store
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

// ─── Main Component ────────────────────────────────────────────────────────────

export default function Inventory() {
  const navigate        = useNavigate();
  const { isVerifying } = useAuth();

  const { stores, activeStore, setActiveStore }        = useAppStore();
  const { fetchPage, errors: cacheErrors, invalidate } = useProductStore();
  const { fetchCategories, getCategories }             = useCategoryStore();

  const storeUsername    = activeStore?.username ?? '';
  const cachedCategories = getCategories(storeUsername) ?? [];
  const catMap           = new Map<number, string>(cachedCategories.map(c => [c.id, c.name]));
  const resolveNames     = (ids: number[]) =>
    ids.length === 0 ? '—' : ids.map(id => catMap.get(id) ?? `#${id}`).join(', ');
  const activeCategories = cachedCategories.filter(c => c.active !== false);

  const [items, setItems]           = useState<InventoryItem[]>([]);
  const [loading, setLoading]       = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [search, setSearch]             = useState('');
  const [filterCatId, setFilterCatId]   = useState<number | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('');
  const [layout, setLayout]             = useState<'list' | 'grid'>('list');

  const [editItem, setEditItem]   = useState<InventoryItem | null>(null);
  const [editForm, setEditForm]   = useState<EditForm | null>(null);
  const [editTab, setEditTab]     = useState<'basic' | 'pricing' | 'inventory'>('basic');
  const [saving, setSaving]       = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{ slug: string; name: string } | null>(null);
  const [deleting, setDeleting]         = useState(false);

  useEffect(() => {
    if (storeUsername) fetchCategories(storeUsername);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeUsername]);

  const fetchInventory = useCallback(async (force = false) => {
    if (!storeUsername) return;
    setLoading(true); setFetchError(null);
    const result = await fetchPage({ username: storeUsername, page: 1, pageSize: PAGE_SIZE }, force);
    if (result) {
      setItems(result.products.map(toInventoryItem));
    } else {
      const key = `${storeUsername}::1::${PAGE_SIZE}::`;
      const err = cacheErrors[key];
      if (err) setFetchError(err);
    }
    setLoading(false);
  }, [storeUsername, fetchPage, cacheErrors]);

  useEffect(() => {
    if (storeUsername && !isVerifying) fetchInventory();
  }, [storeUsername, isVerifying, fetchInventory]);

  const filtered = items.filter(item => {
    const q           = search.toLowerCase();
    const matchSearch = item.name.toLowerCase().includes(q) || item.slug.toLowerCase().includes(q);
    const matchCat    = filterCatId === 'All' || item.categoryIds.includes(filterCatId as number);
    const status      = getStockStatus(item.stock, item.inStock, item.reorderPoint);
    const matchStatus = filterStatus === '' || status === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const totalStock  = items.reduce((s, i) => s + i.stock, 0);
  const lowCount    = items.filter(i => getStockStatus(i.stock, i.inStock, i.reorderPoint) === 'low').length;
  const outCount    = items.filter(i => getStockStatus(i.stock, i.inStock, i.reorderPoint) === 'out').length;
  const activeCount = items.filter(i => getStockStatus(i.stock, i.inStock, i.reorderPoint) === 'active').length;

  const switchStore = (store: Store) => {
    setActiveStore(store);
    setFilterCatId('All'); setFilterStatus(''); setSearch('');
    setItems([]); setFetchError(null);
    setEditItem(null); setEditForm(null);
  };

  const openEdit = (item: InventoryItem) => {
    setEditItem(item); setEditForm(itemToForm(item));
    setEditTab('basic'); setEditError(null);
  };
  const closeEdit = () => { setEditItem(null); setEditForm(null); setEditError(null); };
  const updateField = <K extends keyof EditForm>(key: K, value: EditForm[K]) =>
    setEditForm(f => f ? { ...f, [key]: value } : f);

  const handleMainImageUpload = useCallback((url: string) =>
    setEditForm(f => f ? { ...f, imageUrl: url } : f), []);

  const handleAdditionalImageUpload = useCallback((url: string) =>
    setEditForm(f => {
      if (!f) return f;
      if ((f.images ?? []).length >= MAX_ADDITIONAL_IMAGES) return f;
      return { ...f, images: [...(f.images ?? []), url] };
    }), []);

  const removeAdditionalImage = (index: number) =>
    setEditForm(f => f ? { ...f, images: (f.images ?? []).filter((_, i) => i !== index) } : f);

  const handleSave = async () => {
    if (!editForm || !editItem) return;
    if (!editForm.name.trim())             { setEditTab('basic');   setEditError('Product name is required.');       return; }
    if (!editForm.slug.trim())             { setEditTab('basic');   setEditError('Slug is required.');               return; }
    if (editForm.categoryIds.length === 0) { setEditTab('basic');   setEditError('At least one category required.'); return; }
    if (editForm.price <= 0)               { setEditTab('pricing'); setEditError('Price must be greater than 0.');   return; }
    setSaving(true); setEditError(null);

    const body: UpdateProductRequestBody = {
      name:           editForm.name.trim(),
      slug:           editForm.slug.trim(),
      description:    editForm.description.trim(),
      price:          editForm.price,
      compareAtPrice: editForm.compareAtPrice,
      currency:       editForm.currency,
      imageUrl:       editForm.imageUrl.trim(),
      images:         editForm.images ?? [],
      categoryIds:    editForm.categoryIds,
      inStock:        editForm.inStock,
      stockCount:     editForm.stockCount,
      isFeatured:     editForm.isFeatured,
      tags:           editForm.tagsInput.split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      await updateProduct(storeUsername, editItem.slug, body);
      setItems(prev => prev.map(it => it.id !== editItem.id ? it : {
        ...it,
        name:           body.name,           slug:           body.slug,
        description:    body.description,    price:          body.price,
        compareAtPrice: body.compareAtPrice, currency:       body.currency,
        imageUrl:       body.imageUrl,       images:         body.images,
        categoryIds:    body.categoryIds,    inStock:        body.inStock,
        stock:          body.stockCount,     isFeatured:     body.isFeatured,
        tags:           body.tags,
      }));
      invalidate(storeUsername);
      closeEdit();
    } catch (err: any) {
      setEditError(err?.message || 'Failed to update product. Please try again.');
    } finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(storeUsername, deleteTarget.slug);
      invalidate(storeUsername);
      setDeleteTarget(null);
      fetchInventory(true);
    } catch (err: any) {
      setFetchError(err?.message || 'Failed to delete product.');
    } finally { setDeleting(false); }
  };

  if (isVerifying) return (
    <div className="site-page flex items-center justify-center h-screen">
      <p className="text-sm site-subtext">Loading…</p>
    </div>
  );

  return (
    <div className="site-page site-page-padding">

      {/* ── Header ── */}
      <div className="site-page-header">
        <div>
          <h1 className="site-page-title">Inventory</h1>
          <StoreSwitcher
            stores={stores} activeStore={activeStore}
            setActiveStore={setActiveStore} onSwitch={switchStore}
            storeUsername={storeUsername}
          />
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="site-btn site-btn-ghost site-btn-sm" onClick={() => fetchInventory(true)}>
            Refresh
          </button>
          <button className="site-btn site-btn-primary site-btn-sm" onClick={() => navigate('/products/add')}>
            + Add Product
          </button>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {fetchError && !loading && (
        <div className="site-banner site-banner-error mb-5">
          <span>⚠️ {fetchError}</span>
          <button className="text-xs font-semibold underline ml-4"
            onClick={() => fetchInventory(true)}>Retry</button>
        </div>
      )}

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5">
        {[
          { label: 'Total Stock Units', value: loading ? '—' : totalStock.toLocaleString(), key: 'total'  },
          { label: 'Active Items',      value: loading ? '—' : activeCount,                 key: 'active' },
          { label: 'Low Stock',         value: loading ? '—' : lowCount,                    key: 'low'    },
          { label: 'Out of Stock',      value: loading ? '—' : outCount,                    key: 'out'    },
        ].map(s => (
          <div key={s.label} className="site-stat-card">
            <span className="site-stat-card-label">{s.label}</span>
            {loading
              ? <div className="site-skeleton site-skeleton-block h-8 w-16 rounded" />
              : <p className="site-stat-card-value">{s.value}</p>
            }
          </div>
        ))}
      </div>

      {/* ── Filter Bar ── */}
      <div className="site-card site-card-body mb-4 flex flex-col gap-3">

        {/* Row 1: Search — full width on all screens */}
        <div className="site-search-wrap w-full">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or slug…" className="site-input" />
        </div>

        {/* Row 2 — desktop: category + status pills + layout toggle all on one line */}
        <div className="hidden sm:flex flex-row items-center gap-2 flex-nowrap">
          <select
            value={filterCatId === 'All' ? '' : String(filterCatId)}
            onChange={e => setFilterCatId(e.target.value === '' ? 'All' : Number(e.target.value))}
            className="site-input shrink-0"
            style={{ width: '160px' }}>
            <option value="">All Categories</option>
            {activeCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <div className="flex gap-1.5 flex-nowrap overflow-x-auto site-no-scrollbar">
            {STATUS_FILTERS.map(f => {
              const isActive = filterStatus === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => setFilterStatus(f.value)}
                  className="site-filter-pill shrink-0"
                  style={isActive ? {
                    backgroundColor: 'var(--btn-primary-bg)',
                    borderColor:     'var(--btn-primary-bg)',
                    color:           '#fff',
                  } : undefined}
                >
                  {f.value !== '' && (
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: isActive ? '#fff' : f.dot }}
                    />
                  )}
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className="ml-auto shrink-0">
            <LayoutToggle value={layout} onChange={setLayout} options={['list', 'grid']} />
          </div>
        </div>

        {/* Row 2 — mobile: status select + layout toggle side by side */}
        <div className="flex items-center gap-2 sm:hidden">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as StatusFilter)}
            className="site-input flex-1"
          >
            {STATUS_FILTERS.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <div className="shrink-0">
            <LayoutToggle value={layout} onChange={setLayout} options={['list', 'grid']} />
          </div>
        </div>

        {/* Row 3 — mobile only: category select */}
        <div className="sm:hidden">
          <select
            value={filterCatId === 'All' ? '' : String(filterCatId)}
            onChange={e => setFilterCatId(e.target.value === '' ? 'All' : Number(e.target.value))}
            className="site-input w-full">
            <option value="">All Categories</option>
            {activeCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

      </div>

      {/* ── Table / Grid ── */}
      <div className="site-card overflow-hidden">

        {/* ── Loading ── */}
        {loading && (
          layout === 'list' ? (
            <div>
              {[...Array(6)].map((_, i) => (
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
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="site-skeleton rounded-2xl h-52" />
              ))}
            </div>
          )
        )}

        {/* ── LIST VIEW ── */}
        {!loading && !fetchError && layout === 'list' && (
          <div>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="site-table min-w-[680px]">
                <thead>
                  <tr>
                    {['Product', 'Slug', 'Categories', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(item => {
                    const status   = getStockStatus(item.stock, item.inStock, item.reorderPoint);
                    const catNames = resolveNames(item.categoryIds);
                    const thumbUrl = item.imageUrl || item.images[0] || '';
                    const imgCount = (item.imageUrl ? 1 : 0) + item.images.length;
                    return (
                      <tr key={item.id}>
                        <td className="max-w-[180px]">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="relative site-thumb shrink-0"
                              style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.75rem' }}>
                              {thumbUrl
                                ? <img src={thumbUrl} alt={item.name} className="w-full h-full object-cover"
                                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                : <span className="text-lg">📦</span>
                              }
                              {imgCount > 1 && (
                                <span className="absolute bottom-0 right-0 bg-black/60 text-white text-[8px] font-bold px-1 leading-4 rounded-tl">
                                  {imgCount}
                                </span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold site-heading truncate" title={item.name}>{item.name}</p>
                              {item.isFeatured && (
                                <span className="text-[10px] font-bold text-[var(--featured-color)]">⭐ Featured</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td><SlugCell slug={item.slug} /></td>
                        <td>
                          <span className="text-xs site-surface-secondary site-subtext px-2 py-1 rounded-lg max-w-[160px] site-truncate block"
                            title={catNames}>{catNames}</span>
                        </td>
                        <td className="text-sm font-semibold site-heading">
                          ₹{item.price.toLocaleString()}
                          {item.compareAtPrice > item.price && (
                            <span className="site-price-strike ml-1.5">₹{item.compareAtPrice.toLocaleString()}</span>
                          )}
                        </td>
                        <td>
                          <span className={`text-sm font-bold ${
                            item.stock === 0                  ? 'text-[var(--status-out-text)]'
                            : item.stock <= item.reorderPoint ? 'text-[var(--status-low-text)]'
                            : 'site-heading'
                          }`}>
                            {item.stock}
                            {item.stock > 0 && item.stock <= item.reorderPoint && (
                              <span className="text-[10px] text-[var(--status-out-text)] ml-1 font-bold">LOW</span>
                            )}
                          </span>
                        </td>
                        <td>
                          <span className={`site-badge site-badge--${status}`}>
                            <span className="site-badge-dot" />
                            {STATUS_LABEL[status]}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-1.5">
                            <button className="site-btn site-btn-outline site-btn-sm"
                              onClick={() => openEdit(item)}>Edit</button>
                            <button className="site-btn site-btn-danger site-btn-sm"
                              onClick={() => setDeleteTarget({ slug: item.slug, name: item.name })}>Delete</button>
                          </div>
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
                </div>
              )}
            </div>

            {/* Mobile card list */}
            <div className="sm:hidden">
              {filtered.map(item => {
                const status   = getStockStatus(item.stock, item.inStock, item.reorderPoint);
                const catNames = resolveNames(item.categoryIds);
                const thumbUrl = item.imageUrl || item.images[0] || '';
                const imgCount = (item.imageUrl ? 1 : 0) + item.images.length;
                return (
                  <MobileDrawerRow
                    key={item.id}
                    thumb={
                      <div className="relative site-thumb shrink-0"
                        style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.625rem' }}>
                        {thumbUrl
                          ? <img src={thumbUrl} alt={item.name} className="w-full h-full object-cover"
                              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          : <span className="text-xl">📦</span>
                        }
                        {imgCount > 1 && (
                          <span className="absolute bottom-0 right-0 bg-black/60 text-white text-[8px] font-bold px-1 leading-4 rounded-tl">
                            {imgCount}
                          </span>
                        )}
                      </div>
                    }
                    primary={
                      <>
                        {item.name}
                        {item.isFeatured && (
                          <span className="text-[10px] font-bold text-[var(--featured-color)] ml-1.5">⭐</span>
                        )}
                      </>
                    }
                    secondary={
                      <>
                        ₹{item.price.toLocaleString()}
                        {item.compareAtPrice > item.price && (
                          <span className="site-price-strike ml-1">₹{item.compareAtPrice.toLocaleString()}</span>
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
                            <SlugCell slug={item.slug} />
                          </DrawerField>
                          <DrawerField label="Stock">
                            <span className={
                              item.stock === 0 ? 'text-[var(--status-out-text)]'
                              : item.stock <= item.reorderPoint ? 'text-[var(--status-low-text)]' : ''
                            }>
                              {item.stock}
                              {item.stock > 0 && item.stock <= item.reorderPoint && (
                                <span className="text-[10px] ml-1">LOW</span>
                              )}
                            </span>
                          </DrawerField>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <DrawerField label="Categories">{catNames}</DrawerField>
                          <DrawerField label="Featured">{item.isFeatured ? '⭐ Yes' : '—'}</DrawerField>
                        </div>
                        {item.compareAtPrice > item.price && (
                          <div className="flex gap-2 flex-wrap">
                            <DrawerField label="MRP">₹{item.compareAtPrice.toLocaleString()}</DrawerField>
                            <DrawerField label="Discount">
                              {Math.round((1 - item.price / item.compareAtPrice) * 100)}% off
                            </DrawerField>
                          </div>
                        )}
                        <div className="flex gap-2 pt-1">
                          <button className="site-btn site-btn-outline site-btn-sm flex-1"
                            onClick={() => openEdit(item)}>Edit</button>
                          <button className="site-btn site-btn-danger site-btn-sm flex-1"
                            onClick={() => setDeleteTarget({ slug: item.slug, name: item.name })}>Delete</button>
                          {item.stock <= item.reorderPoint && (
                            <button className="site-btn site-btn-sm"
                              style={{ backgroundColor: 'var(--status-featured-bg)', color: 'var(--status-featured-text)', border: 'none' }}
                              onClick={() => navigate('/products/add')}>Reorder</button>
                          )}
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
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── GRID VIEW ── */}
        {!loading && !fetchError && layout === 'grid' && (
          <div className="p-4">
            {filtered.length === 0 ? (
              <div className="site-empty-state">
                <div className="site-empty-icon">📦</div>
                <p className="site-empty-title">No products found</p>
                <p className="site-empty-desc">Try adjusting filters or add your first product</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {filtered.map(item => {
                  const status   = getStockStatus(item.stock, item.inStock, item.reorderPoint);
                  const catNames = resolveNames(item.categoryIds);
                  const allImgs  = [item.imageUrl, ...item.images].filter(u => typeof u === 'string' && u.trim() !== '');
                  return (
                    <div key={item.id}
                      className="group site-card overflow-hidden hover:shadow-md transition-all flex flex-col"
                      style={{ borderRadius: '1rem' }}>

                      <div className="relative">
                        <CardImageSlider mainUrl={item.imageUrl} extras={item.images} />
                        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
                          <span className={`site-badge site-badge--${status}`}>
                            <span className="site-badge-dot" />
                            {STATUS_LABEL[status]}
                          </span>
                          {item.isFeatured && (
                            <span className="site-featured-badge">⭐ Featured</span>
                          )}
                        </div>
                      </div>

                      <div className="p-3 flex flex-col gap-1.5 flex-1">
                        <p className="text-sm font-semibold site-heading leading-snug line-clamp-2">{item.name}</p>
                        <div className="text-[10px]">
                          <SlugCell slug={item.slug} />
                        </div>
                        {catNames !== '—' && (
                          <span className="text-[10px] site-surface-secondary site-subtext px-1.5 py-0.5 rounded-md site-truncate block"
                            title={catNames}>{catNames}</span>
                        )}

                        <div className="flex items-baseline gap-1.5 mt-auto pt-1">
                          <span className="text-sm font-bold site-heading">₹{item.price.toLocaleString()}</span>
                          {item.compareAtPrice > item.price && (
                            <span className="site-price-strike">₹{item.compareAtPrice.toLocaleString()}</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs site-subtext">
                          <span className={`font-semibold ${
                            item.stock === 0                  ? 'text-[var(--status-out-text)]'
                            : item.stock <= item.reorderPoint ? 'text-[var(--status-low-text)]'
                            : 'site-heading'
                          }`}>
                            Qty: {item.stock}
                            {item.stock > 0 && item.stock <= item.reorderPoint && (
                              <span className="text-[var(--status-out-text)] ml-1">LOW</span>
                            )}
                          </span>
                          {allImgs.length > 1 && (
                            <span className="text-[10px] site-text-muted">{allImgs.length} photos</span>
                          )}
                        </div>

                        <div className="flex gap-1.5 pt-1">
                          <button className="site-btn site-btn-outline site-btn-sm flex-1"
                            onClick={() => openEdit(item)}>Edit</button>
                          <button className="site-btn site-btn-danger site-btn-sm"
                            onClick={() => setDeleteTarget({ slug: item.slug, name: item.name })}>Delete</button>
                          {item.stock <= item.reorderPoint && (
                            <button className="site-btn site-btn-sm"
                              style={{ backgroundColor: 'var(--status-featured-bg)', color: 'var(--status-featured-text)', border: 'none' }}
                              onClick={() => navigate('/products/add')}>Reorder</button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Low stock alert footer ── */}
        {!loading && !fetchError && (lowCount > 0 || outCount > 0) && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 py-3 site-border-top"
            style={{ backgroundColor: 'var(--status-featured-bg)', borderTop: '1px solid rgba(247,144,9,0.30)' }}>
            <span className="text-lg shrink-0">⚠️</span>
            <span className="text-sm font-medium" style={{ color: 'var(--status-featured-text)' }}>
              {outCount > 0 && `${outCount} item${outCount > 1 ? 's' : ''} out of stock`}
              {outCount > 0 && lowCount > 0 && ' · '}
              {lowCount > 0 && `${lowCount} item${lowCount > 1 ? 's' : ''} running low`}. Consider restocking soon.
            </span>
            <button
              className="sm:ml-auto shrink-0 site-btn site-btn-sm"
              style={{ backgroundColor: 'var(--featured-color)', color: '#fff', border: 'none' }}
              onClick={() => setFilterStatus(outCount > 0 ? 'out' : 'low')}>
              View {outCount > 0 ? 'Out of Stock' : 'Low Stock'} →
            </button>
          </div>
        )}
      </div>

      {/* ── Edit Product Dialog ── */}
      {editItem && editForm && createPortal(
        <div className="site-modal-overlay">
          <div className="site-modal">

            <div className="site-modal-header">
              <div>
                <h2 className="h3 site-heading">Edit Product</h2>
                <p className="text-xs site-mono site-text-muted mt-0.5">{editItem.slug}</p>
              </div>
              <button className="site-btn-icon" onClick={closeEdit}>×</button>
            </div>

            <div className="site-tabs-underline shrink-0">
              {([
                { id: 'basic',     label: '📝 Basic',     desc: 'Name, images, categories' },
                { id: 'pricing',   label: '💰 Pricing',   desc: 'Price, MRP'               },
                { id: 'inventory', label: '📦 Inventory', desc: 'Stock, featured'          },
              ] as const).map(tab => (
                <button key={tab.id}
                  className={`site-tab-underline ${editTab === tab.id ? 'site-tab-underline--active' : ''}`}
                  onClick={() => setEditTab(tab.id)}>
                  <div className="text-xs font-bold">{tab.label}</div>
                  <div className="text-[10px] site-text-muted mt-0.5 hidden sm:block">{tab.desc}</div>
                </button>
              ))}
            </div>

            <div className="site-modal-body space-y-4">

              {editTab === 'basic' && (
                <div className="space-y-4">
                  <ImageGallery mainUrl={editForm.imageUrl} extras={editForm.images ?? []} />
                  <div>
                    <label className="site-label">Product Name <span className="text-[var(--danger-solid)]">*</span></label>
                    <input value={editForm.name} onChange={e => updateField('name', e.target.value)} className="site-input" />
                  </div>
                  <div>
                    <label className="site-label">Slug <span className="text-[var(--danger-solid)]">*</span></label>
                    <input value={editForm.slug} onChange={e => updateField('slug', e.target.value)}
                      className="site-input site-input-mono" />
                    <p className="text-[11px] site-text-muted mt-1">⚠️ Changing slug will break existing links</p>
                  </div>
                  <CategorySelector storeUsername={storeUsername} selectedIds={editForm.categoryIds}
                    onChange={ids => updateField('categoryIds', ids)} allowCreate required />
                  <div>
                    <label className="site-label">Description</label>
                    <textarea value={editForm.description} onChange={e => updateField('description', e.target.value)}
                      rows={3} className="site-input" />
                  </div>
                  <div>
                    <label className="site-label">Tags <span className="font-normal text-xs site-text-muted">(comma separated)</span></label>
                    <input value={editForm.tagsInput} onChange={e => updateField('tagsInput', e.target.value)}
                      placeholder="wireless, earbuds" className="site-input" />
                  </div>
                  <div>
                    <label className="site-label">Main Image</label>
                    <div className="flex items-center gap-3 flex-wrap">
                      <CloudinaryUploadWidget onUpload={handleMainImageUpload} />
                      {editForm.imageUrl && (
                        <div className="relative site-thumb shrink-0"
                          style={{ width: '4rem', height: '4rem', border: '1px solid var(--border-medium)' }}>
                          <img src={editForm.imageUrl} alt="Main" className="w-full h-full object-cover" />
                          <button type="button"
                            className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center hover:bg-red-600"
                            onClick={() => updateField('imageUrl', '')}>✕</button>
                        </div>
                      )}
                    </div>
                    {editForm.imageUrl && (
                      <p className="text-[11px] site-text-muted mt-1.5 site-truncate">{editForm.imageUrl}</p>
                    )}
                  </div>
                  <div>
                    <label className="site-label">
                      Additional Images
                      <span className="font-normal text-xs site-text-muted ml-1.5">
                        ({(editForm.images ?? []).length}/{MAX_ADDITIONAL_IMAGES})
                      </span>
                    </label>
                    <div className="flex items-center gap-3 flex-wrap">
                      {(editForm.images ?? []).map((url, i) => (
                        <div key={url} className="relative site-thumb shrink-0"
                          style={{ width: '4rem', height: '4rem', border: '1px solid var(--border-medium)' }}>
                          <img src={url} alt={`Extra ${i + 1}`} className="w-full h-full object-cover" />
                          <button type="button"
                            className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center hover:bg-red-600"
                            onClick={() => removeAdditionalImage(i)}>✕</button>
                        </div>
                      ))}
                      {(editForm.images ?? []).length < MAX_ADDITIONAL_IMAGES && (
                        <CloudinaryUploadWidget onUpload={handleAdditionalImageUpload} />
                      )}
                    </div>
                    {(editForm.images ?? []).length >= MAX_ADDITIONAL_IMAGES && (
                      <p className="text-[11px] site-text-muted mt-1.5">
                        Maximum additional images reached. Remove one to upload another.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {editTab === 'pricing' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="site-label">Selling Price <span className="text-[var(--danger-solid)]">*</span></label>
                      <div className="site-input-prefix">
                        <span className="site-input-prefix-icon">₹</span>
                        <input type="number" min="0.01" step="0.01" value={editForm.price || ''}
                          onChange={e => updateField('price', Number(e.target.value))}
                          placeholder="0.00" className="site-input" />
                      </div>
                    </div>
                    <div>
                      <label className="site-label">MRP / Compare At</label>
                      <div className="site-input-prefix">
                        <span className="site-input-prefix-icon">₹</span>
                        <input type="number" min="0" step="0.01" value={editForm.compareAtPrice || ''}
                          onChange={e => updateField('compareAtPrice', Number(e.target.value))}
                          placeholder="0.00" className="site-input" />
                      </div>
                    </div>
                  </div>
                  {editForm.compareAtPrice > editForm.price && editForm.price > 0 && (
                    <div className="site-price-save">
                      <span className="text-2xl">🎉</span>
                      <div>
                        <p className="font-bold">{Math.round((1 - editForm.price / editForm.compareAtPrice) * 100)}% OFF</p>
                        <p className="text-xs font-normal">
                          Customers save ₹{(editForm.compareAtPrice - editForm.price).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {editTab === 'inventory' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="site-label">Availability</label>
                      <select
                        value={editForm.inStock ? 'true' : 'false'}
                        onChange={e => {
                          const inStock = e.target.value === 'true';
                          updateField('inStock', inStock);
                          if (!inStock) updateField('stockCount', 0);
                        }}
                        className="site-input">
                        <option value="true">In Stock</option>
                        <option value="false">Out of Stock</option>
                      </select>
                    </div>
                    <div>
                      <label className="site-label">
                        Stock Count <span className="text-[var(--danger-solid)]">*</span>
                      </label>
                      <input
                        type="number" min="0"
                        value={editForm.inStock ? (editForm.stockCount || '') : 0}
                        onChange={e => {
                          if (editForm.inStock) updateField('stockCount', Number(e.target.value));
                        }}
                        disabled={!editForm.inStock}
                        placeholder="0"
                        className="site-input"
                        style={!editForm.inStock ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
                      />
                      {!editForm.inStock && (
                        <p className="text-[11px] mt-1 site-text-muted">Set availability to In Stock to edit</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="site-label">Featured / Sale Event</label>
                    <div className={`site-toggle-wrap ${editForm.isFeatured ? 'site-toggle-wrap--on' : ''}`}
                      onClick={() => updateField('isFeatured', !editForm.isFeatured)}>
                      <div className={`site-toggle-track ${editForm.isFeatured ? 'site-toggle-track--on' : ''}`}>
                        <span className="site-toggle-thumb" />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-bold ${editForm.isFeatured ? 'text-[var(--featured-text)]' : 'site-heading'}`}>
                          {editForm.isFeatured ? '⭐ Featured Product' : 'Not Featured'}
                        </p>
                        <p className="text-xs mt-0.5 site-text-muted">
                          Flag for special occasions, events, or sale campaigns
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`site-banner ${
                    !editForm.inStock || editForm.stockCount === 0 ? 'site-banner-error'
                    : editForm.stockCount <= REORDER_POINT ? ''
                    : 'site-banner-success'
                  }`} style={editForm.stockCount > 0 && editForm.stockCount <= REORDER_POINT
                    ? { backgroundColor: 'var(--status-featured-bg)', border: '1px solid rgba(247,144,9,0.3)', color: 'var(--status-featured-text)' }
                    : undefined}>
                    <p className="font-semibold text-sm">Status Preview</p>
                    <p className="text-sm">
                      {!editForm.inStock || editForm.stockCount === 0 ? '❌ Out of Stock'
                        : editForm.stockCount <= REORDER_POINT ? '⚠️ Low Stock'
                        : '✅ In Stock'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {editError && (
              <div className="site-banner site-banner-error mx-6 mb-0 shrink-0">
                <span>⚠️ {editError}</span>
                <button className="text-lg leading-none opacity-60 hover:opacity-100 ml-2"
                  onClick={() => setEditError(null)}>×</button>
              </div>
            )}

            <div className="site-modal-footer">
              <div className="flex gap-2 mr-auto">
                {editTab !== 'basic' && (
                  <button className="site-btn site-btn-ghost site-btn-sm"
                    onClick={() => setEditTab(editTab === 'inventory' ? 'pricing' : 'basic')}>← Back</button>
                )}
                {editTab !== 'inventory' && (
                  <button className="site-btn site-btn-outline site-btn-sm"
                    onClick={() => setEditTab(editTab === 'basic' ? 'pricing' : 'inventory')}>Next →</button>
                )}
              </div>
              <button className="site-btn site-btn-ghost site-btn-sm" onClick={closeEdit}>Cancel</button>
              <button className="site-btn site-btn-primary site-btn-sm" onClick={handleSave} disabled={saving}>
                {saving ? <><span className="site-spinner" /> Saving…</> : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── Delete Confirm Dialog ── */}
      {deleteTarget && createPortal(
        <div className="site-modal-overlay">
          <div className="site-modal site-modal-sm">
            <div className="site-modal-body text-center">
              <h2 className="h3 site-heading mb-2">Delete Product?</h2>
              <p className="text-sm site-subtext mb-1">You are about to delete:</p>
              <p className="text-sm font-semibold site-heading mb-4">"{deleteTarget.name}"</p>
              <p className="text-xs text-[var(--danger-solid)] mb-2">This action cannot be undone.</p>
            </div>
            <div className="site-modal-footer">
              <button className="site-btn site-btn-ghost flex-1"
                onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="site-btn flex-1 disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--danger-solid)', color: '#fff', border: 'none',
                  borderRadius: '0.75rem', padding: '0.625rem 1.25rem', fontWeight: 600,
                  cursor: deleting ? 'not-allowed' : 'pointer',
                }}
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