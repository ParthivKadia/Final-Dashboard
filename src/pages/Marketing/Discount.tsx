import MarketingPage from "./MarketingPage";

export default function Discount() {
  return (
    <MarketingPage
      title="Discount"
      subtitle="Manage automatic cart and category discounts with margin control"
      stats={[
        { label: "Active Rules", value: "12", subtext: "Auto-applied offers", color: "#2563eb", bg: "#eff6ff", icon: "🏷" },
        { label: "Orders Affected", value: "736", subtext: "This month", color: "#16a34a", bg: "#f0fdf4", icon: "🛒" },
        { label: "Revenue Influence", value: "₹1.46L", subtext: "Rule-driven sales", color: "#d97706", bg: "#fffbeb", icon: "📊" },
        { label: "Margin Impact", value: "-6.2%", subtext: "Overall discount pressure", color: "#dc2626", bg: "#fef2f2", icon: "📉" },
      ]}
      chartTitle="Discount Rule Impact"
      chartBars={[22, 29, 38, 41, 49, 44]}
      chartLabels={["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]}
      sideTitle="Rule Insights"
      sideItems={[
        { label: "Top Rule", value: "Buy 2 Get 10%", color: "#2563eb" },
        { label: "Highest Cart Lift", value: "+18%", color: "#16a34a" },
        { label: "Low Margin Rule", value: "Footwear 15%", color: "#dc2626" },
        { label: "Expiring Soon", value: "3 rules", color: "#d97706" },
      ]}
      tableTitle="Best Performing Rules"
      tableRows={[
        { name: "Buy 2 Get 10%", meta: "Category: Clothing", value: "248 orders", extra: "Strong AOV boost" },
        { name: "Flat ₹100 Off", meta: "Orders above ₹1499", value: "194 orders", extra: "Holiday driver" },
        { name: "Electronics 5% Off", meta: "Weekend rule", value: "128 orders", extra: "Good conversion" },
      ]}
    />
  );
}
