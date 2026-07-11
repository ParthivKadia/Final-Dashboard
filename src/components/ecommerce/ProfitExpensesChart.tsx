import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Aug", revenue: 210000, expenses: 110000, netProfit: 100000 },
  { month: "Sep", revenue: 230000, expenses: 130000, netProfit: 100000 },
  { month: "Oct", revenue: 200000, expenses: 120000, netProfit: 80000 },
  { month: "Nov", revenue: 260000, expenses: 140000, netProfit: 120000 },
  { month: "Dec", revenue: 320000, expenses: 160000, netProfit: 160000 },
  { month: "Jan", revenue: 270000, expenses: 150000, netProfit: 120000 },
  { month: "Feb", revenue: 240000, expenses: 130000, netProfit: 110000 },
  { month: "Mar", revenue: 288000, expenses: 144000, netProfit: 101000 },
];

const plTable = [
  { item: "Revenue",      total: "₹19.37L", mar: "₹2.88L", mom: "+23.1%", momPositive: true },
  { item: "Cost of Goods", total: "₹9.69L", mar: "₹1.44L", mom: "—",      momPositive: null },
  { item: "Gross Profit",  total: "₹9.69L", mar: "₹1.44L", mom: "—",      momPositive: null, highlight: true },
  { item: "Operating Exp", total: "₹2.91L", mar: "₹43.2K", mom: "—",      momPositive: null },
  { item: "Net Profit",    total: "₹6.78L", mar: "₹1.01L", mom: "+23.1%", momPositive: true, highlight: true },
];

const formatYAxis = (value: number | string) => {
  const num = typeof value === "number" ? value : Number(value);
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000)   return `₹${(num / 1000).toFixed(0)}K`;
  return `₹${num}`;
};

const ProfitExpensesChart: React.FC = () => {
  return (
    <div className="site-card" style={{ padding: 20 }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>Profit & Loss</h3>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, marginBottom: 0 }}>
            Aug 2025 - Mar 2026 · Revenue vs Total Expenses
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 11, color: "var(--text-secondary)", flexWrap: "wrap" }}>
          {[
            { color: "var(--brand-500)",          label: "Revenue" },
            { color: "var(--status-out-dot)",      label: "Expenses" },
            { color: "var(--status-active-dot)",   label: "Net Profit" },
          ].map(({ color, label }) => (
            <span key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: color, display: "inline-block" }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Bar Chart ── */}
      <div style={{ marginTop: 16, height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={10} barGap={2}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
            <YAxis tickFormatter={formatYAxis} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "var(--text-muted)" }} width={55} />
            <Tooltip
              formatter={(value: any) => formatYAxis(value)}
              contentStyle={{
                borderRadius: 8, fontSize: 12,
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-primary)",
              }}
            />
            <Bar dataKey="revenue"   fill="var(--brand-500)"        radius={[3, 3, 0, 0]} />
            <Bar dataKey="expenses"  fill="var(--status-out-dot)"   radius={[3, 3, 0, 0]} />
            <Bar dataKey="netProfit" fill="var(--status-active-dot)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── P&L Table ── */}
      <div style={{ marginTop: 16, border: "1px solid var(--border-subtle)", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "var(--surface-secondary)" }}>
              {["P&L Item", "8-Month Total", "Mar (Current)", "MoM"].map((h, i) => (
                <th key={h} style={{
                  padding: "10px 16px", fontWeight: 500, fontSize: 11, color: "var(--text-secondary)",
                  textAlign: i === 0 ? "left" : "right", whiteSpace: "nowrap",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plTable.map((row) => (
              <tr key={row.item} style={{
                borderTop: "1px solid var(--border-subtle)",
                fontWeight: row.highlight ? 600 : 400,
              }}>
                <td style={{ padding: "10px 16px", color: "var(--text-primary)" }}>{row.item}</td>
                <td style={{ padding: "10px 16px", textAlign: "right", color: "var(--text-secondary)" }}>{row.total}</td>
                <td style={{ padding: "10px 16px", textAlign: "right", color: row.highlight ? "var(--text-brand)" : "var(--text-secondary)" }}>
                  {row.mar}
                </td>
                <td style={{ padding: "10px 16px", textAlign: "right" }}>
                  {row.mom === "—" ? (
                    <span style={{ color: "var(--text-muted)" }}>—</span>
                  ) : (
                    <span style={{ fontSize: 11, fontWeight: 600, color: row.momPositive ? "var(--status-active-text)" : "var(--status-out-text)" }}>
                      {row.momPositive ? "↗ " : "↘ "}{row.mom}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div style={{
          padding: "10px 16px",
          backgroundColor: "var(--surface-secondary)",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          fontSize: 11, color: "var(--text-secondary)", flexWrap: "wrap", gap: 8,
        }}>
          <span>
            Gross Margin: <span style={{ color: "var(--text-brand)", fontWeight: 600 }}>50.0%</span>
            {" · "}Net Margin: <span style={{ color: "var(--status-active-text)", fontWeight: 600 }}>35.0%</span>
          </span>
          <button className="site-btn site-btn-primary site-btn-sm">Export Report</button>
        </div>
      </div>

    </div>
  );
};

export default ProfitExpensesChart;