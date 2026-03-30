import SettingsPage from "./SettingsPage";

export default function AccountSettings() {
  return (
    <SettingsPage
      title="Account Settings"
      subtitle="Manage owner profile, account preferences, and business identity"
      stats={[
        { label: "Profile Status", value: "Complete", subtext: "All required fields added", color: "#16a34a", bg: "#f0fdf4", icon: "👤" },
        { label: "Business Email", value: "Verified", subtext: "Primary email confirmed", color: "#2563eb", bg: "#eff6ff", icon: "✉️" },
        { label: "Phone Status", value: "Verified", subtext: "Mobile number linked", color: "#d97706", bg: "#fffbeb", icon: "📱" },
        { label: "Account Age", value: "2.4 yrs", subtext: "Since first setup", color: "#9333ea", bg: "#faf5ff", icon: "🏢" },
      ]}
      sideTitle="Account Overview"
      sideItems={[
        { label: "Account Type", value: "Seller Admin", color: "#2563eb" },
        { label: "Store Status", value: "Active", color: "#16a34a" },
        { label: "Verification", value: "Completed", color: "#d97706" },
        { label: "Language", value: "English", color: "#9333ea" },
      ]}
      tableTitle="Account Details"
      tableRows={[
        { name: "Owner Name", meta: "Primary account holder", value: "Parth", extra: "Editable" },
        { name: "Business Email", meta: "Login and support contact", value: "support@storly.com", extra: "Verified" },
        { name: "Business Phone", meta: "Primary contact number", value: "+91 98765 43210", extra: "Verified" },
      ]}
    />
  );
}
