import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const unitData = [
  { month: "Sep", units: 950 },
  { month: "Oct", units: 1050 },
  { month: "Nov", units: 1100 },
  { month: "Dec", units: 1350 },
  { month: "Jan", units: 1250 },
  { month: "Feb", units: 1180 },
  { month: "Mar", units: 1380 },
];

const topCategories = [
  { name: "Electronics",   units: 243, barColor: "var(--brand-500)", width: "75%" },
  { name: "Clothing",      units: 189, barColor: "var(--brand-400)", width: "60%" },
  { name: "Home & Kitchen",units: 148, barColor: "var(--brand-300)", width: "47%" },
];

const ProductSalesChart: React.FC = () => {
  return (
    <div className="site-card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Units Sold chart ── */}
      <div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>Units Sold</h3>
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, marginBottom: 0 }}>Monthly trend · all categories</p>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 999,
            backgroundColor: "var(--status-growth-bg)", color: "var(--status-growth-text)",
          }}>
            +27.8% MoM
          </span>
        </div>

        <div style={{ height: 130 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={unitData}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  borderRadius: 8, fontSize: 12,
                  backgroundColor: "var(--card-bg)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-primary)",
                }}
                formatter={(value) => [`${value} units`, "Units"]}
              />
              <Line
                type="monotone" dataKey="units"
                stroke="var(--brand-500)" strokeWidth={2.5}
                dot={false} activeDot={{ r: 5, fill: "var(--brand-500)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Top Categories ── */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ color: "var(--text-brand)", fontSize: 14 }}>🏆</span>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>Top Categories · March</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {topCategories.map((cat) => (
            <div key={cat.name}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 13, color: "var(--text-primary)" }}>{cat.name}</span>
                <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{cat.units} units</span>
              </div>
              <div className="site-progress-track" style={{ height: 6, backgroundColor: "var(--surface-secondary)" }}>
                <div style={{ height: "100%", borderRadius: 999, backgroundColor: cat.barColor, width: cat.width }} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ProductSalesChart;