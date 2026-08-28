import StorePage from "./StorePage";

export default function Payments() {
  return (
    <StorePage
      title="Payments"
      subtitle="Monitor payment methods, settlements, and transaction reliability"
      stats={[
        { label: "Settlements", value: "₹5.82L", subtext: "Received this month", color: "#2563eb", bg: "#eff6ff", icon: "💳" },
        { label: "Success Rate", value: "97.8%", subtext: "Successful transactions", color: "#16a34a", bg: "#f0fdf4", icon: "✅" },
        { label: "COD Orders", value: "238", subtext: "Cash on delivery", color: "#d97706", bg: "#fffbeb", icon: "💵" },
        { label: "Refunds", value: "₹38K", subtext: "Processed refunds", color: "#dc2626", bg: "#fef2f2", icon: "↩" },
      ]}
      chartTitle="Payment Collection Trend"
      chartBars={[26, 33, 41, 45, 56, 61]}
      chartLabels={["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]}
      sideTitle="Payment Insights"
      sideItems={[
        { label: "Top Method", value: "UPI", color: "#2563eb" },
        { label: "Settlement Cycle", value: "T+2 days", color: "#16a34a" },
        { label: "Failed Transactions", value: "2.2%", color: "#dc2626" },
        { label: "Refund Count", value: "19", color: "#d97706" },
      ]}
      tableTitle="Payment Methods"
      tableRows={[
        { name: "UPI", meta: "Most preferred method", value: "48%", extra: "Highest success rate" },
        { name: "Cards", meta: "Credit/debit", value: "31%", extra: "Higher ticket size" },
        { name: "Cash on Delivery", meta: "Offline collection", value: "21%", extra: "Rural market demand" },
      ]}
    />
  );
}
