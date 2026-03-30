import AnalyticsDashboardPage from "./AnalyticsDashboardPage";

export default function RevenueReport() {
  return (
    <AnalyticsDashboardPage
      title="Revenue Report"
      subtitle="Monitor profit, costs, and monthly revenue performance"
      stats={[
        { label: "Gross Revenue", value: "₹12.4L", subtext: "Before deductions", color: "#2563eb", bg: "#eff6ff", icon: "💵" },
        { label: "Net Revenue", value: "₹8.42L", subtext: "After costs", color: "#16a34a", bg: "#f0fdf4", icon: "💰" },
        { label: "Expenses", value: "₹2.91L", subtext: "Shipping + ads + ops", color: "#dc2626", bg: "#fef2f2", icon: "📉" },
        { label: "Profit Margin", value: "35%", subtext: "+4.2% from last month", color: "#9333ea", bg: "#faf5ff", icon: "📊" },
      ]}
      chartTitle="Revenue Trend"
      chartBars={[48, 56, 62, 58, 76, 71]}
      chartLabels={["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]}
      sideTitle="Revenue Split"
      sideItems={[
        { label: "Product Revenue", value: "₹10.1L", color: "#2563eb" },
        { label: "Shipping Revenue", value: "₹1.1L", color: "#16a34a" },
        { label: "Refunds", value: "₹0.6L", color: "#dc2626" },
        { label: "Discount Impact", value: "₹0.4L", color: "#d97706" },
      ]}
      tableTitle="Monthly Revenue Breakdown"
      tableRows={[
        { name: "January", meta: "Strong repeat customer growth", value: "₹1.92L", extra: "31% margin" },
        { name: "February", meta: "High campaign conversions", value: "₹2.41L", extra: "36% margin" },
        { name: "March", meta: "Best month so far", value: "₹2.88L", extra: "39% margin" },
      ]}
    />
  );
}
