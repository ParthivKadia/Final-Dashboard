import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  subLabel: string;
  value: string;
  badge?: string;
  badgeType?: "positive" | "negative" | "warning";
  bgColor: string;   // solid background colour — kept as prop since these are coloured hero cards
  iconBg: string;
}

const CartIcon = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: "#ffffff" }}>
    <path d="M7.5 7H18.8L17.4 14.8H9L7.5 7Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.5 7L6.9 4.9C6.75 4.35 6.24 4 5.67 4H4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="10.2" cy="18.2" r="1.2" fill="currentColor" />
    <circle cx="16.5" cy="18.2" r="1.2" fill="currentColor" />
  </svg>
);

// Badge colours — always on top of a solid coloured card so light tokens are fine
const badgeBg: Record<NonNullable<StatCardProps["badgeType"]>, { bg: string; color: string }> = {
  positive: { bg: "rgba(255,255,255,0.20)", color: "#ffffff" },
  negative: { bg: "rgba(255,255,255,0.20)", color: "#ffffff" },
  warning:  { bg: "rgba(255,255,255,0.20)", color: "#ffffff" },
};

const StatCard: React.FC<StatCardProps> = ({ icon, label, subLabel, value, badge, badgeType, bgColor, iconBg }) => (
  <div style={{
    backgroundColor: bgColor,
    borderRadius: 16, padding: "20px 24px",
    display: "flex", flexDirection: "column", justifyContent: "space-between",
    minHeight: 180,
    boxShadow: "var(--shadow-md)",
  }}>
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
      <div style={{
        backgroundColor: iconBg,
        width: 48, height: 48, borderRadius: 12,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, color: "#ffffff", flexShrink: 0,
      }}>
        {icon}
      </div>
      {badge && badgeType && (
        <span style={{
          fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 999,
          backgroundColor: badgeBg[badgeType].bg, color: badgeBg[badgeType].color,
          backdropFilter: "blur(4px)",
        }}>
          {badge}
        </span>
      )}
    </div>

    <div style={{ marginTop: 24 }}>
      <p style={{ fontSize: 32, fontWeight: 700, lineHeight: 1, color: "#ffffff", margin: 0 }}>{value}</p>
      <p style={{ fontSize: 18, fontWeight: 600, color: "#ffffff", margin: "10px 0 0" }}>{label}</p>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.80)", margin: "4px 0 0" }}>{subLabel}</p>
    </div>
  </div>
);

const StatCards: React.FC = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
    <StatCard
      icon="₹"
      label="Total Revenue"
      subLabel="This month"
      value="₹4.2L"
      badge="+18%"
      badgeType="positive"
      bgColor="var(--brand-700)"
      iconBg="rgba(255,255,255,0.15)"
    />
    <StatCard
      icon={<CartIcon />}
      label="Total Orders"
      subLabel="This month"
      value="1,284"
      badge="+11%"
      badgeType="positive"
      bgColor="#10b981"
      iconBg="rgba(255,255,255,0.15)"
    />
    <StatCard
      icon="⚠️"
      label="Low Stock"
      subLabel="Needs restock"
      value="9"
      badge="-3 SKUs"
      badgeType="warning"
      bgColor="#f59e0b"
      iconBg="rgba(255,255,255,0.15)"
    />
  </div>
);

export default StatCards;