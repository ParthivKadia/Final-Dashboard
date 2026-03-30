import MarketingPage from "./MarketingPage";

export default function Campaigns() {
  return (
    <MarketingPage
      title="Campaigns"
      subtitle="Track seasonal, social, and conversion campaigns across channels"
      stats={[
        { label: "Live Campaigns", value: "9", subtext: "Across all channels", color: "#2563eb", bg: "#eff6ff", icon: "📣" },
        { label: "Reach", value: "84K", subtext: "Users reached", color: "#16a34a", bg: "#f0fdf4", icon: "🌍" },
        { label: "CTR", value: "4.8%", subtext: "Average click-through", color: "#d97706", bg: "#fffbeb", icon: "🖱" },
        { label: "Revenue Driven", value: "₹2.18L", subtext: "Attributed sales", color: "#9333ea", bg: "#faf5ff", icon: "💰" },
      ]}
      chartTitle="Campaign Performance"
      chartBars={[28, 44, 53, 47, 61, 56]}
      chartLabels={["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]}
      sideTitle="Campaign Insights"
      sideItems={[
        { label: "Top Channel", value: "Instagram", color: "#2563eb" },
        { label: "Best CTR", value: "6.2%", color: "#16a34a" },
        { label: "Lowest CPC", value: "₹4.8", color: "#d97706" },
        { label: "ROAS", value: "4.3x", color: "#9333ea" },
      ]}
      tableTitle="Top Campaigns"
      tableRows={[
        { name: "Spring Sale", meta: "Instagram + email", value: "₹82K", extra: "5.6x ROAS" },
        { name: "New Arrival Push", meta: "Meta ads", value: "₹54K", extra: "4.8% CTR" },
        { name: "Festive Launch", meta: "Email + banner", value: "₹41K", extra: "Strong repeat buyers" },
      ]}
    />
  );
}
