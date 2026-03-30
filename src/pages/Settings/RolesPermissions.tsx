import SettingsPage from "./SettingsPage";

export default function RolesPermissions() {
  return (
    <SettingsPage
      title="Roles & Permissions"
      subtitle="Manage staff access, admin rights, and operational permissions"
      stats={[
        { label: "Active Users", value: "6", subtext: "Team members with access", color: "#2563eb", bg: "#eff6ff", icon: "👥" },
        { label: "Admins", value: "2", subtext: "Full control access", color: "#16a34a", bg: "#f0fdf4", icon: "🛡️" },
        { label: "Managers", value: "2", subtext: "Operational permissions", color: "#d97706", bg: "#fffbeb", icon: "📋" },
        { label: "Restricted Users", value: "2", subtext: "Limited access", color: "#9333ea", bg: "#faf5ff", icon: "🔐" },
      ]}
      sideTitle="Permission Overview"
      sideItems={[
        { label: "Orders Access", value: "Granted", color: "#16a34a" },
        { label: "Product Editing", value: "Restricted", color: "#d97706" },
        { label: "Financial Access", value: "Admin Only", color: "#dc2626" },
        { label: "Marketing Access", value: "Manager+", color: "#2563eb" },
      ]}
      tableTitle="User Roles"
      tableRows={[
        { name: "Store Owner", meta: "Primary admin account", value: "Admin", extra: "Full access" },
        { name: "Operations Lead", meta: "Order + shipping management", value: "Manager", extra: "Limited finance access" },
        { name: "Support Staff", meta: "Customer response team", value: "Support", extra: "Messages only" },
      ]}
    />
  );
}
