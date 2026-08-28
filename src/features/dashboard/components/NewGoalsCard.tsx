import React from "react";

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const PERCENT = 84;
const DASH = (PERCENT / 100) * CIRCUMFERENCE;

const NewGoalsCard: React.FC = () => {
  return (
    <div className="site-card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Monthly Target ── */}
      <div>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 16, marginTop: 0 }}>
          Monthly Target
        </h3>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

          {/* Donut */}
          <div style={{ position: "relative", width: 144, height: 144 }}>
            <svg viewBox="0 0 130 130" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
              <circle cx="65" cy="65" r={RADIUS} fill="none" stroke="var(--surface-secondary)" strokeWidth="10" />
              <circle
                cx="65" cy="65" r={RADIUS} fill="none"
                stroke="var(--brand-600)" strokeWidth="10"
                strokeDasharray={`${DASH} ${CIRCUMFERENCE}`}
                strokeLinecap="round"
              />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>84%</span>
              <span style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>achieved</span>
            </div>
          </div>

          {/* Progress details */}
          <div style={{ width: "100%", marginTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
              <span style={{ color: "var(--text-secondary)" }}>Achieved</span>
              <span style={{ color: "var(--text-secondary)" }}>Target</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              <span style={{ color: "var(--text-primary)" }}>₹4,18,240</span>
              <span style={{ color: "var(--text-primary)" }}>₹5,00,000</span>
            </div>
            <div className="site-progress-track">
              <div className="site-progress-bar" style={{ width: "84%" }} />
            </div>
            <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginTop: 6, marginBottom: 0 }}>
              ₹81.8K remaining
            </p>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <hr className="site-divider" />

      {/* ── Monthly Revenue ── */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
          <span style={{ color: "var(--text-muted)", fontSize: 13 }}>₹</span>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>Monthly Revenue</h4>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "This Month", sub: "84% of target", value: "₹4.18L", color: "var(--text-brand)" },
            { label: "Last Month",  sub: "-7% vs target", value: "₹3.90L", color: "var(--text-secondary)" },
            { label: "Best Month",  sub: "Dec 2025",      value: "₹5.24L", color: "var(--status-active-text)" },
          ].map(({ label, sub, value, color }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>{label}</p>
                <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "2px 0 0" }}>{sub}</p>
              </div>
              <span style={{ fontWeight: 600, fontSize: 13, color }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Best Seller banner */}
        <div style={{
          marginTop: 16,
          backgroundColor: "var(--status-growth-bg)",
          border: "1px solid var(--success-border)",
          borderRadius: 12,
          padding: "12px 14px",
        }}>
          <p style={{ fontSize: 11, color: "var(--success-text)", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
            <span>↗</span> Best Seller · March
          </p>
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", margin: "4px 0 0" }}>Wireless Earbuds Pro</p>
          <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: "2px 0 0" }}>143 units · ₹71,357 revenue</p>
        </div>
      </div>

    </div>
  );
};

export default NewGoalsCard;