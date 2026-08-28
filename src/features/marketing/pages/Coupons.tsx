import MarketingPage from "./MarketingPage";

export default function Coupons() {
  return (
    <MarketingPage
      title="Coupons"
      subtitle="Manage promotional coupon codes and redemption performance"
      stats={[
        { label: "Active Coupons", value: "18", subtext: "Currently running", color: "#2563eb", bg: "#eff6ff", icon: "🎟" },
        { label: "Redemptions", value: "1,284", subtext: "This month", color: "#16a34a", bg: "#f0fdf4", icon: "✅" },
        { label: "Discount Given", value: "₹84K", subtext: "Coupon impact", color: "#d97706", bg: "#fffbeb", icon: "💸" },
        { label: "Conversion Lift", value: "+12%", subtext: "Compared to no coupon", color: "#9333ea", bg: "#faf5ff", icon: "📈" },
      ]}
      chartTitle="Coupon Usage Trend"
      chartBars={[24, 31, 45, 39, 52, 48]}
      chartLabels={["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]}
      sideTitle="Top Coupon Insights"
      sideItems={[
        { label: "Best Coupon", value: "SAVE20", color: "#2563eb" },
        { label: "Highest Redemption", value: "448 uses", color: "#16a34a" },
        { label: "Avg Order Lift", value: "₹320", color: "#d97706" },
        { label: "Expired Coupons", value: "6", color: "#dc2626" },
      ]}
      tableTitle="Top Performing Coupons"
      tableRows={[
        { name: "SAVE20", meta: "20% off on orders above ₹999", value: "448 uses", extra: "₹28K discount" },
        { name: "WELCOME10", meta: "New user acquisition coupon", value: "326 uses", extra: "High signup conversion" },
        { name: "FESTIVE50", meta: "Flat ₹50 seasonal campaign", value: "221 uses", extra: "Strong repeat sales" },
      ]}
    />
  );
}
