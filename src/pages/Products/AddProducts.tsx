// src/pages/Products/AddProduct.tsx
// All colours/surfaces come from site-theme.css — zero inline style={{ color/bg }} needed.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../services/productService';
import { userDetails } from '../../services/userService';
import { useCategoryStore } from '../../store/useCategoryStore';
import type { Store } from '../../types/store';
import CategorySelector from '../Categories/CategorySelector';
import CloudinaryUploadWidget from '../../ImageUpload';
import { generateSlug } from '../../utils/slug';

const MAX_ADDITIONAL_IMAGES = 2;

interface FormData {
  name:           string;
  slug:           string;
  description:    string;
  categoryIds:    number[];
  tags:           string;
  imageUrl:       string;
  images:         string[];
  price:          string;
  compareAtPrice: string;
  currency:       string;
  stockCount:     string;
  inStock:        boolean;
  isFeatured:     boolean;
}

const emptyForm = (): FormData => ({
  name: '', slug: '', description: '', categoryIds: [],
  tags: '', imageUrl: '', images: [], price: '', compareAtPrice: '', currency: 'INR',
  stockCount: '', inStock: true, isFeatured: false,
});

export default function AddProduct() {
  const navigate = useNavigate();

  const [stores, setStores]               = useState<Store[]>([]);
  const [activeStore, setActiveStore]     = useState<Store | null>(null);
  const [storeDropdown, setStoreDropdown] = useState(false);
  const [initError, setInitError]         = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'inventory'>('basic');
  const [dragOver, setDragOver]   = useState(false);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [form, setForm]           = useState<FormData>(emptyForm());

  const storeUsername = activeStore?.username ?? '';

  const { fetchCategories } = useCategoryStore();
  useEffect(() => {
    if (storeUsername) fetchCategories(storeUsername);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeUsername]);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await userDetails();
        const userStores: Store[] = res?.data?.stores ?? [];
        if (userStores.length === 0) { setInitError('No store found. Please create a store first.'); return; }
        setStores(userStores);
        setActiveStore(userStores[0]);
      } catch { setInitError('Failed to load store info.'); }
    };
    init();
  }, []);

  const switchStore = (store: Store) => { setActiveStore(store); setStoreDropdown(false); };
  const update = <K extends keyof FormData>(field: K, value: FormData[K]) =>
    setForm(prev => ({ ...prev, [field]: value }));
  const handleNameChange = (name: string) =>
    setForm(prev => ({ ...prev, name, slug: generateSlug(name) }));
  const handleMainImageUpload       = (url: string) => update('imageUrl', url);
  const handleAdditionalImageUpload = (url: string) =>
    setForm(prev => {
      if (prev.images.length >= MAX_ADDITIONAL_IMAGES) return prev;
      return { ...prev, images: [...prev.images, url] };
    });
  const removeAdditionalImage = (index: number) =>
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));

  const validate = (): string | null => {
    if (!form.name.trim())                      { setActiveTab('basic');     return 'Product name is required.'; }
    if (!form.slug.trim())                      { setActiveTab('basic');     return 'Slug is required.'; }
    if (form.categoryIds.length === 0)          { setActiveTab('basic');     return 'At least one category is required.'; }
    if (!form.price || Number(form.price) <= 0) { setActiveTab('pricing');   return 'Selling price must be greater than 0.'; }
    if (!form.stockCount)                       { setActiveTab('inventory'); return 'Stock count is required.'; }
    return null;
  };

  const handlePublish = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    if (!storeUsername) { setError('Store not loaded yet. Please wait.'); return; }
    setSaving(true); setError(null);
    try {
      await createProduct(storeUsername, {
        name: form.name.trim(), slug: form.slug.trim(), description: form.description.trim(),
        categoryIds: form.categoryIds, price: Number(form.price),
        compareAtPrice: Number(form.compareAtPrice) || 0, currency: form.currency,
        imageUrl: form.imageUrl.trim(), images: form.images,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        inStock: form.inStock, stockCount: Number(form.stockCount) || 0, isFeatured: form.isFeatured,
      });
      navigate('/products');
    } catch (e: any) {
      setError(e?.message || 'Failed to create product. Please try again.');
    } finally { setSaving(false); }
  };

  const discount = form.compareAtPrice && form.price
    ? Math.round((1 - Number(form.price) / Number(form.compareAtPrice)) * 100) : 0;

  const checklist = [
    { label: 'Product name',      done: !!form.name },
    { label: 'Category selected', done: form.categoryIds.length > 0 },
    { label: 'Slug added',        done: !!form.slug },
    { label: 'Selling price set', done: !!form.price },
    { label: 'Stock quantity',    done: !!form.stockCount },
    { label: 'Description',       done: !!form.description },
    { label: 'Main image',        done: !!form.imageUrl },
  ];
  const progress = Math.round((checklist.filter(c => c.done).length / checklist.length) * 100);

  const tabs = [
    { id: 'basic',     label: 'Basic Info'    },
    { id: 'pricing',   label: 'Pricing & Tax' },
    { id: 'inventory', label: 'Inventory'     },
  ] as const;

  if (initError) return (
    <div className="site-page flex items-center justify-center h-screen">
      <div className="site-card p-8 max-w-sm w-full text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <p className="text-base font-semibold site-heading mb-2">{initError}</p>
        <button className="site-btn site-btn-primary mt-4" onClick={() => navigate('/products')}>
          Back to Products
        </button>
      </div>
    </div>
  );

  return (
    <div className="site-page site-page-padding">

      {/* ── Header ── */}
      <div className="site-page-header">
        <div className="flex items-center gap-3">
          <button className="site-back-btn" onClick={() => navigate('/products')}>←</button>
          <div>
            <h1 className="site-page-title">Add New Product</h1>
            {stores.length === 0 && <p className="site-page-subtitle">Loading store…</p>}
            {stores.length === 1 && <p className="site-page-subtitle">Adding to @{storeUsername}</p>}
            {stores.length > 1 && (
              <div className="relative mt-1.5">
                <button className="site-store-trigger" onClick={() => setStoreDropdown(v => !v)}>
                  {activeStore?.logoUrl && (
                    <img src={activeStore.logoUrl} alt="" className="w-4 h-4 rounded-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  )}
                  <span className="font-semibold site-heading">{activeStore?.name}</span>
                  <span className="site-subtext text-xs">@{activeStore?.username}</span>
                  <span className="site-badge site-badge--brand">{stores.length} stores</span>
                  <span className="site-text-muted text-xs">▾</span>
                </button>

                {storeDropdown && (
                  <>
                    <div className="fixed inset-0 z-[100]" onClick={() => setStoreDropdown(false)} />
                    <div className="site-dropdown">
                      <p className="site-dropdown-label">Add product to</p>
                      {stores.map(store => (
                        <button key={store.id}
                          className={`site-dropdown-item ${activeStore?.id === store.id ? 'site-dropdown-item--active' : ''}`}
                          onClick={() => switchStore(store)}>
                          <div className="site-thumb site-thumb-sm" style={{ borderRadius: '0.75rem', width: '2rem', height: '2rem' }}>
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
            )}
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          <button className="site-btn site-btn-ghost site-btn-sm" onClick={() => navigate('/products')}>Cancel</button>
          <button className="site-btn site-btn-primary site-btn-sm" onClick={handlePublish}
            disabled={saving || !storeUsername}>
            {saving ? <><span className="site-spinner" /> Publishing…</> : 'Publish'}
          </button>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="site-banner site-banner-error mb-5">
          <span>⚠️ {error}</span>
          <button className="text-lg leading-none opacity-60 hover:opacity-100 ml-4"
            onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* ── Two-column layout ── */}
      <div className="flex flex-col lg:flex-row gap-5">

        {/* LEFT: Main form */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">

          {/* Tabs */}
          <div className="site-tabs">
            {tabs.map(tab => (
              <button key={tab.id}
                className={`site-tab ${activeTab === tab.id ? 'site-tab--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── BASIC INFO ── */}
          {activeTab === 'basic' && (
            <div className="site-card site-card-body">
              <h2 className="h3 site-heading mb-5">Product Information</h2>
              <div className="space-y-4">

                <div>
                  <label className="site-label">Product Name <span className="text-[var(--danger-solid)]">*</span></label>
                  <input value={form.name} onChange={e => handleNameChange(e.target.value)}
                    placeholder="e.g. Wireless Bluetooth Earbuds Pro" className="site-input" />
                </div>

                <div>
                  <label className="site-label">Slug <span className="text-[var(--danger-solid)]">*</span></label>
                  <input value={form.slug} readOnly onChange={e => update('slug', e.target.value)}
                    placeholder="wireless-bluetooth-earbuds-pro" className="site-input site-input-mono" />
                  <p className="text-[11px] mt-1 site-text-muted">Auto-generated · unique ID attached</p>
                </div>

                <CategorySelector storeUsername={storeUsername} selectedIds={form.categoryIds}
                  onChange={ids => update('categoryIds', ids)} allowCreate required />

                <div>
                  <label className="site-label">
                    Tags <span className="font-normal text-xs site-text-muted">(comma separated)</span>
                  </label>
                  <input value={form.tags} onChange={e => update('tags', e.target.value)}
                    placeholder="wireless, earbuds, bluetooth" className="site-input" />
                </div>

                <div>
                  <label className="site-label">Description</label>
                  <textarea value={form.description} onChange={e => update('description', e.target.value)}
                    placeholder="Describe your product in detail…" rows={5} className="site-input" />
                </div>

                {/* Main Image */}
                <div>
                  <label className="site-label">Main Image</label>
                  <div className="flex items-center gap-3 flex-wrap">
                    <CloudinaryUploadWidget onUpload={handleMainImageUpload} />
                    {form.imageUrl && (
                      <div className="relative site-thumb shrink-0" style={{ width: '4rem', height: '4rem', border: '1px solid var(--border-medium)' }}>
                        <img src={form.imageUrl} alt="Main preview" className="w-full h-full object-cover" />
                        <button type="button" className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center hover:bg-red-600"
                          onClick={() => update('imageUrl', '')}>✕</button>
                      </div>
                    )}
                  </div>
                  {form.imageUrl && <p className="text-[11px] mt-1.5 site-truncate site-text-muted">{form.imageUrl}</p>}
                </div>

                {/* Additional Images */}
                <div>
                  <label className="site-label">
                    Additional Images
                    <span className="font-normal text-xs ml-1.5 site-text-muted">
                      ({form.images.length}/{MAX_ADDITIONAL_IMAGES})
                    </span>
                  </label>
                  <div className="flex items-center gap-3 flex-wrap">
                    {form.images.map((url, i) => (
                      <div key={url} className="relative site-thumb shrink-0" style={{ width: '4rem', height: '4rem', border: '1px solid var(--border-medium)' }}>
                        <img src={url} alt={`Additional ${i + 1}`} className="w-full h-full object-cover" />
                        <button type="button" className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center hover:bg-red-600"
                          onClick={() => removeAdditionalImage(i)}>✕</button>
                      </div>
                    ))}
                    {form.images.length < MAX_ADDITIONAL_IMAGES && (
                      <CloudinaryUploadWidget onUpload={handleAdditionalImageUpload} />
                    )}
                  </div>
                  {form.images.length >= MAX_ADDITIONAL_IMAGES && (
                    <p className="text-[11px] mt-1.5 site-text-muted">Maximum additional images reached.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── PRICING ── */}
          {activeTab === 'pricing' && (
            <div className="site-card site-card-body">
              <h2 className="h3 site-heading mb-5">Pricing & Tax Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="site-label">Selling Price (₹) <span className="text-[var(--danger-solid)]">*</span></label>
                    <div className="site-input-prefix">
                      <span className="site-input-prefix-icon">₹</span>
                      <input value={form.price} onChange={e => update('price', e.target.value)}
                        placeholder="0.00" type="number" min="0" className="site-input" />
                    </div>
                  </div>
                  <div>
                    <label className="site-label">MRP / Original Price (₹)</label>
                    <div className="site-input-prefix">
                      <span className="site-input-prefix-icon">₹</span>
                      <input value={form.compareAtPrice} onChange={e => update('compareAtPrice', e.target.value)}
                        placeholder="0.00" type="number" min="0" className="site-input" />
                    </div>
                  </div>
                </div>

                {discount > 0 && (
                  <div className="site-price-save">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <p className="font-bold">{discount}% OFF</p>
                      <p className="text-xs font-normal">
                        Customers save ₹{(Number(form.compareAtPrice) - Number(form.price)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="site-label">Currency</label>
                  <select value={form.currency} onChange={e => update('currency', e.target.value)} className="site-input">
                    <option value="INR">INR (₹) — Indian Rupee</option>
                    <option value="USD">USD ($) — US Dollar</option>
                  </select>
                </div>

                {form.price && (
                  <div className="site-card site-card-body site-card-sm">
                    <p className="text-sm font-bold site-heading mb-3">Price Breakdown</p>
                    <div className="flex justify-between py-2">
                      <span className="text-sm site-subtext">Selling Price</span>
                      <span className="text-sm font-bold site-heading">₹{Number(form.price).toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── INVENTORY ── */}
          {activeTab === 'inventory' && (
            <div className="site-card site-card-body">
              <h2 className="h3 site-heading mb-5">Inventory Management</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="site-label">Available Stock <span className="text-[var(--danger-solid)]">*</span></label>
                    <input value={form.stockCount} onChange={e => update('stockCount', e.target.value)}
                      placeholder="0" type="number" min="0" className="site-input" />
                  </div>
                  <div>
                    <label className="site-label">Availability</label>
                    <select value={form.inStock ? 'true' : 'false'}
                      onChange={e => update('inStock', e.target.value === 'true')} className="site-input">
                      <option value="true">In Stock</option>
                      <option value="false">Out of Stock</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="site-label">Featured / Sale Event</label>
                  <div className={`site-toggle-wrap ${form.isFeatured ? 'site-toggle-wrap--on' : ''}`}
                    onClick={() => update('isFeatured', !form.isFeatured)}>
                    <div className={`site-toggle-track ${form.isFeatured ? 'site-toggle-track--on' : ''}`}>
                      <span className="site-toggle-thumb" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-bold ${form.isFeatured ? 'text-[var(--featured-text)]' : 'site-heading'}`}>
                        {form.isFeatured ? '⭐ Featured Product' : 'Not Featured'}
                      </p>
                      <p className="text-xs mt-0.5 site-text-muted">
                        Flag for special occasions, events, or sale campaigns
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Sidebar */}
        <div className="w-full lg:w-[300px] xl:w-[320px] shrink-0 flex flex-col gap-4">

          {/* Image Preview */}
          <div className="site-card site-card-body">
            <h3 className="h5 site-heading mb-4">Product Images</h3>

            {form.imageUrl ? (
              <div className="site-thumb mb-3 w-full h-40" style={{ border: '1px solid var(--border-subtle)' }}>
                <img src={form.imageUrl} alt="Main preview" className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            ) : (
              <div
                className={`site-upload-zone mb-3 ${dragOver ? 'site-upload-zone--active' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); }}>
                <div className="text-4xl mb-2">🖼️</div>
                <p className="text-sm font-semibold site-heading mb-1">No image yet</p>
                <p className="text-xs site-text-muted">Upload one in the Basic Info tab</p>
              </div>
            )}

            {form.images.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {form.images.map((url, i) => (
                  <div key={url} className="site-thumb" style={{ width: '3.5rem', height: '3.5rem', border: '1px solid var(--border-subtle)' }}>
                    <img src={url} alt={`Extra ${i + 1}`} className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-center mt-3 site-text-muted">
              {form.imageUrl ? '1 main' : '0 main'} + {form.images.length} additional image{form.images.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Publish Settings */}
          <div className="site-card site-card-body">
            <h3 className="h5 site-heading mb-4">Publish Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="site-label">Publishing to</label>
                <div className="site-input site-text-muted" style={{ cursor: 'not-allowed', backgroundColor: 'var(--surface-secondary)' }}>
                  {storeUsername ? `@${storeUsername}` : 'Loading…'}
                </div>
              </div>
              <div>
                <label className="site-label">Currency</label>
                <select value={form.currency} onChange={e => update('currency', e.target.value)} className="site-input">
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="site-card site-card-body">
            <h3 className="h5 site-heading mb-4">Listing Checklist</h3>
            <div className="site-checklist-widget">
              {checklist.map(({ label, done }) => (
                <div key={label} className={`site-checklist-item ${done ? 'site-checklist-item--done' : 'site-checklist-item--todo'}`}>
                  <span>{done ? '✅' : '⬜'}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <div className="site-progress-track mt-3">
              <div className="site-progress-bar" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs mt-1.5 site-text-muted">{progress}% complete</p>
          </div>

          {/* Bottom Publish Button */}
          <button className="site-btn site-btn-primary w-full py-3"
            onClick={handlePublish} disabled={saving || !storeUsername}>
            {saving ? <><span className="site-spinner" /> Publishing…</> : 'Publish Product'}
          </button>
        </div>
      </div>
    </div>
  );
}