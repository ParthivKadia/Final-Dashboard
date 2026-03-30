import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const products = [
  { id: 1,  emoji: '🎧', name: 'Wireless Earbuds Pro',    sku: 'WEP-001', category: 'Electronics',    price: 2499, stock: 142, status: 'Active',       sales: 320, rating: 4.5 },
  { id: 2,  emoji: '👕', name: 'Cotton Polo Shirt',       sku: 'CPS-112', category: 'Clothing',       price: 799,  stock: 7,   status: 'Low Stock',    sales: 89,  rating: 4.2 },
  { id: 3,  emoji: '🍳', name: 'Non-Stick Kadai 28cm',    sku: 'NSK-028', category: 'Home & Kitchen', price: 1299, stock: 58,  status: 'Active',       sales: 210, rating: 4.7 },
  { id: 4,  emoji: '🖥️', name: 'USB-C Hub 7-in-1',       sku: 'UCH-071', category: 'Electronics',    price: 1899, stock: 0,   status: 'Out of Stock', sales: 145, rating: 4.3 },
  { id: 5,  emoji: '📗', name: 'Clean Code Book',         sku: 'CCB-003', category: 'Books',          price: 549,  stock: 200, status: 'Active',       sales: 430, rating: 4.8 },
  { id: 6,  emoji: '⌚', name: 'Smart Watch Series 5',    sku: 'SWS-005', category: 'Electronics',    price: 4999, stock: 34,  status: 'Active',       sales: 178, rating: 4.6 },
  { id: 7,  emoji: '🎒', name: 'Laptop Backpack 30L',     sku: 'LBP-030', category: 'Clothing',       price: 1599, stock: 3,   status: 'Low Stock',    sales: 67,  rating: 4.1 },
  { id: 8,  emoji: '💡', name: 'Smart LED Bulb',          sku: 'SLB-010', category: 'Home & Kitchen', price: 399,  stock: 89,  status: 'Active',       sales: 560, rating: 4.4 },
  { id: 9,  emoji: '📘', name: 'Atomic Habits',           sku: 'AH-001',  category: 'Books',          price: 449,  stock: 150, status: 'Active',       sales: 720, rating: 4.9 },
  { id: 10, emoji: '🎮', name: 'Wireless Gamepad',        sku: 'WGP-004', category: 'Electronics',    price: 2199, stock: 0,   status: 'Out of Stock', sales: 98,  rating: 4.0 },
  { id: 11, emoji: '🧴', name: 'Vitamin C Serum',         sku: 'VCS-021', category: 'Beauty',         price: 899,  stock: 45,  status: 'Active',       sales: 380, rating: 4.6 },
  { id: 12, emoji: '🏃', name: 'Running Shoes X2',        sku: 'RSX-002', category: 'Clothing',       price: 3299, stock: 12,  status: 'Active',       sales: 155, rating: 4.3 },
];

const statusStyle: Record<string, string> = {
  'Active':       'bg-green-100 text-green-700',
  'Low Stock':    'bg-yellow-100 text-yellow-700',
  'Out of Stock': 'bg-red-100 text-red-600',
  'Draft':        'bg-blue-100 text-blue-700',
};
const statusDot: Record<string, string> = {
  'Active':       'bg-green-500',
  'Low Stock':    'bg-yellow-500',
  'Out of Stock': 'bg-red-500',
  'Draft':        'bg-blue-500',
};

const categories = ['All', 'Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Beauty'];

export default function AllProducts() {
  const navigate = useNavigate();
  const [search, setSearch]               = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus]     = useState('All');
  const [sortBy, setSortBy]               = useState('name');
  const [viewMode, setViewMode]           = useState<'table' | 'grid'>('table');
  const [selectedIds, setSelectedIds]     = useState<number[]>([]);

  const filtered = products
    .filter(p => {
      const q = search.toLowerCase();
      return (
        (p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) &&
        (selectedCategory === 'All' || p.category === selectedCategory) &&
        (selectedStatus   === 'All' || p.status   === selectedStatus)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'price') return b.price - a.price;
      if (sortBy === 'stock') return b.stock - a.stock;
      if (sortBy === 'sales') return b.sales - a.sales;
      return a.name.localeCompare(b.name);
    });

  const toggleSelect = (id: number) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const stats = [
    { label: 'Total Products', value: products.length,                                    icon: '📦', color: 'text-blue-600',  bg: 'bg-blue-50'  },
    { label: 'Active',         value: products.filter(p => p.status === 'Active').length, icon: '✅', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Low Stock',      value: products.filter(p => p.status === 'Low Stock').length, icon: '⚠️', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Out of Stock',   value: products.filter(p => p.status === 'Out of Stock').length, icon: '❌', color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-5 md:p-7">

      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">All Products</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage and track your entire product catalog</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors">
            ⬇ Export
          </button>
          <button
            onClick={() => navigate('/products/add')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-500 font-medium">{s.label}</span>
              <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center text-base`}>{s.icon}</div>
            </div>
            <div className={`text-2xl sm:text-3xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 sm:p-4 mb-4 flex flex-col sm:flex-row flex-wrap gap-3 items-stretch sm:items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-0 sm:min-w-[180px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products or SKU..."
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-colors"
          />
        </div>

        {/* Selects row — scroll on very small screens */}
        <div className="flex gap-2 flex-wrap">
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none cursor-pointer">
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>

          <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none cursor-pointer">
            {['All', 'Active', 'Low Stock', 'Out of Stock', 'Draft'].map(s => <option key={s}>{s}</option>)}
          </select>

          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none cursor-pointer">
            <option value="name">Sort: Name</option>
            <option value="price">Sort: Price</option>
            <option value="stock">Sort: Stock</option>
            <option value="sales">Sort: Sales</option>
          </select>

          {/* View toggle */}
          <div className="flex gap-1 ml-auto sm:ml-0">
            {(['table', 'grid'] as const).map(mode => (
              <button key={mode} onClick={() => setViewMode(mode)}
                className={`px-3 py-2 rounded-xl border text-sm transition-colors ${viewMode === mode ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>
                {mode === 'table' ? '☰' : '⊞'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bulk Action Bar ── */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-800 text-white rounded-xl px-4 py-3 mb-3 flex items-center gap-4 flex-wrap">
          <span className="text-sm font-medium">{selectedIds.length} selected</span>
          <button className="bg-white/20 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/30 transition-colors">Bulk Edit</button>
          <button className="bg-red-400/40 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-red-400/50 transition-colors">Delete</button>
          <button onClick={() => setSelectedIds([])} className="ml-auto bg-transparent border-none text-white text-xl cursor-pointer">×</button>
        </div>
      )}

      {/* ── TABLE VIEW ── */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-3 pl-4 w-10">
                    <input type="checkbox" className="rounded"
                      onChange={e => setSelectedIds(e.target.checked ? filtered.map(p => p.id) : [])} />
                  </th>
                  {['Product', 'SKU', 'Category', 'Price', 'Stock', 'Sales', 'Status', 'Actions'].map(h => (
                    <th key={h} className="py-3 px-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(p => (
                  <tr key={p.id} className={`hover:bg-slate-50/50 transition-colors ${selectedIds.includes(p.id) ? 'bg-blue-50' : ''}`}>
                    <td className="py-3 pl-4">
                      <input type="checkbox" className="rounded" checked={selectedIds.includes(p.id)} onChange={() => toggleSelect(p.id)} />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg shrink-0">{p.emoji}</div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 whitespace-nowrap">{p.name}</p>
                          <p className="text-xs text-slate-400">⭐ {p.rating}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono font-semibold text-slate-500 whitespace-nowrap">{p.sku}</td>
                    <td className="py-3 px-4">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg whitespace-nowrap">{p.category}</span>
                    </td>
                    <td className="py-3 px-4 text-sm font-bold text-slate-900 whitespace-nowrap">₹{p.price.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-semibold whitespace-nowrap ${p.stock === 0 ? 'text-red-500' : p.stock <= 10 ? 'text-yellow-600' : 'text-slate-800'}`}>
                        {p.stock === 0 ? '—' : p.stock}
                        {p.stock > 0 && p.stock <= 10 && <span className="text-[10px] text-red-500 ml-1 font-bold">LOW</span>}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-500">{p.sales}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${statusStyle[p.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot[p.status]}`} />
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1.5">
                        <button className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap">Edit</button>
                        <button className="bg-red-50 text-red-500 text-xs px-2.5 py-1.5 rounded-lg hover:bg-red-100 transition-colors">🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <div className="text-5xl mb-3">🔍</div>
              <p className="text-base font-semibold text-slate-500">No products found</p>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
            </div>
          )}

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 border-t border-slate-100">
            <span className="text-sm text-slate-500">Showing {filtered.length} of {products.length} products</span>
            <div className="flex gap-1.5">
              {[1, 2, 3].map(n => (
                <button key={n} className={`w-8 h-8 rounded-lg text-sm font-medium border transition-colors ${n === 1 ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── GRID VIEW ── */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl">{p.emoji}</div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${statusStyle[p.status]}`}>{p.status}</span>
              </div>
              <p className="text-sm font-bold text-slate-900 mb-1 line-clamp-2">{p.name}</p>
              <p className="text-xs text-slate-400 mb-3">{p.sku} · {p.category}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-blue-600">₹{p.price.toLocaleString()}</span>
                <span className="text-xs text-slate-500">Stock: <span className={p.stock <= 5 ? 'text-red-500 font-bold' : ''}>{p.stock}</span></span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-50 text-blue-600 text-sm font-semibold py-2 rounded-xl hover:bg-blue-100 transition-colors">Edit</button>
                <button className="flex-1 bg-red-50 text-red-500 text-sm font-semibold py-2 rounded-xl hover:bg-red-100 transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// // FILE: src/pages/Products/AllProducts.tsx
// // PASTE: Replace entire content of your existing AllProducts.tsx

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const products = [
//   { id: 1, emoji: '🎧', name: 'Wireless Earbuds Pro', sku: 'WEP-001', category: 'Electronics', price: 2499, stock: 142, status: 'Active', sales: 320, rating: 4.5 },
//   { id: 2, emoji: '👕', name: 'Cotton Polo Shirt', sku: 'CPS-112', category: 'Clothing', price: 799, stock: 7, status: 'Low Stock', sales: 89, rating: 4.2 },
//   { id: 3, emoji: '🍳', name: 'Non-Stick Kadai 28cm', sku: 'NSK-028', category: 'Home & Kitchen', price: 1299, stock: 58, status: 'Active', sales: 210, rating: 4.7 },
//   { id: 4, emoji: '🖥️', name: 'USB-C Hub 7-in-1', sku: 'UCH-071', category: 'Electronics', price: 1899, stock: 0, status: 'Out of Stock', sales: 145, rating: 4.3 },
//   { id: 5, emoji: '📗', name: 'Clean Code Book', sku: 'CCB-003', category: 'Books', price: 549, stock: 200, status: 'Active', sales: 430, rating: 4.8 },
//   { id: 6, emoji: '⌚', name: 'Smart Watch Series 5', sku: 'SWS-005', category: 'Electronics', price: 4999, stock: 34, status: 'Active', sales: 178, rating: 4.6 },
//   { id: 7, emoji: '🎒', name: 'Laptop Backpack 30L', sku: 'LBP-030', category: 'Clothing', price: 1599, stock: 3, status: 'Low Stock', sales: 67, rating: 4.1 },
//   { id: 8, emoji: '💡', name: 'Smart LED Bulb', sku: 'SLB-010', category: 'Home & Kitchen', price: 399, stock: 89, status: 'Active', sales: 560, rating: 4.4 },
//   { id: 9, emoji: '📘', name: 'Atomic Habits', sku: 'AH-001', category: 'Books', price: 449, stock: 150, status: 'Active', sales: 720, rating: 4.9 },
//   { id: 10, emoji: '🎮', name: 'Wireless Gamepad', sku: 'WGP-004', category: 'Electronics', price: 2199, stock: 0, status: 'Out of Stock', sales: 98, rating: 4.0 },
//   { id: 11, emoji: '🧴', name: 'Vitamin C Serum', sku: 'VCS-021', category: 'Beauty', price: 899, stock: 45, status: 'Active', sales: 380, rating: 4.6 },
//   { id: 12, emoji: '🏃', name: 'Running Shoes X2', sku: 'RSX-002', category: 'Clothing', price: 3299, stock: 12, status: 'Active', sales: 155, rating: 4.3 },
// ];

// const statusConfig: Record<string, { bg: string; color: string; dot: string }> = {
//   'Active':       { bg: '#f0fdf4', color: '#16a34a', dot: '#22c55e' },
//   'Low Stock':    { bg: '#fffbeb', color: '#d97706', dot: '#f59e0b' },
//   'Out of Stock': { bg: '#fef2f2', color: '#dc2626', dot: '#ef4444' },
//   'Draft':        { bg: '#eff6ff', color: '#2563eb', dot: '#3b82f6' },
// };

// const categories = ['All', 'Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Beauty'];

// export default function AllProducts() {
//   const navigate = useNavigate();
//   const [search, setSearch] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [selectedStatus, setSelectedStatus] = useState('All');
//   const [sortBy, setSortBy] = useState('name');
//   const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
//   const [selectedIds, setSelectedIds] = useState<number[]>([]);

//   const filtered = products
//     .filter(p => {
//       const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
//       const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
//       const matchStatus = selectedStatus === 'All' || p.status === selectedStatus;
//       return matchSearch && matchCat && matchStatus;
//     })
//     .sort((a, b) => {
//       if (sortBy === 'price') return b.price - a.price;
//       if (sortBy === 'stock') return b.stock - a.stock;
//       if (sortBy === 'sales') return b.sales - a.sales;
//       return a.name.localeCompare(b.name);
//     });

//   const toggleSelect = (id: number) => {
//     setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
//   };

//   const stats = [
//     { label: 'Total Products', value: products.length, color: '#2563eb', bg: '#eff6ff', icon: '📦' },
//     { label: 'Active', value: products.filter(p => p.status === 'Active').length, color: '#16a34a', bg: '#f0fdf4', icon: '✅' },
//     { label: 'Low Stock', value: products.filter(p => p.status === 'Low Stock').length, color: '#d97706', bg: '#fffbeb', icon: '⚠️' },
//     { label: 'Out of Stock', value: products.filter(p => p.status === 'Out of Stock').length, color: '#dc2626', bg: '#fef2f2', icon: '❌' },
//   ];

//   return (
//     <div style={{ padding: '28px', background: '#f8fafc', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>

//       {/* Header */}
//       <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
//         <div>
//           <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#0f172a', margin: 0 }}>All Products</h1>
//           <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0' }}>Manage and track your entire product catalog</p>
//         </div>
//         <div style={{ display: 'flex', gap: '10px' }}>
//           <button style={{
//             padding: '10px 16px', borderRadius: '10px', border: '1.5px solid #e2e8f0',
//             background: '#fff', color: '#374151', fontSize: '14px', fontWeight: 500, cursor: 'pointer'
//           }}>⬇ Export</button>
//           <button onClick={() => navigate('/products/add')} style={{
//             padding: '10px 18px', borderRadius: '10px', border: 'none',
//             background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff',
//             fontSize: '14px', fontWeight: 600, cursor: 'pointer',
//             boxShadow: '0 4px 12px rgba(37,99,235,0.35)'
//           }}>+ Add Product</button>
//         </div>
//       </div>

//       {/* Stats */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
//         {stats.map(s => (
//           <div key={s.label} style={{
//             background: '#fff', borderRadius: '14px', padding: '20px',
//             border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
//           }}>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
//               <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>{s.label}</span>
//               <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{s.icon}</div>
//             </div>
//             <div style={{ fontSize: '30px', fontWeight: 700, color: s.color }}>{s.value}</div>
//           </div>
//         ))}
//       </div>

//       {/* Filters Bar */}
//       <div style={{
//         background: '#fff', borderRadius: '14px', padding: '16px 20px',
//         border: '1px solid #f1f5f9', marginBottom: '20px',
//         display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center'
//       }}>
//         <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
//           <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '15px' }}>🔍</span>
//           <input
//             value={search} onChange={e => setSearch(e.target.value)}
//             placeholder="Search products or SKU..."
//             style={{
//               width: '100%', padding: '9px 12px 9px 36px', borderRadius: '9px',
//               border: '1.5px solid #e2e8f0', fontSize: '13px', color: '#374151',
//               outline: 'none', boxSizing: 'border-box', background: '#f8fafc'
//             }}
//           />
//         </div>

//         <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} style={{
//           padding: '9px 14px', borderRadius: '9px', border: '1.5px solid #e2e8f0',
//           fontSize: '13px', color: '#374151', background: '#f8fafc', cursor: 'pointer'
//         }}>
//           {categories.map(c => <option key={c}>{c}</option>)}
//         </select>

//         <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} style={{
//           padding: '9px 14px', borderRadius: '9px', border: '1.5px solid #e2e8f0',
//           fontSize: '13px', color: '#374151', background: '#f8fafc', cursor: 'pointer'
//         }}>
//           {['All', 'Active', 'Low Stock', 'Out of Stock', 'Draft'].map(s => <option key={s}>{s}</option>)}
//         </select>

//         <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
//           padding: '9px 14px', borderRadius: '9px', border: '1.5px solid #e2e8f0',
//           fontSize: '13px', color: '#374151', background: '#f8fafc', cursor: 'pointer'
//         }}>
//           <option value="name">Sort: Name</option>
//           <option value="price">Sort: Price</option>
//           <option value="stock">Sort: Stock</option>
//           <option value="sales">Sort: Sales</option>
//         </select>

//         <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
//           {(['table', 'grid'] as const).map(mode => (
//             <button key={mode} onClick={() => setViewMode(mode)} style={{
//               padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0',
//               background: viewMode === mode ? '#2563eb' : '#fff',
//               color: viewMode === mode ? '#fff' : '#64748b',
//               cursor: 'pointer', fontSize: '14px'
//             }}>{mode === 'table' ? '☰' : '⊞'}</button>
//           ))}
//         </div>
//       </div>

//       {/* Bulk action bar */}
//       {selectedIds.length > 0 && (
//         <div style={{
//           background: '#1e40af', color: '#fff', borderRadius: '10px',
//           padding: '12px 20px', marginBottom: '12px',
//           display: 'flex', alignItems: 'center', gap: '16px'
//         }}>
//           <span style={{ fontSize: '14px', fontWeight: 500 }}>{selectedIds.length} selected</span>
//           <button style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Bulk Edit</button>
//           <button style={{ background: 'rgba(239,68,68,0.3)', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
//           <button onClick={() => setSelectedIds([])} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px' }}>×</button>
//         </div>
//       )}

//       {/* TABLE VIEW */}
//       {viewMode === 'table' && (
//         <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
//           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//             <thead>
//               <tr style={{ background: '#f8fafc' }}>
//                 <th style={{ padding: '14px 16px', width: '40px' }}>
//                   <input type="checkbox" onChange={e => setSelectedIds(e.target.checked ? filtered.map(p => p.id) : [])} />
//                 </th>
//                 {['Product', 'SKU', 'Category', 'Price', 'Stock', 'Sales', 'Status', 'Actions'].map(h => (
//                   <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.map((p, idx) => {
//                 const sc = statusConfig[p.status];
//                 return (
//                   <tr key={p.id} style={{ borderTop: '1px solid #f8fafc', background: selectedIds.includes(p.id) ? '#eff6ff' : 'transparent' }}>
//                     <td style={{ padding: '14px 16px' }}>
//                       <input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => toggleSelect(p.id)} />
//                     </td>
//                     <td style={{ padding: '14px 16px' }}>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//                         <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{p.emoji}</div>
//                         <div>
//                           <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{p.name}</div>
//                           <div style={{ fontSize: '12px', color: '#94a3b8' }}>{'⭐'.repeat(Math.floor(p.rating))} {p.rating}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td style={{ padding: '14px 16px', fontSize: '12px', color: '#64748b', fontFamily: 'monospace', fontWeight: 600 }}>{p.sku}</td>
//                     <td style={{ padding: '14px 16px' }}>
//                       <span style={{ fontSize: '12px', color: '#64748b', background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px' }}>{p.category}</span>
//                     </td>
//                     <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>₹{p.price.toLocaleString()}</td>
//                     <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 600, color: p.stock <= 10 ? '#dc2626' : p.stock <= 30 ? '#d97706' : '#0f172a' }}>
//                       {p.stock === 0 ? '—' : p.stock}
//                       {p.stock > 0 && p.stock <= 10 && <span style={{ fontSize: '10px', color: '#dc2626', marginLeft: '4px' }}>LOW</span>}
//                     </td>
//                     <td style={{ padding: '14px 16px', fontSize: '14px', color: '#64748b' }}>{p.sales}</td>
//                     <td style={{ padding: '14px 16px' }}>
//                       <span style={{ ...sc, padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
//                         <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: sc.dot, display: 'inline-block' }} />
//                         {p.status}
//                       </span>
//                     </td>
//                     <td style={{ padding: '14px 16px' }}>
//                       <div style={{ display: 'flex', gap: '6px' }}>
//                         <button style={{ background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '7px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Edit</button>
//                         <button style={{ background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '7px', padding: '6px 10px', cursor: 'pointer', fontSize: '12px' }}>🗑</button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//           {filtered.length === 0 && (
//             <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
//               <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
//               <div style={{ fontSize: '16px', fontWeight: 600 }}>No products found</div>
//               <div style={{ fontSize: '13px', marginTop: '4px' }}>Try adjusting your filters</div>
//             </div>
//           )}
//           <div style={{ padding: '14px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <span style={{ fontSize: '13px', color: '#64748b' }}>Showing {filtered.length} of {products.length} products</span>
//             <div style={{ display: 'flex', gap: '6px' }}>
//               {[1,2,3].map(n => (
//                 <button key={n} style={{ width: '32px', height: '32px', borderRadius: '7px', border: '1.5px solid #e2e8f0', background: n === 1 ? '#2563eb' : '#fff', color: n === 1 ? '#fff' : '#374151', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>{n}</button>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* GRID VIEW */}
//       {viewMode === 'grid' && (
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '16px' }}>
//           {filtered.map(p => {
//             const sc = statusConfig[p.status];
//             return (
//               <div key={p.id} style={{
//                 background: '#fff', borderRadius: '14px', padding: '20px',
//                 border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
//                 transition: 'transform 0.15s, box-shadow 0.15s',
//               }}
//                 onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
//                 onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; }}
//               >
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
//                   <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>{p.emoji}</div>
//                   <span style={{ ...sc, padding: '3px 9px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>{p.status}</span>
//                 </div>
//                 <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{p.name}</div>
//                 <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>{p.sku} · {p.category}</div>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                   <span style={{ fontSize: '18px', fontWeight: 700, color: '#2563eb' }}>₹{p.price.toLocaleString()}</span>
//                   <span style={{ fontSize: '12px', color: '#64748b' }}>Stock: {p.stock}</span>
//                 </div>
//                 <div style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
//                   <button style={{ flex: 1, background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Edit</button>
//                   <button style={{ flex: 1, background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Delete</button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// // import { useNavigate } from 'react-router-dom'

// // const products = [
// //   { id: 1, emoji: '📱', name: 'Wireless Earbuds Pro', sku: 'WEP-001', category: 'Electronics', price: '₹2,499', stock: 142, status: 'Active', sales: 243 },
// //   { id: 2, emoji: '👕', name: 'Cotton Polo Shirt', sku: 'CPS-112', category: 'Clothing', price: '₹799', stock: 7, status: 'Low Stock', sales: 189 },
// //   { id: 3, emoji: '🍳', name: 'Non-Stick Kadai 28cm', sku: 'NSK-028', category: 'Home & Kitchen', price: '₹1,299', stock: 58, status: 'Active', sales: 148 },
// //   { id: 4, emoji: '💻', name: 'USB-C Hub 7-in-1', sku: 'UCH-071', category: 'Electronics', price: '₹1,899', stock: 0, status: 'Out of Stock', sales: 97 },
// //   { id: 5, emoji: '📚', name: 'Clean Code – Book', sku: 'CCB-003', category: 'Books', price: '₹549', stock: 200, status: 'Draft', sales: 0 },
// //   { id: 6, emoji: '⌚', name: 'Smart Watch Series 5', sku: 'SWS-005', category: 'Electronics', price: '₹4,999', stock: 34, status: 'Active', sales: 76 },
// //   { id: 7, emoji: '🎒', name: 'Laptop Backpack 30L', sku: 'LBP-030', category: 'Clothing', price: '₹1,599', stock: 3, status: 'Low Stock', sales: 112 },
// // ]

// // const badgeColors: Record<string, React.CSSProperties> = {
// //   'Active':       { background: '#dcfce7', color: '#15803d' },
// //   'Low Stock':    { background: '#fef3c7', color: '#b45309' },
// //   'Out of Stock': { background: '#fee2e2', color: '#dc2626' },
// //   'Draft':        { background: '#dbeafe', color: '#2563eb' },
// // }

// // export default function AllProducts() {
// //   const navigate = useNavigate()
// //   return (
// //     <div>
// //       <div style={pageHeaderStyle}>
// //         <div>
// //           <div style={pageTitleStyle}>All Products</div>
// //           <div style={pageSubtitleStyle}>Manage and track your entire product catalog</div>
// //         </div>
// //         <button style={btnPrimaryStyle} onClick={() => navigate('/products/add')}>+ Add Product</button>
// //       </div>

// //       {/* Filters */}
// //       <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
// //         <input style={filterInputStyle} type="text" placeholder="🔍  Search products..." />
// //         <select style={filterInputStyle}>
// //           <option>All Categories</option>
// //           <option>Electronics</option>
// //           <option>Clothing</option>
// //           <option>Home & Kitchen</option>
// //           <option>Books</option>
// //         </select>
// //         <select style={filterInputStyle}>
// //           <option>All Status</option>
// //           <option>Active</option>
// //           <option>Draft</option>
// //           <option>Out of Stock</option>
// //         </select>
// //         <select style={filterInputStyle}>
// //           <option>Sort: Newest</option>
// //           <option>Sort: Price ↑</option>
// //           <option>Sort: Price ↓</option>
// //         </select>
// //       </div>

// //       {/* Table */}
// //       <div style={{ ...cardStyle, overflowX: 'auto' }}>
// //         <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
// //           <thead>
// //             <tr style={{ background: '#f1f5fb' }}>
// //               {['', 'Product', 'Category', 'Price', 'Stock', 'Status', 'Sales', 'Actions'].map(h => (
// //                 <th key={h} style={thStyle}>{h === '' ? <input type="checkbox" /> : h}</th>
// //               ))}
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {products.map(p => (
// //               <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
// //                 <td style={tdStyle}><input type="checkbox" /></td>
// //                 <td style={tdStyle}>
// //                   <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
// //                     <div style={prodImgStyle}>{p.emoji}</div>
// //                     <div>
// //                       <div style={{ fontWeight: 600 }}>{p.name}</div>
// //                       <div style={{ fontSize: 11, color: '#64748b' }}>{p.sku}</div>
// //                     </div>
// //                   </div>
// //                 </td>
// //                 <td style={tdStyle}>{p.category}</td>
// //                 <td style={tdStyle}>{p.price}</td>
// //                 <td style={tdStyle}>{p.stock}</td>
// //                 <td style={tdStyle}>
// //                   <span style={{ ...badgeStyle, ...badgeColors[p.status] }}>{p.status}</span>
// //                 </td>
// //                 <td style={tdStyle}>{p.sales} sold</td>
// //                 <td style={tdStyle}>
// //                   <button style={btnOutlineStyle}>Edit</button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderTop: '1px solid #e2e8f0', fontSize: 13, color: '#64748b' }}>
// //           <span>Showing 7 of 84 products</span>
// //           <div style={{ display: 'flex', gap: 6 }}>
// //             {['← Prev', '1', '2', '3', 'Next →'].map(p => (
// //               <button key={p} style={p === '1' ? btnPrimaryStyle : btnOutlineStyle}>{p}</button>
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // const pageHeaderStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }
// // const pageTitleStyle: React.CSSProperties = { fontSize: 22, fontWeight: 800, color: '#1e293b' }
// // const pageSubtitleStyle: React.CSSProperties = { fontSize: 13, color: '#64748b', marginTop: 2 }
// // const cardStyle: React.CSSProperties = { background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0' }
// // const btnPrimaryStyle: React.CSSProperties = { background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }
// // const btnOutlineStyle: React.CSSProperties = { background: '#fff', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }
// // const filterInputStyle: React.CSSProperties = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '7px 12px', fontFamily: 'inherit', fontSize: 13, color: '#1e293b', outline: 'none' }
// // const thStyle: React.CSSProperties = { padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '.04em', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0' }
// // const tdStyle: React.CSSProperties = { padding: '12px 14px', color: '#1e293b', verticalAlign: 'middle' }
// // const prodImgStyle: React.CSSProperties = { width: 40, height: 40, borderRadius: 8, background: '#f1f5fb', display: 'grid', placeItems: 'center', fontSize: 18, border: '1px solid #e2e8f0', flexShrink: 0 }
// // const badgeStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 }