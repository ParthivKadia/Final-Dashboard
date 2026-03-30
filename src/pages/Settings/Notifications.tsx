import SettingsPage from "./SettingsPage";

export default function Notifications() {
  return (
    <SettingsPage
      title="Notifications"
      subtitle="Control alerts for orders, payouts, reviews, and store activity"
      stats={[
        { label: "Email Alerts", value: "12", subtext: "Active notification rules", color: "#2563eb", bg: "#eff6ff", icon: "📧" },
        { label: "Push Alerts", value: "8", subtext: "Enabled on this device", color: "#16a34a", bg: "#f0fdf4", icon: "🔔" },
        { label: "Unread Alerts", value: "5", subtext: "Need attention", color: "#d97706", bg: "#fffbeb", icon: "📩" },
        { label: "Critical Alerts", value: "2", subtext: "Security + payouts", color: "#dc2626", bg: "#fef2f2", icon: "⚠️" },
      ]}
      sideTitle="Notification Channels"
      sideItems={[
        { label: "Order Updates", value: "On", color: "#16a34a" },
        { label: "Payment Alerts", value: "On", color: "#2563eb" },
        { label: "Marketing Alerts", value: "Off", color: "#dc2626" },
        { label: "Review Alerts", value: "On", color: "#d97706" },
      ]}
      tableTitle="Recent Notification Rules"
      tableRows={[
        { name: "New Order Alert", meta: "Instant email + push", value: "Enabled", extra: "High priority" },
        { name: "Refund Request", meta: "Email notification", value: "Enabled", extra: "Support workflow" },
        { name: "Campaign Summary", meta: "Daily digest", value: "Disabled", extra: "Optional" },
      ]}
    />
  );
}
