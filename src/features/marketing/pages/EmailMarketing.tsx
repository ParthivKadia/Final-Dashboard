import MarketingPage from "./MarketingPage";

export default function EmailMarketing() {
  return (
    <MarketingPage
      title="Email Marketing"
      subtitle="Monitor subscriber growth, open rates, click rates, and campaign sales"
      stats={[
        { label: "Subscribers", value: "12.8K", subtext: "+420 this month", color: "#2563eb", bg: "#eff6ff", icon: "📧" },
        { label: "Open Rate", value: "32.4%", subtext: "Above benchmark", color: "#16a34a", bg: "#f0fdf4", icon: "👀" },
        { label: "Click Rate", value: "5.9%", subtext: "Campaign average", color: "#d97706", bg: "#fffbeb", icon: "🖱" },
        { label: "Email Revenue", value: "₹96K", subtext: "Attributed sales", color: "#9333ea", bg: "#faf5ff", icon: "💰" },
      ]}
      chartTitle="Email Performance"
      chartBars={[18, 26, 31, 29, 36, 41]}
      chartLabels={["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]}
      sideTitle="Email Insights"
      sideItems={[
        { label: "Best Subject", value: "Weekend Flash Sale", color: "#2563eb" },
        { label: "Top Segment", value: "Repeat Customers", color: "#16a34a" },
        { label: "Best Open Rate", value: "38.2%", color: "#d97706" },
        { label: "Unsubscribe Rate", value: "0.8%", color: "#dc2626" },
      ]}
      tableTitle="Top Email Campaigns"
      tableRows={[
        { name: "Weekend Flash Sale", meta: "Promotional blast", value: "₹34K", extra: "38.2% open rate" },
        { name: "Back In Stock Alert", meta: "Triggered flow", value: "₹22K", extra: "High CTR" },
        { name: "New Arrivals", meta: "Catalog campaign", value: "₹18K", extra: "Good repeat orders" },
      ]}
    />
  );
}
