import React from "react";

interface StockItem {
  name: string;
  category: string;
  left: number | null;
  min: number;
  outOfStock?: boolean;
  barPercent: number;
}

const stockItems: StockItem[] = [
  { name: "Wireless Earbuds Pro",    category: "Electronics",   left: 3,    min: 10, barPercent: 30 },
  { name: "Cotton Kurta — Blue XL",  category: "Clothing",      left: null, min: 15, outOfStock: true, barPercent: 0 },
  { name: "Steel Bottle 1L",         category: "Home & Kitchen", left: 7,   min: 20, barPercent: 35 },
  { name: "Yoga Mat Premium",        category: "Sports",         left: 2,   min: 10, barPercent: 20 },
  { name: "Phone Stand Foldable",    category: "Accessories",    left: null, min: 25, outOfStock: true, barPercent: 0 },
];

const LowStockAlerts: React.FC = () => {
  const outCount = stockItems.filter((i) => i.outOfStock).length;
  const lowCount = stockItems.filter((i) => !i.outOfStock && i.left !== null).length;

  return (
    <div className="site-card" style={{ padding: 20 }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ color: "var(--featured-color)" }}>⚠️</span>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>Low Stock Alerts</h3>
          <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999, backgroundColor: "var(--status-out-bg)", color: "var(--status-out-text)" }}>
            {outCount} out
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999, backgroundColor: "var(--status-low-bg)", color: "var(--status-low-text)" }}>
            {lowCount} low
          </span>
        </div>
        <button style={{ color: "var(--text-brand)", fontSize: 13, fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}>
          Manage →
        </button>
      </div>

      {/* ── Stock items ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {stockItems.map((item) => (
          <div key={item.name}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                  backgroundColor: item.outOfStock ? "var(--status-out-dot)" : "var(--status-low-dot)",
                  display: "inline-block",
                }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>{item.name}</p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "1px 0 0" }}>{item.category}</p>
                </div>
              </div>
              {item.outOfStock ? (
                <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999, backgroundColor: "var(--status-out-bg)", color: "var(--status-out-text)" }}>
                  Out of stock
                </span>
              ) : (
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--status-low-text)" }}>
                  {item.left} left
                </span>
              )}
            </div>

            {/* Progress bar */}
            <div className="site-progress-track" style={{ height: 6 }}>
              <div style={{
                height: "100%", borderRadius: 999,
                backgroundColor: item.outOfStock ? "var(--status-out-dot)" : "var(--status-low-dot)",
                width: `${item.barPercent}%`,
              }} />
            </div>
            <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "right", margin: "3px 0 0" }}>min {item.min}</p>
          </div>
        ))}
      </div>

      {/* ── CTA button ── */}
      <button
        style={{
          marginTop: 20, width: "100%",
          backgroundColor: "var(--featured-color)",
          color: "#ffffff",
          fontSize: 13, fontWeight: 600,
          padding: "10px 0", borderRadius: 12, border: "none", cursor: "pointer",
          transition: "opacity 0.15s",
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >
        Restock All Low Items →
      </button>

    </div>
  );
};

export default LowStockAlerts;