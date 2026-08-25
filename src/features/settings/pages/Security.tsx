import SettingsPage from "./SettingsPage";

export default function Security() {
  return (
    <SettingsPage
      title="Security"
      subtitle="Protect your store with password controls, login monitoring, and verification"
      stats={[
        { label: "2FA Status", value: "Enabled", subtext: "Extra sign-in protection", color: "#16a34a", bg: "#f0fdf4", icon: "🔒" },
        { label: "Trusted Devices", value: "3", subtext: "Currently approved", color: "#2563eb", bg: "#eff6ff", icon: "💻" },
        { label: "Recent Logins", value: "14", subtext: "Past 7 days", color: "#d97706", bg: "#fffbeb", icon: "🕒" },
        { label: "Risk Alerts", value: "0", subtext: "No suspicious activity", color: "#9333ea", bg: "#faf5ff", icon: "✅" },
      ]}
      sideTitle="Security Overview"
      sideItems={[
        { label: "Password Health", value: "Strong", color: "#16a34a" },
        { label: "2-Step Verification", value: "On", color: "#2563eb" },
        { label: "Device Monitoring", value: "Active", color: "#d97706" },
        { label: "Suspicious Logins", value: "None", color: "#9333ea" },
      ]}
      tableTitle="Security Activity"
      tableRows={[
        { name: "Primary Login", meta: "Mumbai, Chrome on Windows", value: "Today", extra: "Trusted device" },
        { name: "Password Updated", meta: "Security maintenance", value: "12 Mar 2026", extra: "Successful" },
        { name: "2FA Verification", meta: "Mobile authenticator", value: "Enabled", extra: "Recommended" },
      ]}
    />
  );
}
