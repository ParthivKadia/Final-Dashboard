import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const categories  = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Beauty', 'Sports', 'Toys', 'Automotive'];
const conditions  = ['New', 'Refurbished', 'Used - Like New', 'Used - Good'];

interface FormData {
  name: string; sku: string; category: string; price: string; mrp: string;
  stock: string; minStock: string; description: string; brand: string;
  weight: string; condition: string; tags: string; hsn: string; gst: string;
}

export default function AddProduct() {
  const navigate  = useNavigate();
  const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'inventory' | 'shipping'>('basic');
  const [dragOver, setDragOver]   = useState(false);
  const [saving, setSaving]       = useState(false);
  const [form, setForm] = useState<FormData>({
    name: '', sku: '', category: '', price: '', mrp: '', stock: '', minStock: '',
    description: '', brand: '', weight: '', condition: 'New', tags: '', hsn: '', gst: '18',
  });

  const update = (field: keyof FormData, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); navigate('/products'); }, 1500);
  };

  const discount = form.mrp && form.price
    ? Math.round((1 - Number(form.price) / Number(form.mrp)) * 100) : 0;

  const checklist = [
    { label: 'Product name',      done: !!form.name },
    { label: 'Category selected', done: !!form.category },
    { label: 'SKU added',         done: !!form.sku },
    { label: 'Selling price set', done: !!form.price },
    { label: 'Stock quantity',    done: !!form.stock },
    { label: 'Description',       done: !!form.description },
  ];
  const progress = Math.round((checklist.filter(c => c.done).length / checklist.length) * 100);

  const tabs = [
    { id: 'basic',     label: 'Basic Info',     icon: '📝' },
    { id: 'pricing',   label: 'Pricing & Tax',  icon: '💰' },
    { id: 'inventory', label: 'Inventory',       icon: '📦' },
    { id: 'shipping',  label: 'Shipping',        icon: '🚚' },
  ] as const;

  // Shared input class
  const inp = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all";
  const lbl = "block text-sm font-semibold text-slate-700 mb-1.5";

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-5 md:p-7">

      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/products')}
            className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-base hover:bg-slate-50 transition-colors shrink-0">
            ←
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Add New Product</h1>
            <p className="text-sm text-slate-500 mt-0.5">Fill in the details to list a new product</p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors">
            Save Draft
          </button>
          <button onClick={handleSave} disabled={saving}
            className={`px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all shadow-md shadow-blue-200 flex items-center gap-2 ${saving ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {saving ? '⏳ Publishing...' : '🚀 Publish'}
          </button>
        </div>
      </div>

      {/* ── Two-column layout: stacks on mobile ── */}
      <div className="flex flex-col lg:flex-row gap-5">

        {/* ── LEFT: Main form ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">

          {/* Tabs — scroll on mobile */}
          <div className="bg-white rounded-2xl border border-slate-100 p-1.5 flex gap-1 overflow-x-auto">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[80px] flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                <span>{tab.icon}</span>
                <span className="hidden xs:inline sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* ── BASIC INFO ── */}
          {activeTab === 'basic' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
              <h2 className="text-base font-bold text-slate-900 mb-5">Product Information</h2>
              <div className="space-y-4">
                <div>
                  <label className={lbl}>Product Name *</label>
                  <input value={form.name} onChange={e => update('name', e.target.value)}
                    placeholder="e.g. Wireless Bluetooth Earbuds Pro" className={inp} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={lbl}>Brand</label>
                    <input value={form.brand} onChange={e => update('brand', e.target.value)}
                      placeholder="e.g. Sony, Nike..." className={inp} />
                  </div>
                  <div>
                    <label className={lbl}>Category *</label>
                    <select value={form.category} onChange={e => update('category', e.target.value)} className={inp}>
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={lbl}>SKU *</label>
                    <input value={form.sku} onChange={e => update('sku', e.target.value)}
                      placeholder="e.g. WEP-001" className={`${inp} font-mono`} />
                  </div>
                  <div>
                    <label className={lbl}>Condition</label>
                    <select value={form.condition} onChange={e => update('condition', e.target.value)} className={inp}>
                      {conditions.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={lbl}>Description</label>
                  <textarea value={form.description} onChange={e => update('description', e.target.value)}
                    placeholder="Describe your product in detail..."
                    rows={5} className={`${inp} resize-y leading-relaxed`} />
                </div>
                <div>
                  <label className={lbl}>Tags (comma separated)</label>
                  <input value={form.tags} onChange={e => update('tags', e.target.value)}
                    placeholder="wireless, earbuds, bluetooth" className={inp} />
                </div>
              </div>
            </div>
          )}

          {/* ── PRICING ── */}
          {activeTab === 'pricing' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
              <h2 className="text-base font-bold text-slate-900 mb-5">Pricing & Tax Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={lbl}>Selling Price (₹) *</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">₹</span>
                      <input value={form.price} onChange={e => update('price', e.target.value)}
                        placeholder="0.00" type="number" className={`${inp} pl-7`} />
                    </div>
                  </div>
                  <div>
                    <label className={lbl}>MRP / Original Price (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">₹</span>
                      <input value={form.mrp} onChange={e => update('mrp', e.target.value)}
                        placeholder="0.00" type="number" className={`${inp} pl-7`} />
                    </div>
                  </div>
                </div>

                {discount > 0 && (
                  <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <p className="text-base font-bold text-green-700">{discount}% OFF</p>
                      <p className="text-xs text-slate-500">Customers save ₹{(Number(form.mrp) - Number(form.price)).toLocaleString()}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={lbl}>HSN Code</label>
                    <input value={form.hsn} onChange={e => update('hsn', e.target.value)}
                      placeholder="e.g. 8518" className={`${inp} font-mono`} />
                  </div>
                  <div>
                    <label className={lbl}>GST Rate (%)</label>
                    <select value={form.gst} onChange={e => update('gst', e.target.value)} className={inp}>
                      {['0', '5', '12', '18', '28'].map(g => <option key={g} value={g}>{g}%</option>)}
                    </select>
                  </div>
                </div>

                {form.price && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p className="text-sm font-bold text-slate-700 mb-3">Price Breakdown</p>
                    {[
                      { label: 'Base Price',    value: `₹${(Number(form.price) / (1 + Number(form.gst) / 100)).toFixed(2)}` },
                      { label: `GST (${form.gst}%)`, value: `₹${(Number(form.price) - Number(form.price) / (1 + Number(form.gst) / 100)).toFixed(2)}` },
                      { label: 'Selling Price', value: `₹${Number(form.price).toLocaleString()}`, bold: true },
                    ].map(row => (
                      <div key={row.label} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                        <span className="text-sm text-slate-500">{row.label}</span>
                        <span className={`text-sm ${row.bold ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── INVENTORY ── */}
          {activeTab === 'inventory' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
              <h2 className="text-base font-bold text-slate-900 mb-5">Inventory Management</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={lbl}>Available Stock *</label>
                    <input value={form.stock} onChange={e => update('stock', e.target.value)}
                      placeholder="0" type="number" className={inp} />
                  </div>
                  <div>
                    <label className={lbl}>Min Stock Alert</label>
                    <input value={form.minStock} onChange={e => update('minStock', e.target.value)}
                      placeholder="e.g. 10" type="number" className={inp} />
                    <p className="text-xs text-slate-400 mt-1">Alert when stock falls below this</p>
                  </div>
                </div>
                <div>
                  <label className={lbl}>Product Weight (grams)</label>
                  <input value={form.weight} onChange={e => update('weight', e.target.value)}
                    placeholder="e.g. 250" type="number" className={inp} />
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-yellow-800 mb-1">📋 Stock Status Preview</p>
                  <p className="text-sm text-yellow-700">
                    {!form.stock          ? 'Enter stock quantity above'
                    : Number(form.stock) === 0           ? '❌ Out of Stock'
                    : Number(form.stock) <= Number(form.minStock || 10) ? '⚠️ Will be marked as Low Stock'
                    : '✅ Will be marked as Active'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── SHIPPING ── */}
          {activeTab === 'shipping' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
              <h2 className="text-base font-bold text-slate-900 mb-5">Shipping Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {['Length (cm)', 'Width (cm)', 'Height (cm)'].map(label => (
                    <div key={label}>
                      <label className={lbl}>{label}</label>
                      <input placeholder="0" type="number" className={inp} />
                    </div>
                  ))}
                </div>
                <div>
                  <label className={lbl}>Shipping Class</label>
                  <select className={inp}>
                    <option>Standard (5-7 days)</option>
                    <option>Express (2-3 days)</option>
                    <option>Same Day</option>
                    <option>Fragile / Special Handling</option>
                  </select>
                </div>
                <label className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-green-600" />
                  <span className="text-sm font-medium text-green-800">🚚 Offer Free Shipping on this product</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Sidebar (stacks below on mobile) ── */}
        <div className="w-full lg:w-[300px] xl:w-[320px] shrink-0 flex flex-col gap-4">

          {/* Image Upload */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Product Images</h3>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); }}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-slate-50 hover:border-blue-300'}`}>
              <div className="text-4xl mb-2">🖼️</div>
              <p className="text-sm font-semibold text-slate-700 mb-1">Drop images here</p>
              <p className="text-xs text-slate-400 mb-4">PNG, JPG up to 5MB each</p>
              <button className="bg-blue-50 text-blue-600 border border-blue-200 rounded-xl px-4 py-2 text-sm font-semibold hover:bg-blue-100 transition-colors">
                Browse Files
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2.5 text-center">First image will be the main product photo</p>
          </div>

          {/* Publish Settings */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Publish Settings</h3>
            <div className="space-y-3">
              {[
                { label: 'Status',     options: ['Active', 'Draft', 'Scheduled'] },
                { label: 'Visibility', options: ['Public', 'Private', 'Password Protected'] },
              ].map(({ label, options }) => (
                <div key={label}>
                  <label className={lbl}>{label}</label>
                  <select className={inp}>{options.map(o => <option key={o}>{o}</option>)}</select>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Listing Checklist</h3>
            <div className="space-y-0">
              {checklist.map(({ label, done }) => (
                <div key={label} className="flex items-center gap-2.5 py-2 border-b border-slate-50 last:border-0">
                  <span className="text-sm">{done ? '✅' : '⬜'}</span>
                  <span className={`text-sm ${done ? 'text-green-700 font-semibold' : 'text-slate-400'}`}>{label}</span>
                </div>
              ))}
            </div>
            {/* Progress bar */}
            <div className="mt-3 bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1.5">{progress}% complete</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// // FILE: src/pages/Products/AddProduct.tsx
// // PASTE: Create this new file at src/pages/Products/AddProduct.tsx

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Beauty', 'Sports', 'Toys', 'Automotive'];
// const conditions = ['New', 'Refurbished', 'Used - Like New', 'Used - Good'];

// interface FormData {
//   name: string; sku: string; category: string; price: string; mrp: string;
//   stock: string; minStock: string; description: string; brand: string;
//   weight: string; condition: string; tags: string; hsn: string; gst: string;
// }

// export default function AddProduct() {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'inventory' | 'shipping'>('basic');
//   const [dragOver, setDragOver] = useState(false);
//   const [images, setImages] = useState<string[]>([]);
//   const [saving, setSaving] = useState(false);
//   const [form, setForm] = useState<FormData>({
//     name: '', sku: '', category: '', price: '', mrp: '', stock: '', minStock: '',
//     description: '', brand: '', weight: '', condition: 'New', tags: '', hsn: '', gst: '18'
//   });

//   const update = (field: keyof FormData, value: string) => setForm(prev => ({ ...prev, [field]: value }));

//   const handleSave = () => {
//     setSaving(true);
//     setTimeout(() => { setSaving(false); navigate('/products'); }, 1500);
//   };

//   const tabs = [
//     { id: 'basic', label: 'Basic Info', icon: '📝' },
//     { id: 'pricing', label: 'Pricing & Tax', icon: '💰' },
//     { id: 'inventory', label: 'Inventory', icon: '📦' },
//     { id: 'shipping', label: 'Shipping', icon: '🚚' },
//   ] as const;

//   const inputStyle: React.CSSProperties = {
//     width: '100%', padding: '11px 14px', borderRadius: '10px',
//     border: '1.5px solid #e2e8f0', fontSize: '14px', color: '#0f172a',
//     outline: 'none', boxSizing: 'border-box', background: '#fff',
//     transition: 'border-color 0.15s',
//   };
//   const labelStyle: React.CSSProperties = {
//     fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block'
//   };

//   const discount = form.mrp && form.price ? Math.round((1 - Number(form.price) / Number(form.mrp)) * 100) : 0;

//   return (
//     <div style={{ padding: '28px', background: '#f8fafc', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>

//       {/* Header */}
//       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
//           <button onClick={() => navigate('/products')} style={{
//             width: '38px', height: '38px', borderRadius: '10px', border: '1.5px solid #e2e8f0',
//             background: '#fff', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center'
//           }}>←</button>
//           <div>
//             <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Add New Product</h1>
//             <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0' }}>Fill in the details to list a new product</p>
//           </div>
//         </div>
//         <div style={{ display: 'flex', gap: '10px' }}>
//           <button style={{
//             padding: '10px 18px', borderRadius: '10px', border: '1.5px solid #e2e8f0',
//             background: '#fff', color: '#374151', fontSize: '14px', fontWeight: 500, cursor: 'pointer'
//           }}>Save Draft</button>
//           <button onClick={handleSave} style={{
//             padding: '10px 22px', borderRadius: '10px', border: 'none',
//             background: saving ? '#94a3b8' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
//             color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
//             boxShadow: '0 4px 12px rgba(37,99,235,0.35)', display: 'flex', alignItems: 'center', gap: '8px'
//           }}>
//             {saving ? '⏳ Publishing...' : '🚀 Publish Product'}
//           </button>
//         </div>
//       </div>

//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>

//         {/* LEFT: Main Form */}
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

//           {/* Tabs */}
//           <div style={{ display: 'flex', gap: '4px', background: '#fff', padding: '6px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
//             {tabs.map(tab => (
//               <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
//                 flex: 1, padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer',
//                 background: activeTab === tab.id ? '#2563eb' : 'transparent',
//                 color: activeTab === tab.id ? '#fff' : '#64748b',
//                 fontSize: '13px', fontWeight: 600, transition: 'all 0.2s',
//                 display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
//               }}>
//                 <span>{tab.icon}</span> {tab.label}
//               </button>
//             ))}
//           </div>

//           {/* BASIC INFO TAB */}
//           {activeTab === 'basic' && (
//             <div style={{ background: '#fff', borderRadius: '14px', padding: '24px', border: '1px solid #f1f5f9' }}>
//               <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginTop: 0, marginBottom: '20px' }}>Product Information</h2>
//               <div style={{ display: 'grid', gap: '18px' }}>
//                 <div>
//                   <label style={labelStyle}>Product Name *</label>
//                   <input value={form.name} onChange={e => update('name', e.target.value)}
//                     placeholder="e.g. Wireless Bluetooth Earbuds Pro" style={inputStyle} />
//                 </div>
//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
//                   <div>
//                     <label style={labelStyle}>Brand</label>
//                     <input value={form.brand} onChange={e => update('brand', e.target.value)}
//                       placeholder="e.g. Sony, Nike..." style={inputStyle} />
//                   </div>
//                   <div>
//                     <label style={labelStyle}>Category *</label>
//                     <select value={form.category} onChange={e => update('category', e.target.value)} style={inputStyle}>
//                       <option value="">Select category</option>
//                       {categories.map(c => <option key={c}>{c}</option>)}
//                     </select>
//                   </div>
//                 </div>
//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
//                   <div>
//                     <label style={labelStyle}>SKU *</label>
//                     <input value={form.sku} onChange={e => update('sku', e.target.value)}
//                       placeholder="e.g. WEP-001" style={{ ...inputStyle, fontFamily: 'monospace' }} />
//                   </div>
//                   <div>
//                     <label style={labelStyle}>Condition</label>
//                     <select value={form.condition} onChange={e => update('condition', e.target.value)} style={inputStyle}>
//                       {conditions.map(c => <option key={c}>{c}</option>)}
//                     </select>
//                   </div>
//                 </div>
//                 <div>
//                   <label style={labelStyle}>Description</label>
//                   <textarea value={form.description} onChange={e => update('description', e.target.value)}
//                     placeholder="Describe your product in detail... features, specifications, what's in the box"
//                     rows={5} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
//                 </div>
//                 <div>
//                   <label style={labelStyle}>Tags (comma separated)</label>
//                   <input value={form.tags} onChange={e => update('tags', e.target.value)}
//                     placeholder="wireless, earbuds, bluetooth, noise-cancelling" style={inputStyle} />
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* PRICING TAB */}
//           {activeTab === 'pricing' && (
//             <div style={{ background: '#fff', borderRadius: '14px', padding: '24px', border: '1px solid #f1f5f9' }}>
//               <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginTop: 0, marginBottom: '20px' }}>Pricing & Tax Details</h2>
//               <div style={{ display: 'grid', gap: '18px' }}>
//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
//                   <div>
//                     <label style={labelStyle}>Selling Price (₹) *</label>
//                     <div style={{ position: 'relative' }}>
//                       <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontWeight: 700 }}>₹</span>
//                       <input value={form.price} onChange={e => update('price', e.target.value)}
//                         placeholder="0.00" type="number" style={{ ...inputStyle, paddingLeft: '28px' }} />
//                     </div>
//                   </div>
//                   <div>
//                     <label style={labelStyle}>MRP / Original Price (₹)</label>
//                     <div style={{ position: 'relative' }}>
//                       <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontWeight: 700 }}>₹</span>
//                       <input value={form.mrp} onChange={e => update('mrp', e.target.value)}
//                         placeholder="0.00" type="number" style={{ ...inputStyle, paddingLeft: '28px' }} />
//                     </div>
//                   </div>
//                 </div>

//                 {discount > 0 && (
//                   <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
//                     <span style={{ fontSize: '22px' }}>🎉</span>
//                     <div>
//                       <div style={{ fontSize: '15px', fontWeight: 700, color: '#16a34a' }}>{discount}% OFF</div>
//                       <div style={{ fontSize: '12px', color: '#64748b' }}>Customers save ₹{(Number(form.mrp) - Number(form.price)).toLocaleString()}</div>
//                     </div>
//                   </div>
//                 )}

//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
//                   <div>
//                     <label style={labelStyle}>HSN Code</label>
//                     <input value={form.hsn} onChange={e => update('hsn', e.target.value)}
//                       placeholder="e.g. 8518" style={{ ...inputStyle, fontFamily: 'monospace' }} />
//                   </div>
//                   <div>
//                     <label style={labelStyle}>GST Rate (%)</label>
//                     <select value={form.gst} onChange={e => update('gst', e.target.value)} style={inputStyle}>
//                       {['0', '5', '12', '18', '28'].map(g => <option key={g} value={g}>{g}%</option>)}
//                     </select>
//                   </div>
//                 </div>

//                 {form.price && (
//                   <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '16px', border: '1px solid #e2e8f0' }}>
//                     <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>Price Breakdown</div>
//                     {[
//                       { label: 'Base Price', value: `₹${(Number(form.price) / (1 + Number(form.gst) / 100)).toFixed(2)}` },
//                       { label: `GST (${form.gst}%)`, value: `₹${(Number(form.price) - Number(form.price) / (1 + Number(form.gst) / 100)).toFixed(2)}` },
//                       { label: 'Selling Price', value: `₹${Number(form.price).toLocaleString()}`, bold: true },
//                     ].map(row => (
//                       <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
//                         <span style={{ fontSize: '13px', color: '#64748b' }}>{row.label}</span>
//                         <span style={{ fontSize: '13px', fontWeight: row.bold ? 700 : 500, color: row.bold ? '#0f172a' : '#374151' }}>{row.value}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* INVENTORY TAB */}
//           {activeTab === 'inventory' && (
//             <div style={{ background: '#fff', borderRadius: '14px', padding: '24px', border: '1px solid #f1f5f9' }}>
//               <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginTop: 0, marginBottom: '20px' }}>Inventory Management</h2>
//               <div style={{ display: 'grid', gap: '18px' }}>
//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
//                   <div>
//                     <label style={labelStyle}>Available Stock *</label>
//                     <input value={form.stock} onChange={e => update('stock', e.target.value)}
//                       placeholder="0" type="number" style={inputStyle} />
//                   </div>
//                   <div>
//                     <label style={labelStyle}>Min Stock Alert</label>
//                     <input value={form.minStock} onChange={e => update('minStock', e.target.value)}
//                       placeholder="e.g. 10" type="number" style={inputStyle} />
//                     <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Alert when stock falls below this</div>
//                   </div>
//                 </div>
//                 <div>
//                   <label style={labelStyle}>Product Weight (grams)</label>
//                   <input value={form.weight} onChange={e => update('weight', e.target.value)}
//                     placeholder="e.g. 250" type="number" style={inputStyle} />
//                 </div>
//                 <div style={{ background: '#fffbeb', borderRadius: '10px', padding: '14px 18px', border: '1px solid #fde68a' }}>
//                   <div style={{ fontSize: '13px', fontWeight: 600, color: '#92400e', marginBottom: '6px' }}>📋 Stock Status Preview</div>
//                   <div style={{ fontSize: '13px', color: '#78350f' }}>
//                     {!form.stock ? 'Enter stock quantity above' :
//                       Number(form.stock) === 0 ? '❌ Out of Stock' :
//                         Number(form.stock) <= Number(form.minStock || 10) ? '⚠️ Will be marked as Low Stock' :
//                           '✅ Will be marked as Active'}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* SHIPPING TAB */}
//           {activeTab === 'shipping' && (
//             <div style={{ background: '#fff', borderRadius: '14px', padding: '24px', border: '1px solid #f1f5f9' }}>
//               <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginTop: 0, marginBottom: '20px' }}>Shipping Details</h2>
//               <div style={{ display: 'grid', gap: '18px' }}>
//                 {[
//                   { label: 'Length (cm)', placeholder: '0' },
//                   { label: 'Width (cm)', placeholder: '0' },
//                   { label: 'Height (cm)', placeholder: '0' },
//                 ].map(({ label, placeholder }) => (
//                   <div key={label}>
//                     <label style={labelStyle}>{label}</label>
//                     <input placeholder={placeholder} type="number" style={inputStyle} />
//                   </div>
//                 ))}
//                 <div>
//                   <label style={labelStyle}>Shipping Class</label>
//                   <select style={inputStyle}>
//                     <option>Standard (5-7 days)</option>
//                     <option>Express (2-3 days)</option>
//                     <option>Same Day</option>
//                     <option>Fragile / Special Handling</option>
//                   </select>
//                 </div>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
//                   <input type="checkbox" id="freeShip" style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
//                   <label htmlFor="freeShip" style={{ fontSize: '14px', fontWeight: 500, color: '#166534', cursor: 'pointer' }}>
//                     🚚 Offer Free Shipping on this product
//                   </label>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* RIGHT: Image Upload + Status */}
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//           {/* Image Upload */}
//           <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #f1f5f9' }}>
//             <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginTop: 0, marginBottom: '14px' }}>Product Images</h3>
//             <div
//               onDragOver={e => { e.preventDefault(); setDragOver(true); }}
//               onDragLeave={() => setDragOver(false)}
//               onDrop={e => { e.preventDefault(); setDragOver(false); }}
//               style={{
//                 border: `2px dashed ${dragOver ? '#2563eb' : '#e2e8f0'}`,
//                 borderRadius: '12px', padding: '32px 20px', textAlign: 'center',
//                 background: dragOver ? '#eff6ff' : '#f8fafc', cursor: 'pointer',
//                 transition: 'all 0.2s'
//               }}
//             >
//               <div style={{ fontSize: '36px', marginBottom: '10px' }}>🖼️</div>
//               <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Drop images here</div>
//               <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '14px' }}>PNG, JPG up to 5MB each</div>
//               <button style={{
//                 background: '#eff6ff', color: '#2563eb', border: '1.5px solid #bfdbfe',
//                 borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 600
//               }}>Browse Files</button>
//             </div>
//             <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '10px', textAlign: 'center' }}>
//               First image will be the main product photo
//             </div>
//           </div>

//           {/* Publish Settings */}
//           <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #f1f5f9' }}>
//             <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginTop: 0, marginBottom: '14px' }}>Publish Settings</h3>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//               {[
//                 { label: 'Status', options: ['Active', 'Draft', 'Scheduled'] },
//                 { label: 'Visibility', options: ['Public', 'Private', 'Password Protected'] },
//               ].map(({ label, options }) => (
//                 <div key={label}>
//                   <label style={{ ...labelStyle, marginBottom: '4px' }}>{label}</label>
//                   <select style={inputStyle}>
//                     {options.map(o => <option key={o}>{o}</option>)}
//                   </select>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Checklist */}
//           <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #f1f5f9' }}>
//             <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginTop: 0, marginBottom: '14px' }}>Listing Checklist</h3>
//             {[
//               { label: 'Product name', done: !!form.name },
//               { label: 'Category selected', done: !!form.category },
//               { label: 'SKU added', done: !!form.sku },
//               { label: 'Selling price set', done: !!form.price },
//               { label: 'Stock quantity', done: !!form.stock },
//               { label: 'Description written', done: !!form.description },
//             ].map(({ label, done }) => (
//               <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', borderBottom: '1px solid #f8fafc' }}>
//                 <span style={{ fontSize: '14px' }}>{done ? '✅' : '⬜'}</span>
//                 <span style={{ fontSize: '13px', color: done ? '#16a34a' : '#94a3b8', fontWeight: done ? 600 : 400, textDecoration: done ? 'none' : 'none' }}>{label}</span>
//               </div>
//             ))}
//             <div style={{ marginTop: '12px', background: '#f8fafc', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
//               <div style={{
//                 height: '100%', borderRadius: '8px',
//                 background: 'linear-gradient(90deg, #2563eb, #22c55e)',
//                 width: `${([!!form.name, !!form.category, !!form.sku, !!form.price, !!form.stock, !!form.description].filter(Boolean).length / 6) * 100}%`,
//                 transition: 'width 0.4s'
//               }} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }