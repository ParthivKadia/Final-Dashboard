import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const inventoryData = [
  { id: 1, emoji: '🎧', name: 'Wireless Earbuds Pro',   sku: 'WEP-001', category: 'Electronics',    stock: 142, reserved: 12, available: 130, incoming: 50,  warehouse: 'Delhi WH',     lastUpdated: '2h ago',  reorderPoint: 20 },
  { id: 2, emoji: '👕', name: 'Cotton Polo Shirt',      sku: 'CPS-112', category: 'Clothing',       stock: 7,   reserved: 2,  available: 5,   incoming: 100, warehouse: 'Mumbai WH',    lastUpdated: '1d ago',  reorderPoint: 15 },
  { id: 3, emoji: '🍳', name: 'Non-Stick Kadai 28cm',   sku: 'NSK-028', category: 'Home & Kitchen', stock: 58,  reserved: 5,  available: 53,  incoming: 0,   warehouse: 'Delhi WH',     lastUpdated: '3h ago',  reorderPoint: 10 },
  { id: 4, emoji: '🖥️', name: 'USB-C Hub 7-in-1',      sku: 'UCH-071', category: 'Electronics',    stock: 0,   reserved: 0,  available: 0,   incoming: 30,  warehouse: 'Bangalore WH', lastUpdated: '5d ago',  reorderPoint: 10 },
  { id: 5, emoji: '📗', name: 'Clean Code Book',        sku: 'CCB-003', category: 'Books',          stock: 200, reserved: 18, available: 182, incoming: 0,   warehouse: 'Hyderabad WH', lastUpdated: '1h ago',  reorderPoint: 30 },
  { id: 6, emoji: '⌚', name: 'Smart Watch Series 5',   sku: 'SWS-005', category: 'Electronics',    stock: 34,  reserved: 8,  available: 26,  incoming: 20,  warehouse: 'Delhi WH',     lastUpdated: '30m ago', reorderPoint: 15 },
  { id: 7, emoji: '🎒', name: 'Laptop Backpack 30L',    sku: 'LBP-030', category: 'Clothing',       stock: 3,   reserved: 1,  available: 2,   incoming: 40,  warehouse: 'Mumbai WH',    lastUpdated: '2d ago',  reorderPoint: 10 },
  { id: 8, emoji: '💡', name: 'Smart LED Bulb',         sku: 'SLB-010', category: 'Home & Kitchen', stock: 89,  reserved: 10, available: 79,  incoming: 0,   warehouse: 'Chennai WH',   lastUpdated: '4h ago',  reorderPoint: 25 },
];

const getStatus = (stock: number, reorder: number) => {
  if (stock === 0)          return { label: 'Out of Stock', badge: 'bg-red-100 text-red-600',    dot: 'bg-red-500'    };
  if (stock <= reorder)     return { label: 'Low Stock',    badge: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' };
  return                           { label: 'In Stock',     badge: 'bg-green-100 text-green-700', dot: 'bg-green-500'  };
};

const warehouses = ['All Warehouses', 'Delhi WH', 'Mumbai WH', 'Bangalore WH', 'Hyderabad WH', 'Chennai WH'];

export default function Inventory() {
  const navigate = useNavigate();
  const [search, setSearch]         = useState('');
  const [selectedWH, setSelectedWH] = useState('All Warehouses');
  const [filterStatus, setFilter]   = useState('All');
  const [editingId, setEditingId]   = useState<number | null>(null);
  const [stockEdit, setStockEdit]   = useState('');
  const [data, setData]             = useState(inventoryData);

  const filtered = data.filter(item => {
    const q = search.toLowerCase();
    const matchSearch = item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q);
    const matchWH     = selectedWH === 'All Warehouses' || item.warehouse === selectedWH;
    const status      = getStatus(item.stock, item.reorderPoint).label;
    const matchStatus = filterStatus === 'All' || status === filterStatus;
    return matchSearch && matchWH && matchStatus;
  });

  const saveStock = (id: number) => {
    setData(prev => prev.map(item =>
      item.id === id ? { ...item, stock: Number(stockEdit), available: Number(stockEdit) - item.reserved } : item
    ));
    setEditingId(null);
  };

  const totalStock   = data.reduce((s, i) => s + i.stock, 0);
  const lowCount     = data.filter(i => i.stock > 0 && i.stock <= i.reorderPoint).length;
  const outCount     = data.filter(i => i.stock === 0).length;
  const incomingCount = data.filter(i => i.incoming > 0).length;

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-5 md:p-7">

      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track stock levels across all your warehouses</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors">
            📋 Export
          </button>
          <button onClick={() => navigate('/products/add')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-200">
            + Add Stock
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5">
        {[
          { label: 'Total Stock Units',    value: totalStock.toLocaleString(), icon: '📦', color: 'text-blue-600',   bg: 'bg-blue-50'   },
          { label: 'Low Stock Items',      value: lowCount,                    icon: '⚠️', color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Out of Stock',         value: outCount,                    icon: '❌', color: 'text-red-600',    bg: 'bg-red-50'    },
          { label: 'Incoming Shipments',   value: incomingCount,               icon: '🚚', color: 'text-green-600',  bg: 'bg-green-50'  },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 font-medium leading-tight">{s.label}</span>
              <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center text-sm shrink-0`}>{s.icon}</div>
            </div>
            <p className={`text-2xl sm:text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Filter Bar ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 sm:p-4 mb-4 flex flex-col gap-3">
        {/* Search + Warehouse */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by product or SKU..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-colors" />
          </div>
          <select value={selectedWH} onChange={e => setSelectedWH(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none cursor-pointer">
            {warehouses.map(w => <option key={w}>{w}</option>)}
          </select>
        </div>
        {/* Status filter pills — scroll on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['All', 'In Stock', 'Low Stock', 'Out of Stock'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-colors ${filterStatus === s ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Inventory Table ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Product', 'SKU', 'Total Stock', 'Reserved', 'Available', 'Incoming', 'Reorder Pt.', 'Warehouse', 'Status', 'Actions'].map(h => (
                  <th key={h} className="py-3 px-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(item => {
                const status    = getStatus(item.stock, item.reorderPoint);
                const isEditing = editingId === item.id;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-lg shrink-0">{item.emoji}</div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 whitespace-nowrap">{item.name}</p>
                          <p className="text-[11px] text-slate-400">{item.lastUpdated}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono font-semibold text-slate-500 whitespace-nowrap">{item.sku}</td>
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input value={stockEdit} onChange={e => setStockEdit(e.target.value)}
                            className="w-16 px-2 py-1.5 rounded-lg border-2 border-blue-500 text-sm outline-none" autoFocus />
                          <button onClick={() => saveStock(item.id)} className="bg-blue-600 text-white text-xs font-bold px-2 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">✓</button>
                          <button onClick={() => setEditingId(null)} className="bg-slate-100 text-slate-500 text-xs px-2 py-1.5 rounded-lg hover:bg-slate-200 transition-colors">✕</button>
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-slate-900">{item.stock}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-500">{item.reserved}</td>
                    <td className={`py-3 px-4 text-sm font-semibold ${item.available <= 5 ? 'text-red-500' : 'text-slate-800'}`}>{item.available}</td>
                    <td className="py-3 px-4">
                      {item.incoming > 0
                        ? <span className="text-sm font-semibold text-green-700 bg-green-50 px-2 py-1 rounded-lg">+{item.incoming}</span>
                        : <span className="text-slate-400 text-sm">—</span>}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-500">{item.reorderPoint}</td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-lg font-medium whitespace-nowrap">{item.warehouse}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${status.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => { setEditingId(item.id); setStockEdit(String(item.stock)); }}
                          className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap">
                          Update
                        </button>
                        {item.stock <= item.reorderPoint && (
                          <button className="bg-yellow-50 text-yellow-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-yellow-100 transition-colors whitespace-nowrap">
                            Reorder
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Alert Banner */}
        {(lowCount > 0 || outCount > 0) && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 py-3 bg-yellow-50 border-t border-yellow-200">
            <span className="text-lg shrink-0">⚠️</span>
            <span className="text-sm text-yellow-800 font-medium">
              {outCount > 0 && `${outCount} item${outCount > 1 ? 's' : ''} out of stock`}
              {outCount > 0 && lowCount > 0 && ' · '}
              {lowCount > 0 && `${lowCount} item${lowCount > 1 ? 's' : ''} running low`}
              . Consider restocking soon.
            </span>
            <button className="sm:ml-auto shrink-0 bg-yellow-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-yellow-600 transition-colors whitespace-nowrap">
              View Low Stock →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// // FILE: src/pages/Products/Inventory.tsx
// // PASTE: Replace entire content of your existing Inventory.tsx

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const inventoryData = [
//   { id: 1, emoji: '🎧', name: 'Wireless Earbuds Pro', sku: 'WEP-001', category: 'Electronics', stock: 142, reserved: 12, available: 130, incoming: 50, warehouse: 'Delhi WH', lastUpdated: '2h ago', reorderPoint: 20 },
//   { id: 2, emoji: '👕', name: 'Cotton Polo Shirt', sku: 'CPS-112', category: 'Clothing', stock: 7, reserved: 2, available: 5, incoming: 100, warehouse: 'Mumbai WH', lastUpdated: '1d ago', reorderPoint: 15 },
//   { id: 3, emoji: '🍳', name: 'Non-Stick Kadai 28cm', sku: 'NSK-028', category: 'Home & Kitchen', stock: 58, reserved: 5, available: 53, incoming: 0, warehouse: 'Delhi WH', lastUpdated: '3h ago', reorderPoint: 10 },
//   { id: 4, emoji: '🖥️', name: 'USB-C Hub 7-in-1', sku: 'UCH-071', category: 'Electronics', stock: 0, reserved: 0, available: 0, incoming: 30, warehouse: 'Bangalore WH', lastUpdated: '5d ago', reorderPoint: 10 },
//   { id: 5, emoji: '📗', name: 'Clean Code Book', sku: 'CCB-003', category: 'Books', stock: 200, reserved: 18, available: 182, incoming: 0, warehouse: 'Hyderabad WH', lastUpdated: '1h ago', reorderPoint: 30 },
//   { id: 6, emoji: '⌚', name: 'Smart Watch Series 5', sku: 'SWS-005', category: 'Electronics', stock: 34, reserved: 8, available: 26, incoming: 20, warehouse: 'Delhi WH', lastUpdated: '30m ago', reorderPoint: 15 },
//   { id: 7, emoji: '🎒', name: 'Laptop Backpack 30L', sku: 'LBP-030', category: 'Clothing', stock: 3, reserved: 1, available: 2, incoming: 40, warehouse: 'Mumbai WH', lastUpdated: '2d ago', reorderPoint: 10 },
//   { id: 8, emoji: '💡', name: 'Smart LED Bulb', sku: 'SLB-010', category: 'Home & Kitchen', stock: 89, reserved: 10, available: 79, incoming: 0, warehouse: 'Chennai WH', lastUpdated: '4h ago', reorderPoint: 25 },
// ];

// const getStockStatus = (stock: number, reorder: number) => {
//   if (stock === 0) return { label: 'Out of Stock', color: '#dc2626', bg: '#fef2f2', dot: '#ef4444' };
//   if (stock <= reorder) return { label: 'Low Stock', color: '#d97706', bg: '#fffbeb', dot: '#f59e0b' };
//   return { label: 'In Stock', color: '#16a34a', bg: '#f0fdf4', dot: '#22c55e' };
// };

// const warehouses = ['All Warehouses', 'Delhi WH', 'Mumbai WH', 'Bangalore WH', 'Hyderabad WH', 'Chennai WH'];

// export default function Inventory() {
//   const navigate = useNavigate();
//   const [search, setSearch] = useState('');
//   const [selectedWH, setSelectedWH] = useState('All Warehouses');
//   const [filterStatus, setFilterStatus] = useState('All');
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [stockEdit, setStockEdit] = useState('');
//   const [data, setData] = useState(inventoryData);

//   const filtered = data.filter(item => {
//     const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase());
//     const matchWH = selectedWH === 'All Warehouses' || item.warehouse === selectedWH;
//     const status = getStockStatus(item.stock, item.reorderPoint).label;
//     const matchStatus = filterStatus === 'All' || status === filterStatus;
//     return matchSearch && matchWH && matchStatus;
//   });

//   const saveStock = (id: number) => {
//     setData(prev => prev.map(item => item.id === id ? { ...item, stock: Number(stockEdit), available: Number(stockEdit) - item.reserved } : item));
//     setEditingId(null);
//   };

//   const totalStock = data.reduce((s, i) => s + i.stock, 0);
//   const lowCount = data.filter(i => i.stock > 0 && i.stock <= i.reorderPoint).length;
//   const outCount = data.filter(i => i.stock === 0).length;
//   const incomingCount = data.filter(i => i.incoming > 0).length;

//   return (
//     <div style={{ padding: '28px', background: '#f8fafc', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>

//       {/* Header */}
//       <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
//         <div>
//           <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Inventory</h1>
//           <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0' }}>Track stock levels across all your warehouses</p>
//         </div>
//         <div style={{ display: 'flex', gap: '10px' }}>
//           <button style={{ padding: '10px 16px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#374151', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>📋 Export</button>
//           <button onClick={() => navigate('/products/add')} style={{
//             padding: '10px 18px', borderRadius: '10px', border: 'none',
//             background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff',
//             fontSize: '14px', fontWeight: 600, cursor: 'pointer',
//             boxShadow: '0 4px 12px rgba(37,99,235,0.35)'
//           }}>+ Add Stock</button>
//         </div>
//       </div>

//       {/* Stats */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
//         {[
//           { label: 'Total Stock Units', value: totalStock.toLocaleString(), icon: '📦', color: '#2563eb', bg: '#eff6ff' },
//           { label: 'Low Stock Items', value: lowCount, icon: '⚠️', color: '#d97706', bg: '#fffbeb' },
//           { label: 'Out of Stock', value: outCount, icon: '❌', color: '#dc2626', bg: '#fef2f2' },
//           { label: 'Incoming Shipments', value: incomingCount, icon: '🚚', color: '#16a34a', bg: '#f0fdf4' },
//         ].map(s => (
//           <div key={s.label} style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
//               <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>{s.label}</span>
//               <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>{s.icon}</div>
//             </div>
//             <div style={{ fontSize: '28px', fontWeight: 700, color: s.color }}>{s.value}</div>
//           </div>
//         ))}
//       </div>

//       {/* Filter Bar */}
//       <div style={{ background: '#fff', borderRadius: '14px', padding: '16px 20px', border: '1px solid #f1f5f9', marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
//         <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
//           <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
//           <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by product or SKU..."
//             style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '9px', border: '1.5px solid #e2e8f0', fontSize: '13px', outline: 'none', boxSizing: 'border-box', background: '#f8fafc' }} />
//         </div>
//         <select value={selectedWH} onChange={e => setSelectedWH(e.target.value)} style={{ padding: '9px 14px', borderRadius: '9px', border: '1.5px solid #e2e8f0', fontSize: '13px', background: '#f8fafc', cursor: 'pointer' }}>
//           {warehouses.map(w => <option key={w}>{w}</option>)}
//         </select>
//         <div style={{ display: 'flex', gap: '6px' }}>
//           {['All', 'In Stock', 'Low Stock', 'Out of Stock'].map(s => (
//             <button key={s} onClick={() => setFilterStatus(s)} style={{
//               padding: '8px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0',
//               background: filterStatus === s ? '#2563eb' : '#fff',
//               color: filterStatus === s ? '#fff' : '#64748b',
//               fontSize: '12px', fontWeight: 600, cursor: 'pointer'
//             }}>{s}</button>
//           ))}
//         </div>
//       </div>

//       {/* Inventory Table */}
//       <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
//         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <thead>
//             <tr style={{ background: '#f8fafc' }}>
//               {['Product', 'SKU', 'Total Stock', 'Reserved', 'Available', 'Incoming', 'Reorder Point', 'Warehouse', 'Status', 'Actions'].map(h => (
//                 <th key={h} style={{ padding: '13px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {filtered.map(item => {
//               const status = getStockStatus(item.stock, item.reorderPoint);
//               const isEditing = editingId === item.id;
//               return (
//                 <tr key={item.id} style={{ borderTop: '1px solid #f8fafc' }}>
//                   <td style={{ padding: '14px 16px' }}>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//                       <div style={{ width: '38px', height: '38px', borderRadius: '9px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{item.emoji}</div>
//                       <div>
//                         <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{item.name}</div>
//                         <div style={{ fontSize: '11px', color: '#94a3b8' }}>{item.lastUpdated}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td style={{ padding: '14px 16px', fontSize: '12px', color: '#64748b', fontFamily: 'monospace', fontWeight: 600 }}>{item.sku}</td>
//                   <td style={{ padding: '14px 16px' }}>
//                     {isEditing ? (
//                       <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
//                         <input value={stockEdit} onChange={e => setStockEdit(e.target.value)}
//                           style={{ width: '70px', padding: '6px 10px', borderRadius: '7px', border: '1.5px solid #2563eb', fontSize: '13px', outline: 'none' }} autoFocus />
//                         <button onClick={() => saveStock(item.id)} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>✓</button>
//                         <button onClick={() => setEditingId(null)} style={{ background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '6px', padding: '6px 8px', cursor: 'pointer', fontSize: '11px' }}>✕</button>
//                       </div>
//                     ) : (
//                       <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{item.stock}</span>
//                     )}
//                   </td>
//                   <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>{item.reserved}</td>
//                   <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: 600, color: item.available <= 5 ? '#dc2626' : '#0f172a' }}>{item.available}</td>
//                   <td style={{ padding: '14px 16px' }}>
//                     {item.incoming > 0 ? (
//                       <span style={{ fontSize: '13px', color: '#16a34a', fontWeight: 600, background: '#f0fdf4', padding: '3px 8px', borderRadius: '6px' }}>+{item.incoming}</span>
//                     ) : <span style={{ color: '#94a3b8', fontSize: '13px' }}>—</span>}
//                   </td>
//                   <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>{item.reorderPoint}</td>
//                   <td style={{ padding: '14px 16px' }}>
//                     <span style={{ fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px', fontWeight: 500 }}>{item.warehouse}</span>
//                   </td>
//                   <td style={{ padding: '14px 16px' }}>
//                     <span style={{ ...status, padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
//                       <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: status.dot, display: 'inline-block' }} />
//                       {status.label}
//                     </span>
//                   </td>
//                   <td style={{ padding: '14px 16px' }}>
//                     <div style={{ display: 'flex', gap: '6px' }}>
//                       <button onClick={() => { setEditingId(item.id); setStockEdit(String(item.stock)); }} style={{ background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '7px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Update</button>
//                       {item.stock <= item.reorderPoint && (
//                         <button style={{ background: '#fffbeb', color: '#d97706', border: 'none', borderRadius: '7px', padding: '6px 10px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Reorder</button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>

//         {/* Low Stock Alert Banner */}
//         {lowCount > 0 || outCount > 0 ? (
//           <div style={{ padding: '14px 20px', background: '#fffbeb', borderTop: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: '12px' }}>
//             <span style={{ fontSize: '18px' }}>⚠️</span>
//             <span style={{ fontSize: '13px', color: '#92400e', fontWeight: 500 }}>
//               {outCount > 0 && `${outCount} item${outCount > 1 ? 's' : ''} out of stock`}
//               {outCount > 0 && lowCount > 0 && ' · '}
//               {lowCount > 0 && `${lowCount} item${lowCount > 1 ? 's' : ''} running low`}
//               . Consider restocking soon.
//             </span>
//             <button style={{ marginLeft: 'auto', background: '#d97706', color: '#fff', border: 'none', borderRadius: '7px', padding: '6px 14px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>View Low Stock →</button>
//           </div>
//         ) : null}
//       </div>
//     </div>
//   );
// }