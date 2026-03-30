import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  subLabel: string;
  value: string;
  badge?: string;
  badgeType?: "positive" | "negative" | "warning";
  bgColor: string;
  iconBg: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  subLabel,
  value,
  badge,
  badgeType,
  bgColor,
  iconBg,
}) => {
  const badgeColors: Record<NonNullable<StatCardProps["badgeType"]>, string> = {
    positive: "bg-green-100 text-green-700",
    negative: "bg-red-100 text-red-700",
    warning: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div
      className={`${bgColor} rounded-2xl p-6 text-white flex flex-col justify-between min-h-[200px] shadow-sm`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`${iconBg} w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0`}
        >
          {icon}
        </div>

        {badge && badgeType && (
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${badgeColors[badgeType]}`}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="mt-6">
        <p className="text-[2rem] font-bold leading-none">{value}</p>
        <p className="text-lg font-semibold mt-4">{label}</p>
        <p className="text-sm text-white/80 mt-1">{subLabel}</p>
      </div>
    </div>
  );
};

const StatCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatCard
        icon="₹"
        label="Total Revenue"
        subLabel="This month"
        value="₹4.2L"
        badge="+18%"
        badgeType="positive"
        bgColor="bg-blue-500"
        iconBg="bg-white/10"
      />

      <StatCard
        icon="🛒"
        label="Total Orders"
        subLabel="This month"
        value="1,284"
        badge="+11%"
        badgeType="positive"
        bgColor="bg-emerald-500"
        iconBg="bg-white/10"
      />

      <StatCard
        icon="⚠️"
        label="Low Stock"
        subLabel="Needs restock"
        value="9"
        badge="-3 SKUs"
        badgeType="warning"
        bgColor="bg-amber-500"
        iconBg="bg-white/10"
      />
    </div>
  );
};

export default StatCards;
