import React, { useState } from "react";

interface Order {
  id: string;
  product: string;
  amount: string;
  status: "Delivered" | "Shipped" | "Processing" | "Cancelled";
}

const orders: Order[] = [
  { id: "#ORD-8831", product: "Wireless Earbuds Pro",      amount: "₹4,999", status: "Delivered" },
  { id: "#ORD-8829", product: "Cotton Kurta Set x 2",      amount: "₹2,598", status: "Shipped" },
  { id: "#ORD-8827", product: "Bamboo Cutting Board",      amount: "₹899",   status: "Delivered" },
  { id: "#ORD-8824", product: "Steel Water Bottle 1L x 3", amount: "₹1,947", status: "Processing" },
  { id: "#ORD-8821", product: "Yoga Mat Premium",          amount: "₹2,199", status: "Cancelled" },
  { id: "#ORD-8818", product: "Phone Stand Foldable",      amount: "₹399",   status: "Delivered" },
  { id: "#ORD-8815", product: "Yoga Mat Premium x 2",      amount: "₹4,398", status: "Cancelled" },
];

// Maps order status → site-theme CSS variable colours
const statusDot: Record<Order["status"], string> = {
  Delivered:  "var(--status-active-dot)",
  Shipped:    "var(--brand-500)",
  Processing: "var(--status-low-dot)",
  Cancelled:  "var(--status-out-dot)",
};
const statusText: Record<Order["status"], string> = {
  Delivered:  "var(--status-active-text)",
  Shipped:    "var(--text-brand)",
  Processing: "var(--status-low-text)",
  Cancelled:  "var(--status-out-text)",
};

const tabs = ["All 7", "Delivered 3", "Shipped 1", "Cancelled 2"] as const;

const RecentOrdersCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const delivered = orders.filter((o) => o.status === "Delivered").length;
  const inTransit  = orders.filter((o) => o.status === "Shipped" || o.status === "Processing").length;
  const cancelled  = orders.filter((o) => o.status === "Cancelled").length;

  return (
    <div className="site-card" style={{ padding: 20 }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "var(--text-brand)" }}>📋</span>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>Order History</h3>
        </div>
        <button style={{ color: "var(--text-brand)", fontSize: 13, fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}>
          View all →
        </button>
      </div>

      {/* ── Filter tabs ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            style={{
              fontSize: 11, fontWeight: 500,
              padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer",
              backgroundColor: activeTab === i ? "var(--brand-50)"        : "transparent",
              color:           activeTab === i ? "var(--text-brand)"      : "var(--text-secondary)",
              transition: "background-color 0.15s, color 0.15s",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Orders list ── */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {orders.map((order, idx) => (
          <div
            key={order.id}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: idx < orders.length - 1 ? "1px solid var(--border-subtle)" : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", flexShrink: 0, backgroundColor: statusDot[order.status], display: "inline-block" }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", margin: 0, lineHeight: 1.3 }}>{order.product}</p>
                <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "2px 0 0" }}>{order.id}</p>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>{order.amount}</p>
              <p style={{ fontSize: 11, fontWeight: 500, color: statusText[order.status], margin: "2px 0 0" }}>{order.status}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Summary footer ── */}
      <div style={{
        marginTop: 12, paddingTop: 12,
        borderTop: "1px solid var(--border-subtle)",
        display: "flex", justifyContent: "space-between",
        fontSize: 11, color: "var(--text-secondary)",
      }}>
        <span><span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{delivered}</span> delivered</span>
        <span><span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{inTransit}</span> in transit</span>
        <span><span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{cancelled}</span> cancelled</span>
      </div>

    </div>
  );
};

export default RecentOrdersCard;