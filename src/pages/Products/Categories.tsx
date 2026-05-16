// src/pages/Categories/Categories.tsx
// All colours/surfaces come from site-theme.css — zero inline style={{ color/bg }} needed.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: number; name: string; slug: string; emoji: string;
  products: number; active: number; revenue: string; growth: string;
}

const BAR_COLORS = ['#1a56db', '#7c3aed', '#0891b2', '#16a34a', '#db2777', '#d97706'];

const categories: Category[] = [
  { id: 1, name: 'Electronics',    slug: 'electronics',  emoji: '📱', products: 42, active: 38, revenue: '₹8.4L', growth: '+24%' },
  { id: 2, name: 'Clothing',       slug: 'clothing',      emoji: '👕', products: 31, active: 28, revenue: '₹3.2L', growth: '+12%' },
  { id: 3, name: 'Home & Kitchen', slug: 'home-kitchen',  emoji: '🏠', products: 24, active: 22, revenue: '₹2.1L', growth: '+18%' },
  { id: 4, name: 'Books',          slug: 'books',         emoji: '📚', products: 18, active: 18, revenue: '₹1.8L', growth: '+31%' },
  { id: 5, name: 'Beauty',         slug: 'beauty',        emoji: '🧴', products: 8,  active: 7,  revenue: '₹1.1L', growth: '+45%' },
  { id: 6, name: 'Sports',         slug: 'sports',        emoji: '🏃', products: 5,  active: 5,  revenue: '₹0.9L', growth: '+8%'  },
];

export default function Categories() {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', emoji: '📦', description: '' });
  const [search, setSearch] = useState('');

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalProducts = categories.reduce((s, c) => s + c.products, 0);

  return (
    <div className="site-page site-page-padding">

      {/* ── Header ── */}
      <div className="site-page-header">
        <div>
          <h1 className="site-page-title">Categories</h1>
          <p className="site-page-subtitle">Organize your products into categories for better discoverability</p>
        </div>
        <button className="site-btn site-btn-primary" onClick={() => setShowAddModal(true)}>
          + New Category
        </button>
      </div>

      {/* ── Summary Bar ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5">
        {[
          { label: 'Total Categories', value: categories.length, icon: '📋' },
          { label: 'Total Products',   value: totalProducts,     icon: '📦' },
          { label: 'Best Performing',  value: 'Electronics',     icon: '🏆' },
        ].map(s => (
          <div key={s.label} className="site-card site-card-body flex items-center gap-4">
            <div className="site-emoji-wrap">{s.icon}</div>
            <div>
              <p className="site-label-xs">{s.label}</p>
              <p className="site-stat-card-value">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search ── */}
      <div className="site-search-wrap max-w-sm mb-5">
        {/* <span className="site-search-icon text-sm">🔍</span> */}
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search categories…" className="site-input" />
      </div>

      {/* ── Category Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {filtered.map((cat, idx) => {
          const activePct = Math.round((cat.active / cat.products) * 100);
          return (
            <div key={cat.id} className="site-cat-card"
              onClick={() => navigate(`/products/category/${cat.slug}`)}>

              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="site-emoji-wrap">{cat.emoji}</div>
                  <div>
                    <p className="h5 site-heading">{cat.name}</p>
                    <p className="text-xs site-subtext mt-0.5">{cat.products} products</p>
                  </div>
                </div>
                <span className="site-badge site-badge--growth">{cat.growth}</span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: 'Products', value: cat.products },
                  { label: 'Active',   value: cat.active   },
                  { label: 'Revenue',  value: cat.revenue  },
                ].map(({ label, value }) => (
                  <div key={label} className="site-stat-cell">
                    <p className="text-sm font-bold site-heading">{value}</p>
                    <p className="text-[11px] mt-0.5 site-text-muted">{label}</p>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="site-text-muted">Active rate</span>
                  <span className="font-semibold site-text-brand">{activePct}%</span>
                </div>
                <div className="site-progress-track">
                  <div style={{
                    width: `${activePct}%`, height: '100%',
                    borderRadius: '9999px',
                    backgroundColor: BAR_COLORS[idx % BAR_COLORS.length],
                    transition: 'width 0.5s',
                  }} />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                <button className="site-btn site-btn-outline flex-1 site-btn-sm"
                  onClick={() => navigate(`/products/category/${cat.slug}`)}>
                  View Products →
                </button>
                <button className="site-btn site-btn-ghost site-btn-sm site-btn-icon">✏️</button>
                <button className="site-btn site-btn-danger site-btn-sm site-btn-icon">🗑️</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Add Category Modal ── */}
      {showAddModal && (
        <div className="site-modal-overlay">
          <div className="site-modal">
            <div className="site-modal-header">
              <h2 className="h3 site-heading">Create New Category</h2>
              <button className="site-btn-icon" onClick={() => setShowAddModal(false)}>×</button>
            </div>

            <div className="site-modal-body space-y-4">
              <div>
                <label className="site-label">Emoji Icon</label>
                <input value={newCat.emoji}
                  onChange={e => setNewCat(p => ({ ...p, emoji: e.target.value }))}
                  className="site-input text-2xl text-center" style={{ width: '80px' }} />
              </div>
              <div>
                <label className="site-label">
                  Category Name <span className="text-[var(--danger-solid)]">*</span>
                </label>
                <input value={newCat.name}
                  onChange={e => setNewCat(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Sports & Fitness" className="site-input" />
              </div>
              <div>
                <label className="site-label">Description</label>
                <textarea value={newCat.description}
                  onChange={e => setNewCat(p => ({ ...p, description: e.target.value }))}
                  placeholder="Brief description of this category…" rows={3}
                  className="site-input" />
              </div>
            </div>

            <div className="site-modal-footer">
              <button className="site-btn site-btn-ghost flex-1" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="site-btn site-btn-primary flex-1">Create Category</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}