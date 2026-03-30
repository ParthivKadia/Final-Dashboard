import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const lowStockItems = [
  { id: 1, emoji: '👕', name: 'Cotton Polo Shirt',     sku: 'CPS-112', category: 'Clothing',     stock: 7,  reorderPoint: 15, reorderQty: 100, price: 799,  supplier: 'TextilePro India',  lastOrder: '45 days ago', daysLeft: 3, urgency: 'critical' },
  { id: 2, emoji: '🎒', name: 'Laptop Backpack 30L',   sku: 'LBP-030', category: 'Clothing',     stock: 3,  reorderPoint: 10, reorderQty: 40,  price: 1599, supplier: 'BagMasters Co.',    lastOrder: '60 days ago', daysLeft: 1, urgency: 'critical' },
  { id: 3, emoji: '⌚', name: 'Smart Watch Series 5',  sku: 'SWS-005', category: 'Electronics',  stock: 12, reorderPoint: 15, reorderQty: 20,  price: 4999, supplier: 'TechGear Imports',  lastOrder: '30 days ago', daysLeft: 6, urgency: 'warning'  },
  { id: 4, emoji: '🧴', name: 'Vitamin C Serum',       sku: 'VCS-021', category: 'Beauty',       stock: 9,  reorderPoint: 20, reorderQty: 50,  price: 899,  supplier: 'BeautyCare Labs',   lastOrder: '20 days ago', daysLeft: 4, urgency: 'warning'  },
  { id: 5, emoji: '🖥️', name: 'USB-C Hub 7-in-1',     sku: 'UCH-071', category: 'Electronics',  stock: 0,  reorderPoint: 10, reorderQty: 30,  price: 1899, supplier: 'TechGear Imports',  lastOrder: '90 days ago', daysLeft: 0, urgency: 'out'      },
  { id: 6, emoji: '🎮', name: 'Wireless Gamepad',      sku: 'WGP-004', category: 'Electronics',  stock: 0,  reorderPoint: 8,  reorderQty: 25,  price: 2199, supplier: 'GameZone Dist.',    lastOrder: '75 days ago', daysLeft: 0, urgency: 'out'      },
  { id: 7, emoji: '🏃', name: 'Running Shoes X2',      sku: 'RSX-002', category: 'Clothing',     stock: 5,  reorderPoint: 10, reorderQty: 20,  price: 3299, supplier: 'SportFit Mfg.',     lastOrder: '15 days ago', daysLeft: 7, urgency: 'warning'  },
];

const urgencyConfig = {
  out:      { label: 'Out of Stock', badge: 'bg-red-100 text-red-600',      border: 'border-red-200',    dot: 'bg-red-500',    bar: '#ef4444', priority: 'P0' },
  critical: { label: 'Critical',     badge: 'bg-orange-100 text-orange-600', border: 'border-orange-200', dot: 'bg-orange-500', bar: '#f97316', priority: 'P1' },
  warning:  { label: 'Low Stock',    badge: 'bg-yellow-100 text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-500', bar: '#f59e0b', priority: 'P2' },
};

export default function LowStock() {
  const navigate = useNavigate();
  const [selected, setSelected]       = useState<number[]>([]);
  const [filter, setFilter]           = useState<'all' | 'out' | 'critical' | 'warning'>('all');
  const [reorderModal, setReorderModal] = useState<typeof lowStockItems[0] | null>(null);
  const [reorderQty, setReorderQty]   = useState('');

  const filtered      = lowStockItems.filter(i => filter === 'all' || i.urgency === filter);
  const outCount      = lowStockItems.filter(i => i.urgency === 'out').length;
  const criticalCount = lowStockItems.filter(i => i.urgency === 'critical').length;
  const warningCount  = lowStockItems.filter(i => i.urgency === 'warning').length;
  const totalReorderValue = lowStockItems.reduce((s, i) => s + i.price * i.reorderQty, 0);

  const toggleSelect = (id: number) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-5 md:p-7">

      {/* ── Urgent Alert Banner ── */}
      {(outCount > 0 || criticalCount > 0) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-4 sm:p-5 mb-5 text-white">
          <span className="text-3xl shrink-0">🚨</span>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold">Urgent Restock Needed</p>
            <p className="text-sm opacity-90 mt-0.5">
              {outCount} items are out of stock and {criticalCount} are critically low. Act now to prevent lost sales.
            </p>
          </div>
          <button className="shrink-0 bg-white/20 hover:bg-white/30 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors whitespace-nowrap">
            Send Restock Alerts →
          </button>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Low Stock Alerts</h1>
          <p className="text-sm text-slate-500 mt-0.5">Monitor and restock products before they run out</p>
        </div>
        <div className="flex gap-2 flex-wrap shrink-0">
          <button className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors">
            📧 Email Suppliers
          </button>
          <button className="px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors shadow-md shadow-red-200">
            🔄 Reorder All Critical
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5">
        {[
          { label: 'Out of Stock',   value: outCount,      icon: '🔴', color: 'text-red-600',    bg: 'bg-red-50',    desc: 'Need immediate restock'    },
          { label: 'Critical',       value: criticalCount, icon: '🟠', color: 'text-orange-600', bg: 'bg-orange-50', desc: '1-3 days of stock left'     },
          { label: 'Low Stock',      value: warningCount,  icon: '🟡', color: 'text-yellow-600', bg: 'bg-yellow-50', desc: 'Within reorder point'       },
          { label: 'Reorder Value',  value: `₹${(totalReorderValue / 1000).toFixed(1)}K`, icon: '💰', color: 'text-blue-600', bg: 'bg-blue-50', desc: 'To fully restock all' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide leading-tight">{s.label}</span>
              <span className="text-lg">{s.icon}</span>
            </div>
            <p className={`text-2xl font-bold ${s.color} mb-0.5`}>{s.value}</p>
            <p className="text-[11px] text-slate-400">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* ── Filter Tabs — scrollable on mobile ── */}
      <div className="flex gap-1.5 mb-4 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto w-fit max-w-full">
        {[
          { id: 'all',      label: `All (${lowStockItems.length})`  },
          { id: 'out',      label: `🔴 Out (${outCount})`           },
          { id: 'critical', label: `🟠 Critical (${criticalCount})` },
          { id: 'warning',  label: `🟡 Low (${warningCount})`       },
        ].map(tab => (
          <button key={tab.id} onClick={() => setFilter(tab.id as typeof filter)}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${filter === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Bulk Action ── */}
      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 bg-blue-800 text-white rounded-xl px-4 py-3 mb-3">
          <span className="text-sm font-medium">{selected.length} items selected</span>
          <button className="bg-white/20 hover:bg-white/30 text-white text-sm px-3 py-1.5 rounded-lg transition-colors">🔄 Bulk Reorder</button>
          <button className="bg-white/20 hover:bg-white/30 text-white text-sm px-3 py-1.5 rounded-lg transition-colors">📧 Email Supplier</button>
          <button onClick={() => setSelected([])} className="ml-auto text-white text-xl bg-transparent border-none cursor-pointer">×</button>
        </div>
      )}

      {/* ── Items List ── */}
      <div className="flex flex-col gap-3">
        {filtered.map(item => {
          const uc       = urgencyConfig[item.urgency as keyof typeof urgencyConfig];
          const stockPct = item.urgency === 'out' ? 0 : Math.min((item.stock / item.reorderPoint) * 100, 100);

          return (
            <div key={item.id} className={`bg-white rounded-2xl border ${uc.border} shadow-sm p-4 sm:p-5`}>
              {/* Top row: checkbox + product + badge + days */}
              <div className="flex items-start gap-3">
                <input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggleSelect(item.id)}
                  className="mt-1 w-4 h-4 cursor-pointer shrink-0 accent-blue-600" />

                <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-xl shrink-0">{item.emoji}</div>

                <div className="flex-1 min-w-0">
                  {/* Name + badge */}
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-slate-900">{item.name}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${uc.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${uc.dot}`} />
                      {uc.priority} · {uc.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{item.sku} · {item.category} · {item.supplier}</p>

                  {/* Stock bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${stockPct}%`, background: uc.bar }} />
                    </div>
                    <span className="text-xs text-slate-500 whitespace-nowrap">{item.stock}/{item.reorderPoint} units</span>
                  </div>
                </div>

                {/* Days left — hidden on very small, shown on sm+ */}
                <div className="hidden sm:flex flex-col items-center px-4 border-l border-slate-100 shrink-0">
                  <span className={`text-xl font-bold ${item.daysLeft === 0 ? 'text-red-600' : item.daysLeft <= 3 ? 'text-orange-500' : 'text-yellow-600'}`}>
                    {item.daysLeft === 0 ? '—' : item.daysLeft}
                  </span>
                  <span className="text-[11px] text-slate-400">{item.daysLeft === 0 ? 'Gone' : 'days left'}</span>
                </div>
              </div>

              {/* Bottom row: reorder info + actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-50">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="text-slate-500 text-xs">Suggested qty</span>
                    <p className="font-bold text-slate-900">{item.reorderQty} units</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs">Reorder cost</span>
                    <p className="font-bold text-slate-900">₹{(item.price * item.reorderQty).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs">Last order</span>
                    <p className="font-medium text-slate-600">{item.lastOrder}</p>
                  </div>
                  {/* Days left on mobile */}
                  <div className="sm:hidden">
                    <span className="text-slate-500 text-xs">Days left</span>
                    <p className={`font-bold ${item.daysLeft === 0 ? 'text-red-600' : item.daysLeft <= 3 ? 'text-orange-500' : 'text-yellow-600'}`}>
                      {item.daysLeft === 0 ? 'Gone' : `${item.daysLeft} days`}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => { setReorderModal(item); setReorderQty(String(item.reorderQty)); }}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 whitespace-nowrap">
                    🔄 Reorder Now
                  </button>
                  <button
                    onClick={() => navigate('/inventory')}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors whitespace-nowrap">
                    Update Stock
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Reorder Modal ── */}
      {reorderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl p-6 w-full sm:max-w-md shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Place Reorder</h2>
            <p className="text-sm text-slate-500 mb-5">{reorderModal.name}</p>

            {/* Info */}
            <div className="bg-slate-50 rounded-xl p-4 mb-4 space-y-2.5">
              {[
                { label: 'Supplier',      value: reorderModal.supplier,          color: ''              },
                { label: 'Current Stock', value: `${reorderModal.stock} units`,   color: 'text-red-600'  },
                { label: 'Unit Price',    value: `₹${reorderModal.price}`,        color: ''              },
              ].map(row => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-sm text-slate-500">{row.label}</span>
                  <span className={`text-sm font-semibold text-slate-900 ${row.color}`}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Quantity */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Reorder Quantity</label>
              <input value={reorderQty} onChange={e => setReorderQty(e.target.value)} type="number"
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-blue-500 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
              {reorderQty && (
                <p className="text-sm font-semibold text-green-600 mt-2">
                  Total: ₹{(Number(reorderQty) * reorderModal.price).toLocaleString()}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setReorderModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => setReorderModal(null)}
                className="flex-[2] py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
                ✅ Confirm Reorder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// // FILE: src/pages/Products/LowStock.tsx
// // PASTE: Replace entire content of your existing LowStock.tsx (or create if not exists)

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const lowStockItems = [
//   { id: 1, emoji: '👕', name: 'Cotton Polo Shirt', sku: 'CPS-112', category: 'Clothing', stock: 7, reorderPoint: 15, reorderQty: 100, price: 799, supplier: 'TextilePro India', lastOrder: '45 days ago', daysLeft: 3, urgency: 'critical' },
//   { id: 2, emoji: '🎒', name: 'Laptop Backpack 30L', sku: 'LBP-030', category: 'Clothing', stock: 3, reorderPoint: 10, reorderQty: 40, price: 1599, supplier: 'BagMasters Co.', lastOrder: '60 days ago', daysLeft: 1, urgency: 'critical' },
//   { id: 3, emoji: '⌚', name: 'Smart Watch Series 5', sku: 'SWS-005', category: 'Electronics', stock: 12, reorderPoint: 15, reorderQty: 20, price: 4999, supplier: 'TechGear Imports', lastOrder: '30 days ago', daysLeft: 6, urgency: 'warning' },
//   { id: 4, emoji: '🧴', name: 'Vitamin C Serum', sku: 'VCS-021', category: 'Beauty', stock: 9, reorderPoint: 20, reorderQty: 50, price: 899, supplier: 'BeautyCare Labs', lastOrder: '20 days ago', daysLeft: 4, urgency: 'warning' },
//   { id: 5, emoji: '🖥️', name: 'USB-C Hub 7-in-1', sku: 'UCH-071', category: 'Electronics', stock: 0, reorderPoint: 10, reorderQty: 30, price: 1899, supplier: 'TechGear Imports', lastOrder: '90 days ago', daysLeft: 0, urgency: 'out' },
//   { id: 6, emoji: '🎮', name: 'Wireless Gamepad', sku: 'WGP-004', category: 'Electronics', stock: 0, reorderPoint: 8, reorderQty: 25, price: 2199, supplier: 'GameZone Dist.', lastOrder: '75 days ago', daysLeft: 0, urgency: 'out' },
//   { id: 7, emoji: '🏃', name: 'Running Shoes X2', sku: 'RSX-002', category: 'Clothing', stock: 5, reorderPoint: 10, reorderQty: 20, price: 3299, supplier: 'SportFit Mfg.', lastOrder: '15 days ago', daysLeft: 7, urgency: 'warning' },
// ];

// const urgencyConfig = {
//   out:      { label: 'Out of Stock', color: '#dc2626', bg: '#fef2f2', dot: '#ef4444', priority: 'P0' },
//   critical: { label: 'Critical', color: '#ea580c', bg: '#fff7ed', dot: '#f97316', priority: 'P1' },
//   warning:  { label: 'Low Stock', color: '#d97706', bg: '#fffbeb', dot: '#f59e0b', priority: 'P2' },
// };

// export default function LowStock() {
//   const navigate = useNavigate();
//   const [selected, setSelected] = useState<number[]>([]);
//   const [filter, setFilter] = useState<'all' | 'out' | 'critical' | 'warning'>('all');
//   const [reorderModal, setReorderModal] = useState<typeof lowStockItems[0] | null>(null);
//   const [reorderQty, setReorderQty] = useState('');

//   const filtered = lowStockItems.filter(i => filter === 'all' || i.urgency === filter);
//   const outCount = lowStockItems.filter(i => i.urgency === 'out').length;
//   const criticalCount = lowStockItems.filter(i => i.urgency === 'critical').length;
//   const warningCount = lowStockItems.filter(i => i.urgency === 'warning').length;

//   const toggleSelect = (id: number) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

//   const totalReorderValue = lowStockItems.reduce((s, i) => s + i.price * i.reorderQty, 0);

//   return (
//     <div style={{ padding: '28px', background: '#f8fafc', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>

//       {/* Urgent Alert Banner */}
//       {(outCount > 0 || criticalCount > 0) && (
//         <div style={{
//           background: 'linear-gradient(135deg, #dc2626, #ea580c)',
//           borderRadius: '14px', padding: '16px 22px', marginBottom: '24px',
//           display: 'flex', alignItems: 'center', gap: '14px', color: '#fff'
//         }}>
//           <span style={{ fontSize: '28px' }}>🚨</span>
//           <div>
//             <div style={{ fontSize: '15px', fontWeight: 700 }}>Urgent Restock Needed</div>
//             <div style={{ fontSize: '13px', opacity: 0.9, marginTop: '2px' }}>
//               {outCount} items are out of stock and {criticalCount} are critically low. Act now to prevent lost sales.
//             </div>
//           </div>
//           <button style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '10px 18px', borderRadius: '9px', cursor: 'pointer', fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap' }}>
//             Send Restock Alerts →
//           </button>
//         </div>
//       )}

//       {/* Header */}
//       <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
//         <div>
//           <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Low Stock Alerts</h1>
//           <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0' }}>Monitor and restock products before they run out</p>
//         </div>
//         <div style={{ display: 'flex', gap: '10px' }}>
//           <button style={{ padding: '10px 16px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#374151', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>📧 Email Suppliers</button>
//           <button style={{
//             padding: '10px 18px', borderRadius: '10px', border: 'none',
//             background: 'linear-gradient(135deg, #dc2626, #b91c1c)', color: '#fff',
//             fontSize: '14px', fontWeight: 600, cursor: 'pointer',
//             boxShadow: '0 4px 12px rgba(220,38,38,0.35)'
//           }}>🔄 Reorder All Critical</button>
//         </div>
//       </div>

//       {/* Stats */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
//         {[
//           { label: 'Out of Stock', value: outCount, color: '#dc2626', bg: '#fef2f2', icon: '🔴', desc: 'Need immediate restock' },
//           { label: 'Critical (< 5)', value: criticalCount, color: '#ea580c', bg: '#fff7ed', icon: '🟠', desc: '1-3 days of stock left' },
//           { label: 'Low Stock', value: warningCount, color: '#d97706', bg: '#fffbeb', icon: '🟡', desc: 'Within reorder point' },
//           { label: 'Reorder Value', value: `₹${(totalReorderValue / 1000).toFixed(1)}K`, color: '#2563eb', bg: '#eff6ff', icon: '💰', desc: 'To fully restock all' },
//         ].map(s => (
//           <div key={s.label} style={{ background: '#fff', borderRadius: '14px', padding: '18px', border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
//               <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</span>
//               <span style={{ fontSize: '18px' }}>{s.icon}</span>
//             </div>
//             <div style={{ fontSize: '28px', fontWeight: 700, color: s.color, marginBottom: '4px' }}>{s.value}</div>
//             <div style={{ fontSize: '11px', color: '#94a3b8' }}>{s.desc}</div>
//           </div>
//         ))}
//       </div>

//       {/* Filter Tabs */}
//       <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', background: '#fff', padding: '6px', borderRadius: '12px', border: '1px solid #f1f5f9', width: 'fit-content' }}>
//         {[
//           { id: 'all', label: `All Items (${lowStockItems.length})` },
//           { id: 'out', label: `🔴 Out of Stock (${outCount})` },
//           { id: 'critical', label: `🟠 Critical (${criticalCount})` },
//           { id: 'warning', label: `🟡 Low Stock (${warningCount})` },
//         ].map(tab => (
//           <button key={tab.id} onClick={() => setFilter(tab.id as typeof filter)} style={{
//             padding: '9px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
//             background: filter === tab.id ? '#2563eb' : 'transparent',
//             color: filter === tab.id ? '#fff' : '#64748b',
//             fontSize: '13px', fontWeight: 600
//           }}>{tab.label}</button>
//         ))}
//       </div>

//       {/* Bulk Action */}
//       {selected.length > 0 && (
//         <div style={{ background: '#1e40af', color: '#fff', borderRadius: '10px', padding: '12px 20px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
//           <span style={{ fontSize: '14px', fontWeight: 500 }}>{selected.length} items selected</span>
//           <button style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>🔄 Bulk Reorder</button>
//           <button style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>📧 Email Supplier</button>
//           <button onClick={() => setSelected([])} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '20px' }}>×</button>
//         </div>
//       )}

//       {/* Items List */}
//       <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
//         {filtered.map(item => {
//           const uc = urgencyConfig[item.urgency as keyof typeof urgencyConfig];
//           const stockPct = item.urgency === 'out' ? 0 : Math.min((item.stock / item.reorderPoint) * 100, 100);

//           return (
//             <div key={item.id} style={{
//               background: '#fff', borderRadius: '14px', padding: '20px',
//               border: `1px solid ${item.urgency === 'out' ? '#fecaca' : item.urgency === 'critical' ? '#fed7aa' : '#fef3c7'}`,
//               boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
//               display: 'flex', alignItems: 'center', gap: '16px'
//             }}>
//               <input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggleSelect(item.id)}
//                 style={{ width: '16px', height: '16px', cursor: 'pointer' }} />

//               {/* Product info */}
//               <div style={{ width: '44px', height: '44px', borderRadius: '11px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{item.emoji}</div>
//               <div style={{ flex: 1, minWidth: 0 }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
//                   <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{item.name}</span>
//                   <span style={{ ...uc, padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>{uc.priority} · {uc.label}</span>
//                 </div>
//                 <div style={{ fontSize: '12px', color: '#94a3b8' }}>{item.sku} · {item.category} · Supplier: {item.supplier}</div>
//                 {/* Stock bar */}
//                 <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
//                   <div style={{ flex: 1, height: '6px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
//                     <div style={{ height: '100%', width: `${stockPct}%`, background: item.urgency === 'out' ? '#ef4444' : item.urgency === 'critical' ? '#f97316' : '#f59e0b', borderRadius: '6px', transition: 'width 0.6s' }} />
//                   </div>
//                   <span style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>{item.stock} / {item.reorderPoint} units</span>
//                 </div>
//               </div>

//               {/* Days left */}
//               <div style={{ textAlign: 'center', padding: '0 16px', borderLeft: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9' }}>
//                 <div style={{ fontSize: '22px', fontWeight: 700, color: item.daysLeft === 0 ? '#dc2626' : item.daysLeft <= 3 ? '#ea580c' : '#d97706' }}>
//                   {item.daysLeft === 0 ? '—' : item.daysLeft}
//                 </div>
//                 <div style={{ fontSize: '11px', color: '#94a3b8' }}>{item.daysLeft === 0 ? 'Gone' : 'days left'}</div>
//               </div>

//               {/* Reorder info */}
//               <div style={{ textAlign: 'center', padding: '0 16px', borderRight: '1px solid #f1f5f9' }}>
//                 <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{item.reorderQty} units</div>
//                 <div style={{ fontSize: '11px', color: '#94a3b8' }}>Suggested qty</div>
//                 <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>₹{(item.price * item.reorderQty).toLocaleString()}</div>
//               </div>

//               {/* Actions */}
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', flexShrink: 0 }}>
//                 <button onClick={() => { setReorderModal(item); setReorderQty(String(item.reorderQty)); }} style={{
//                   background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff',
//                   border: 'none', borderRadius: '8px', padding: '8px 16px',
//                   cursor: 'pointer', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap'
//                 }}>🔄 Reorder Now</button>
//                 <button onClick={() => navigate('/inventory')} style={{
//                   background: '#f8fafc', color: '#64748b', border: '1.5px solid #e2e8f0',
//                   borderRadius: '8px', padding: '7px 16px', cursor: 'pointer', fontSize: '12px', fontWeight: 500
//                 }}>Update Stock</button>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Reorder Modal */}
//       {reorderModal && (
//         <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
//           <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', width: '400px', maxWidth: '90vw' }}>
//             <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>Place Reorder</h2>
//             <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px' }}>{reorderModal.name}</p>
//             <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px', marginBottom: '18px' }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
//                 <span style={{ fontSize: '13px', color: '#64748b' }}>Supplier</span>
//                 <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{reorderModal.supplier}</span>
//               </div>
//               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
//                 <span style={{ fontSize: '13px', color: '#64748b' }}>Current Stock</span>
//                 <span style={{ fontSize: '13px', fontWeight: 600, color: '#dc2626' }}>{reorderModal.stock} units</span>
//               </div>
//               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <span style={{ fontSize: '13px', color: '#64748b' }}>Unit Price</span>
//                 <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>₹{reorderModal.price}</span>
//               </div>
//             </div>
//             <div style={{ marginBottom: '18px' }}>
//               <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>Reorder Quantity</label>
//               <input value={reorderQty} onChange={e => setReorderQty(e.target.value)} type="number"
//                 style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #2563eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
//               {reorderQty && (
//                 <div style={{ marginTop: '8px', fontSize: '13px', color: '#16a34a', fontWeight: 600 }}>
//                   Total: ₹{(Number(reorderQty) * reorderModal.price).toLocaleString()}
//                 </div>
//               )}
//             </div>
//             <div style={{ display: 'flex', gap: '10px' }}>
//               <button onClick={() => setReorderModal(null)} style={{ flex: 1, padding: '11px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#374151', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
//               <button onClick={() => setReorderModal(null)} style={{
//                 flex: 2, padding: '11px', borderRadius: '10px', border: 'none',
//                 background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff',
//                 fontSize: '14px', fontWeight: 600, cursor: 'pointer'
//               }}>✅ Confirm Reorder</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }