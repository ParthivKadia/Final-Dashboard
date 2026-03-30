import StorePage from "./StorePage";

export default function Shipping() {
  return (
    <StorePage
      title="Shipping"
      subtitle="Configure shipping performance, courier settings, and delivery workflow"
      stats={[
        { label: "Avg Delivery Time", value: "3.2 days", subtext: "Across all orders", color: "#2563eb", bg: "#eff6ff", icon: "🚚" },
        { label: "On-Time Rate", value: "94%", subtext: "Delivered within SLA", color: "#16a34a", bg: "#f0fdf4", icon: "✅" },
        { label: "Pending Shipments", value: "18", subtext: "Awaiting dispatch", color: "#d97706", bg: "#fffbeb", icon: "📦" },
        { label: "Courier Partners", value: "4", subtext: "Integrated carriers", color: "#9333ea", bg: "#faf5ff", icon: "🤝" },
      ]}
      chartTitle="Shipping Trend"
      chartBars={[32, 36, 42, 48, 52, 58]}
      chartLabels={["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]}
      sideTitle="Shipping Insights"
      sideItems={[
        { label: "Top Courier", value: "Delhivery", color: "#2563eb" },
        { label: "Fastest Region", value: "Mumbai", color: "#16a34a" },
        { label: "Delayed Orders", value: "6", color: "#dc2626" },
        { label: "Return Shipments", value: "11", color: "#d97706" },
      ]}
      tableTitle="Courier Performance"
      tableRows={[
        { name: "Delhivery", meta: "Primary courier", value: "96% on time", extra: "Best coverage" },
        { name: "Blue Dart", meta: "Premium express", value: "2.1 days", extra: "Fastest average" },
        { name: "XpressBees", meta: "Economy shipping", value: "91% on time", extra: "Cost efficient" },
      ]}
    />
  );
}
