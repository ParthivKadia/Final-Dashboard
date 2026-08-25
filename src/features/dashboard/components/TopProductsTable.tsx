import React from "react";

interface Product {
  rank: number;
  name: string;
  starred?: boolean;
  category: string;
  price: string;
  unitsSold: number;
  revenue: string;
  grossMargin: number;
  growth: number;
  stock: "In Stock" | "Low Stock" | "Out of Stock";
  stockLeft?: number;
}

const products: Product[] = [
  { rank: 1, name: "Wireless Earbuds Pro",  starred: true,  category: "Electronics",   price: "₹4,999", unitsSold: 143, revenue: "₹7.15L", grossMargin: 60, growth: 34,  stock: "In Stock",    stockLeft: 28 },
  { rank: 2, name: "Cotton Kurta Set",                      category: "Clothing",      price: "₹1,299", unitsSold: 298, revenue: "₹3.87L", grossMargin: 60, growth: 12,  stock: "Low Stock",   stockLeft: 7 },
  { rank: 3, name: "Steel Water Bottle 1L", starred: true,  category: "Home & Kitchen",price: "₹649",   unitsSold: 512, revenue: "₹3.32L", grossMargin: 70, growth: 28,  stock: "In Stock",    stockLeft: 84 },
  { rank: 4, name: "Yoga Mat Premium",                      category: "Sports",        price: "₹2,199", unitsSold: 89,  revenue: "₹1.96L", grossMargin: 60, growth: -8,  stock: "Out of Stock" },
  { rank: 5, name: "Phone Stand Foldable",                  category: "Accessories",   price: "₹399",   unitsSold: 421, revenue: "₹1.68L", grossMargin: 70, growth: 5,   stock: "Out of Stock" },
  { rank: 6, name: "Bamboo Cutting Board",                  category: "Home & Kitchen",price: "₹899",   unitsSold: 167, revenue: "₹1.50L", grossMargin: 60, growth: 19,  stock: "In Stock",    stockLeft: 43 },
];

const stockStyle = (stock: Product["stock"]): { bg: string; color: string; label: string } => {
  switch (stock) {
    case "In Stock":    return { bg: "var(--status-active-bg)", color: "var(--status-active-text)", label: "In Stock" };
    case "Low Stock":   return { bg: "var(--status-low-bg)",    color: "var(--status-low-text)",    label: "Low Stock" };
    case "Out of Stock":return { bg: "var(--status-out-bg)",    color: "var(--status-out-text)",    label: "Out of Stock" };
  }
};

const TopProductsTable: React.FC = () => {
  return (
    <div className="site-card" style={{ padding: 20 }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4, flexWrap: "wrap", gap: 8 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>Top Selling Products</h3>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, marginBottom: 0 }}>
            March 2026 · 1,630 units sold · ₹19.48L revenue
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>6 products shown</span>
          <button style={{ color: "var(--text-brand)", fontSize: 13, fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}>
            View all →
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ marginTop: 16, overflowX: "auto" }}>
        <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse", minWidth: 780 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              {["#", "Product", "Category", "Price", "Units Sold", "Revenue", "Gross Margin", "Growth", "Stock"].map((h, i) => (
                <th key={h} style={{
                  padding: "8px 12px 8px 0", fontSize: 11, fontWeight: 500,
                  color: "var(--text-muted)", textAlign: i < 3 ? "left" : "right",
                  whiteSpace: "nowrap",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const stock = stockStyle(p.stock);
              return (
                <tr
                  key={p.rank}
                  style={{ borderBottom: "1px solid var(--border-subtle)", transition: "background-color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--surface-secondary)")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td style={{ padding: "12px 12px 12px 0", color: "var(--text-muted)", fontWeight: 500 }}>#{p.rank}</td>
                  <td style={{ padding: "12px 12px 12px 0", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap" }}>
                    {p.name}
                    {p.starred && <span style={{ color: "var(--featured-color)", marginLeft: 4 }}>★</span>}
                  </td>
                  <td style={{ padding: "12px 12px 12px 0" }}>
                    <span style={{
                      fontSize: 11, padding: "4px 8px", borderRadius: 8,
                      backgroundColor: "var(--surface-secondary)", color: "var(--text-secondary)",
                    }}>
                      {p.category}
                    </span>
                  </td>
                  <td style={{ padding: "12px 12px 12px 0", textAlign: "right", color: "var(--text-secondary)" }}>{p.price}</td>

                  {/* Units sold + mini bar */}
                  <td style={{ padding: "12px 12px 12px 0", textAlign: "right" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                      <div style={{ width: 48, height: 6, borderRadius: 999, backgroundColor: "var(--surface-secondary)", overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 999, backgroundColor: "var(--brand-400)", width: `${Math.min(100, (p.unitsSold / 520) * 100)}%` }} />
                      </div>
                      <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>{p.unitsSold}</span>
                    </div>
                  </td>

                  <td style={{ padding: "12px 12px 12px 0", textAlign: "right", fontWeight: 600, color: "var(--text-primary)" }}>{p.revenue}</td>

                  {/* Gross margin + mini bar */}
                  <td style={{ padding: "12px 12px 12px 0", textAlign: "right" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                      <div style={{ width: 48, height: 6, borderRadius: 999, backgroundColor: "var(--surface-secondary)", overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 999, backgroundColor: "var(--status-active-dot)", width: `${p.grossMargin}%` }} />
                      </div>
                      <span style={{ color: "var(--text-primary)" }}>{p.grossMargin}%</span>
                    </div>
                  </td>

                  {/* Growth */}
                  <td style={{ padding: "12px 12px 12px 0", textAlign: "right" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: p.growth >= 0 ? "var(--status-active-text)" : "var(--status-out-text)" }}>
                      {p.growth >= 0 ? "↗" : "↘"} {Math.abs(p.growth)}%
                    </span>
                  </td>

                  {/* Stock badge */}
                  <td style={{ padding: "12px 0", textAlign: "right" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 8px", borderRadius: 8, backgroundColor: stock.bg, color: stock.color, whiteSpace: "nowrap" }}>
                      {stock.label}{p.stockLeft ? ` · ${p.stockLeft} left` : ""}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: "1px solid var(--border-subtle)", backgroundColor: "var(--surface-secondary)" }}>
              <td colSpan={4} style={{ padding: "10px 0", fontSize: 11, fontWeight: 600, color: "var(--text-secondary)" }}>Totals</td>
              <td style={{ padding: "10px 12px 10px 0", textAlign: "right", fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>1,630</td>
              <td style={{ padding: "10px 12px 10px 0", textAlign: "right", fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>₹19.48L</td>
              <td style={{ padding: "10px 12px 10px 0", textAlign: "right", fontSize: 11, color: "var(--text-secondary)" }}>
                Avg margin: <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>63.3%</span>
              </td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>

    </div>
  );
};

export default TopProductsTable;