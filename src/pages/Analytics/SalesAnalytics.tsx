import AnalyticsDashboardPage from "./AnalyticsDashboardPage";

export default function SalesAnalytics() {
  return (
    <AnalyticsDashboardPage
      title="Sales Analytics"
      subtitle="Track order volume, revenue growth, and sales performance"
      stats={[
        { label: "Total Sales", value: "₹8.42L", subtext: "+18.4% from last month", color: "#2563eb", bg: "#eff6ff", icon: "💰" },
        { label: "Orders", value: "1,284", subtext: "+96 new orders", color: "#16a34a", bg: "#f0fdf4", icon: "📦" },
        { label: "Avg Order Value", value: "₹1,860", subtext: "Per completed order", color: "#d97706", bg: "#fffbeb", icon: "🧾" },
        { label: "Conversion", value: "4.8%", subtext: "Store visit to order", color: "#9333ea", bg: "#faf5ff", icon: "📈" },
      ]}
      chartTitle="Sales Trend"
      chartBars={[42, 58, 64, 48, 74, 68]}
      chartLabels={["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]}
      sideTitle="Sales Summary"
      sideItems={[
        { label: "Online Orders", value: "892", color: "#2563eb" },
        { label: "COD Orders", value: "238", color: "#16a34a" },
        { label: "Cancelled", value: "47", color: "#dc2626" },
        { label: "Returned", value: "19", color: "#d97706" },
      ]}
      tableTitle="Best Sales Channels"
      tableRows={[
        { name: "Website", meta: "Direct store purchases", value: "₹4.12L", extra: "49% of revenue" },
        { name: "Instagram", meta: "Social campaign sales", value: "₹2.06L", extra: "24% of revenue" },
        { name: "Marketplace", meta: "Third-party orders", value: "₹1.71L", extra: "20% of revenue" },
      ]}
    />
  );
}
