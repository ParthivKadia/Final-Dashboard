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
  <div
    className="flex flex-col justify-between min-h-[150px] sm:min-h-[180px] rounded-2xl p-4 sm:p-5 md:p-6"
    style={{
      backgroundColor: bgColor,
      boxShadow: "var(--shadow-md)",
    }}
  >
    <div className="flex items-start justify-between gap-3">
      <div
        className="flex items-center justify-center shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl text-lg sm:text-xl"
        style={{ backgroundColor: iconBg, color: "#ffffff" }}
      >
        {icon}
      </div>
      {badge && badgeType && (
        <span
          className="text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
          style={{
            backgroundColor: badgeBg[badgeType].bg,
            color: badgeBg[badgeType].color,
            backdropFilter: "blur(4px)",
          }}
        >
          {badge}
        </span>
      )}
    </div>

    <div className="mt-4 sm:mt-6">
      <p className="text-2xl sm:text-3xl font-bold leading-none m-0" style={{ color: "#ffffff" }}>
        {value}
      </p>
      <p className="text-base sm:text-lg font-semibold mt-2 mb-0" style={{ color: "#ffffff" }}>
        {label}
      </p>
      <p className="text-xs sm:text-sm mt-1 mb-0" style={{ color: "rgba(255,255,255,0.80)" }}>
        {subLabel}
      </p>
    </div>
  </div>
);

const StatCards: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 h-full">
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