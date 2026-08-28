import AnalyticsDashboardPage from "./AnalyticsDashboardPage";

export default function TopProducts() {
  return (
    <AnalyticsDashboardPage
      title="Top Products"
      subtitle="See which products are driving your revenue and repeat sales"
      stats={[
        { label: "Top SKU Revenue", value: "₹3.23L", subtext: "Atomic Habits leads", color: "#2563eb", bg: "#eff6ff", icon: "🏆" },
        { label: "Best Seller", value: "720", subtext: "Units sold", color: "#16a34a", bg: "#f0fdf4", icon: "📚" },
        { label: "Fastest Growing", value: "Smart LED Bulb", subtext: "+26% this month", color: "#d97706", bg: "#fffbeb", icon: "💡" },
        { label: "Most Reviewed", value: "Earbuds Pro", subtext: "4.8 avg rating", color: "#9333ea", bg: "#faf5ff", icon: "⭐" },
      ]}
      chartTitle="Top Product Sales"
      chartBars={[68, 54, 46, 39, 34, 28]}
      chartLabels={["Book", "Bulb", "Earbuds", "Shirt", "Watch", "Bag"]}
      sideTitle="Category Leaders"
      sideItems={[
        { label: "Books", value: "₹3.72L", color: "#2563eb" },
        { label: "Electronics", value: "₹2.94L", color: "#16a34a" },
        { label: "Clothing", value: "₹1.81L", color: "#d97706" },
        { label: "Home & Kitchen", value: "₹1.16L", color: "#9333ea" },
      ]}
      tableTitle="Top Performing Products"
      tableRows={[
        { name: "Atomic Habits", meta: "Books • SKU AH-001", value: "720 sold", extra: "₹3.23L revenue" },
        { name: "Smart LED Bulb", meta: "Home • SKU SLB-010", value: "560 sold", extra: "₹2.24L revenue" },
        { name: "Clean Code Book", meta: "Books • SKU CCB-003", value: "430 sold", extra: "₹2.36L revenue" },
      ]}
    />
  );
}
