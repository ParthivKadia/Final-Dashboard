import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: number; name: string; slug: string; emoji: string;
  products: number; active: number; revenue: string; growth: string; color: string; bg: string; textColor: string;
}

const categories: Category[] = [
  { id: 1, name: 'Electronics',    slug: 'electronics',   emoji: '📱', products: 42, active: 38, revenue: '₹8.4L', growth: '+24%', color: 'bg-blue-50',   textColor: 'text-blue-600',   bg: '#eff6ff' },
  { id: 2, name: 'Clothing',       slug: 'clothing',       emoji: '👕', products: 31, active: 28, revenue: '₹3.2L', growth: '+12%', color: 'bg-violet-50', textColor: 'text-violet-600', bg: '#f5f3ff' },
  { id: 3, name: 'Home & Kitchen', slug: 'home-kitchen',   emoji: '🏠', products: 24, active: 22, revenue: '₹2.1L', growth: '+18%', color: 'bg-cyan-50',   textColor: 'text-cyan-600',   bg: '#ecfeff' },
  { id: 4, name: 'Books',          slug: 'books',          emoji: '📚', products: 18, active: 18, revenue: '₹1.8L', growth: '+31%', color: 'bg-green-50',  textColor: 'text-green-600',  bg: '#f0fdf4' },
  { id: 5, name: 'Beauty',         slug: 'beauty',         emoji: '🧴', products: 8,  active: 7,  revenue: '₹1.1L', growth: '+45%', color: 'bg-pink-50',   textColor: 'text-pink-600',   bg: '#fdf2f8' },
  { id: 6, name: 'Sports',         slug: 'sports',         emoji: '🏃', products: 5,  active: 5,  revenue: '₹0.9L', growth: '+8%',  color: 'bg-amber-50',  textColor: 'text-amber-600',  bg: '#fffbeb' },
];

export default function Categories() {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', emoji: '📦', description: '' });
  const [search, setSearch] = useState('');

  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const totalProducts = categories.reduce((s, c) => s + c.products, 0);

  const inp = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all";

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-5 md:p-7">

      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
          <p className="text-sm text-slate-500 mt-0.5">Organize your products into categories for better discoverability</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="shrink-0 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
        >
          + New Category
        </button>
      </div>

      {/* ── Summary Bar ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5">
        {[
          { label: 'Total Categories', value: categories.length,  icon: '📋', color: 'text-blue-600',  bg: 'bg-blue-50'  },
          { label: 'Total Products',   value: totalProducts,       icon: '📦', color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Best Performing',  value: 'Electronics',       icon: '🏆', color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center text-2xl shrink-0`}>{s.icon}</div>
            <div>
              <p className="text-sm text-slate-500">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search ── */}
      <div className="relative mb-5 max-w-sm">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search categories..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
        />
      </div>

      {/* ── Category Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {filtered.map(cat => {
          const activePct = Math.round((cat.active / cat.products) * 100);
          return (
            <div
              key={cat.id}
              onClick={() => navigate(`/products/category/${cat.slug}`)}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-13 h-13 w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center text-2xl`}>{cat.emoji}</div>
                  <div>
                    <p className="text-base font-bold text-slate-900">{cat.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{cat.products} products</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full shrink-0">{cat.growth}</span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: 'Products', value: cat.products },
                  { label: 'Active',   value: cat.active   },
                  { label: 'Revenue',  value: cat.revenue  },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-2.5 text-center">
                    <p className="text-sm font-bold text-slate-900">{value}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-500">Active rate</span>
                  <span className={`font-semibold ${cat.textColor}`}>{activePct}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-1.5 rounded-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${activePct}%`, background: cat.bg === '#eff6ff' ? '#3b82f6' : cat.bg === '#f5f3ff' ? '#7c3aed' : cat.bg === '#ecfeff' ? '#0891b2' : cat.bg === '#f0fdf4' ? '#16a34a' : cat.bg === '#fdf2f8' ? '#db2777' : '#d97706' }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => navigate(`/products/category/${cat.slug}`)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold ${cat.color} ${cat.textColor} hover:opacity-80 transition-opacity`}
                >
                  View Products →
                </button>
                <button className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-500 text-sm hover:bg-slate-50 transition-colors">✏️</button>
                <button className="px-3 py-2 rounded-xl border border-red-100 bg-white text-red-500 text-sm hover:bg-red-50 transition-colors">🗑️</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Add Category Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900 mb-5">Create New Category</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Emoji Icon</label>
                <input value={newCat.emoji} onChange={e => setNewCat(p => ({ ...p, emoji: e.target.value }))}
                  className="w-20 px-3 py-2.5 rounded-xl border border-slate-200 text-2xl text-center outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category Name *</label>
                <input value={newCat.name} onChange={e => setNewCat(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Sports & Fitness" className={inp} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea value={newCat.description} onChange={e => setNewCat(p => ({ ...p, description: e.target.value }))}
                  placeholder="Brief description of this category..." rows={3}
                  className={`${inp} resize-none`} />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
                Create Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// // FILE: src/pages/Products/Categories.tsx
// // PASTE: Create this new file at src/pages/Products/Categories.tsx

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// interface Category {
//   id: number; name: string; slug: string; emoji: string;
//   products: number; active: number; revenue: string; growth: string; color: string; bg: string;
// }

// const categories: Category[] = [
//   { id: 1, name: 'Electronics', slug: 'electronics', emoji: '📱', products: 42, active: 38, revenue: '₹8.4L', growth: '+24%', color: '#2563eb', bg: '#eff6ff' },
//   { id: 2, name: 'Clothing', slug: 'clothing', emoji: '👕', products: 31, active: 28, revenue: '₹3.2L', growth: '+12%', color: '#7c3aed', bg: '#f5f3ff' },
//   { id: 3, name: 'Home & Kitchen', slug: 'home-kitchen', emoji: '🏠', products: 24, active: 22, revenue: '₹2.1L', growth: '+18%', color: '#0891b2', bg: '#ecfeff' },
//   { id: 4, name: 'Books', slug: 'books', emoji: '📚', products: 18, active: 18, revenue: '₹1.8L', growth: '+31%', color: '#16a34a', bg: '#f0fdf4' },
//   { id: 5, name: 'Beauty', slug: 'beauty', emoji: '🧴', products: 8, active: 7, revenue: '₹1.1L', growth: '+45%', color: '#db2777', bg: '#fdf2f8' },
//   { id: 6, name: 'Sports', slug: 'sports', emoji: '🏃', products: 5, active: 5, revenue: '₹0.9L', growth: '+8%', color: '#d97706', bg: '#fffbeb' },
// ];

// export default function Categories() {
//   const navigate = useNavigate();
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [newCat, setNewCat] = useState({ name: '', emoji: '📦', description: '' });
//   const [search, setSearch] = useState('');

//   const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
//   const totalProducts = categories.reduce((s, c) => s + c.products, 0);

//   return (
//     <div style={{ padding: '28px', background: '#f8fafc', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>

//       {/* Header */}
//       <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
//         <div>
//           <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Categories</h1>
//           <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0' }}>Organize your products into categories for better discoverability</p>
//         </div>
//         <button onClick={() => setShowAddModal(true)} style={{
//           padding: '10px 20px', borderRadius: '10px', border: 'none',
//           background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff',
//           fontSize: '14px', fontWeight: 600, cursor: 'pointer',
//           boxShadow: '0 4px 12px rgba(37,99,235,0.35)'
//         }}>+ New Category</button>
//       </div>

//       {/* Summary Bar */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
//         {[
//           { label: 'Total Categories', value: categories.length, icon: '📋', color: '#2563eb', bg: '#eff6ff' },
//           { label: 'Total Products', value: totalProducts, icon: '📦', color: '#16a34a', bg: '#f0fdf4' },
//           { label: 'Best Performing', value: 'Electronics', icon: '🏆', color: '#d97706', bg: '#fffbeb' },
//         ].map(s => (
//           <div key={s.label} style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '16px' }}>
//             <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{s.icon}</div>
//             <div>
//               <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '2px' }}>{s.label}</div>
//               <div style={{ fontSize: '22px', fontWeight: 700, color: s.color }}>{s.value}</div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Search */}
//       <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '360px' }}>
//         <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
//         <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search categories..."
//           style={{
//             width: '100%', padding: '10px 12px 10px 36px', borderRadius: '10px',
//             border: '1.5px solid #e2e8f0', fontSize: '13px', background: '#fff',
//             outline: 'none', boxSizing: 'border-box'
//           }} />
//       </div>

//       {/* Category Cards Grid */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', marginBottom: '24px' }}>
//         {filtered.map(cat => (
//           <div key={cat.id} style={{
//             background: '#fff', borderRadius: '16px', padding: '24px',
//             border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
//             cursor: 'pointer', transition: 'all 0.2s',
//           }}
//             onClick={() => navigate(`/products/category/${cat.slug}`)}
//             onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 28px rgba(0,0,0,0.1)'; }}
//             onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; }}
//           >
//             <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
//                 <div style={{ width: '54px', height: '54px', borderRadius: '14px', background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>{cat.emoji}</div>
//                 <div>
//                   <div style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>{cat.name}</div>
//                   <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{cat.products} products</div>
//                 </div>
//               </div>
//               <span style={{ fontSize: '12px', fontWeight: 700, color: '#16a34a', background: '#f0fdf4', padding: '4px 10px', borderRadius: '20px' }}>{cat.growth}</span>
//             </div>

//             {/* Stats Row */}
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
//               {[
//                 { label: 'Products', value: cat.products },
//                 { label: 'Active', value: cat.active },
//                 { label: 'Revenue', value: cat.revenue },
//               ].map(({ label, value }) => (
//                 <div key={label} style={{ background: '#f8fafc', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
//                   <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{value}</div>
//                   <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{label}</div>
//                 </div>
//               ))}
//             </div>

//             {/* Progress Bar */}
//             <div>
//               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
//                 <span style={{ fontSize: '12px', color: '#64748b' }}>Active rate</span>
//                 <span style={{ fontSize: '12px', fontWeight: 600, color: cat.color }}>{Math.round((cat.active / cat.products) * 100)}%</span>
//               </div>
//               <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
//                 <div style={{
//                   height: '100%', width: `${(cat.active / cat.products) * 100}%`,
//                   background: `linear-gradient(90deg, ${cat.color}aa, ${cat.color})`,
//                   borderRadius: '6px', transition: 'width 0.6s'
//                 }} />
//               </div>
//             </div>

//             {/* Action buttons */}
//             <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }} onClick={e => e.stopPropagation()}>
//               <button onClick={() => navigate(`/products/category/${cat.slug}`)} style={{
//                 flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
//                 background: cat.bg, color: cat.color, fontSize: '13px', fontWeight: 600, cursor: 'pointer'
//               }}>View Products →</button>
//               <button style={{ padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: '13px', cursor: 'pointer' }}>✏️</button>
//               <button style={{ padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #fee2e2', background: '#fff', color: '#dc2626', fontSize: '13px', cursor: 'pointer' }}>🗑️</button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Add Category Modal */}
//       {showAddModal && (
//         <div style={{
//           position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
//           display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
//         }}>
//           <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '420px' }}>
//             <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 20px' }}>Create New Category</h2>
//             <div style={{ display: 'grid', gap: '16px' }}>
//               <div>
//                 <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>Emoji Icon</label>
//                 <input value={newCat.emoji} onChange={e => setNewCat(p => ({ ...p, emoji: e.target.value }))}
//                   style={{ width: '80px', padding: '10px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '24px', textAlign: 'center' }} />
//               </div>
//               <div>
//                 <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>Category Name *</label>
//                 <input value={newCat.name} onChange={e => setNewCat(p => ({ ...p, name: e.target.value }))}
//                   placeholder="e.g. Sports & Fitness"
//                   style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />
//               </div>
//               <div>
//                 <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>Description</label>
//                 <textarea value={newCat.description} onChange={e => setNewCat(p => ({ ...p, description: e.target.value }))}
//                   placeholder="Brief description of this category..."
//                   rows={3} style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', resize: 'none' }} />
//               </div>
//             </div>
//             <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
//               <button onClick={() => setShowAddModal(false)} style={{
//                 flex: 1, padding: '11px', borderRadius: '10px', border: '1.5px solid #e2e8f0',
//                 background: '#fff', color: '#374151', fontSize: '14px', fontWeight: 500, cursor: 'pointer'
//               }}>Cancel</button>
//               <button style={{
//                 flex: 1, padding: '11px', borderRadius: '10px', border: 'none',
//                 background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff',
//                 fontSize: '14px', fontWeight: 600, cursor: 'pointer'
//               }}>Create Category</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }