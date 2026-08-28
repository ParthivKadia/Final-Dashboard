// src/pages/Store/UserProfiles.tsx
// All colours/surfaces come from site-theme.css — zero hardcoded Tailwind colour classes.

import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/shared/stores/useAppStore";
import type { Store } from "@/shared/types/store";
import PageBreadcrumb from "@/shared/components/layout/PageBreadCrumb";
import PageMeta from "@/shared/components/layout/PageMeta";
import { StoreIcon } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric",
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function InfoRow({ label, value, highlight }: {
  label:      string;
  value:      string;
  highlight?: "success" | "muted";
}) {
  return (
    <div className="flex justify-between items-start gap-4 py-3 site-border-bottom last:border-0">
      <span className="text-sm site-subtext shrink-0">{label}</span>
      <span className="text-sm font-semibold text-right break-all"
        style={{
          color: highlight === "success" ? "var(--status-active-text)"
               : highlight === "muted"   ? "var(--text-muted)"
               : "var(--text-primary)",
        }}>
        {value}
      </span>
    </div>
  );
}

function StoreCard({ store, onManage }: { store: Store; onManage: () => void }) {
  return (
    <div className="flex items-center gap-3 p-3.5 rounded-xl transition-colors"
      style={{
        border:          "1px solid var(--border-subtle)",
        backgroundColor: "var(--surface-secondary)",
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--border-medium)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border-subtle)")}>

      {/* Logo / initials */}
      <div className="site-thumb shrink-0"
        style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem",
                 border: "1px solid var(--border-medium)" }}>
        {store.logoUrl ? (
          <img src={store.logoUrl} alt={store.name} className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
        ) : (
          <span className="text-sm font-bold site-subtext">
            {store.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
          </span>
        )}
      </div>

      {/* Name + URL — takes all remaining space, truncates cleanly */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold site-heading truncate">{store.name}</p>
        <p className="text-xs site-text-muted truncate">storely.co.in/{store.username}</p>
      </div>

      {/* Theme chip — desktop only, never competes on mobile */}
      {/* <span className="hidden sm:inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 site-badge"
        style={{ backgroundColor: "var(--surface-tertiary)", color: "var(--text-brand)" }}>
        {store.theme?.replace(/_/g, " ") ?? "—"}
      </span> */}

      {/* Manage button */}
      <button className="site-btn site-btn-ghost shrink-0" onClick={onManage}>
        Manage
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function UserProfiles() {
  const navigate = useNavigate();
  const { user, stores, authStatus } = useAppStore();

  if (authStatus === "loading" || authStatus === "idle") {
    return (
      <div className="site-page flex items-center justify-center h-screen">
        <p className="text-sm site-subtext">Loading profile…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="site-page flex items-center justify-center h-screen">
        <p className="text-sm" style={{ color: "var(--danger-solid)" }}>Failed to load profile.</p>
      </div>
    );
  }

  const roleLabel = user.roles?.map(r => r.name.replace("ROLE_", "")).join(", ") || "User";

  return (
    <div className="site-page site-page-padding">
      <PageMeta
        title="User Profile | Storely Dashboard"
        description="View and manage your Storely user profile"
      />
      <PageBreadcrumb pageTitle="User Profile" />

      <div className="space-y-5">

        {/* ── Identity Card ── */}
        <div className="site-card p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

            {/* Avatar */}
            <div className="shrink-0">
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.name}
                  className="w-20 h-20 rounded-2xl object-cover"
                  style={{ border: "1px solid var(--border-medium)" }} />
              ) : (
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-semibold"
                  style={{
                    backgroundColor: "var(--surface-tertiary)",
                    color:           "var(--text-brand)",
                    border:          "1px solid var(--border-subtle)",
                  }}>
                  {getInitials(user.name)}
                </div>
              )}
            </div>

            {/* Identity info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl font-bold site-heading">{user.name}</h2>

                <span className="site-badge site-badge--brand">{roleLabel}</span>

                {user.enable && (
                  <span className="site-badge site-badge--active">Active</span>
                )}

                {user.onBoard && (
                  <span className="site-badge"
                    style={{ backgroundColor: "rgba(124,58,237,0.1)", color: "#6d28d9" }}>
                    Onboarded
                  </span>
                )}
              </div>

              <p className="text-sm site-subtext">@{user.username}</p>
              <p className="text-xs site-text-muted mt-1">
                Member since {formatDate(user.createdDate)}
              </p>
            </div>
          </div>
        </div>

        {/* ── Two-column: contact info + stores ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Contact Info */}
          <div className="site-card p-6">
            <h3 className="h4 site-heading mb-5">Contact information</h3>
            <div>
              <InfoRow label="Full name"       value={user.name} />
              <InfoRow label="Username"        value={`@${user.username}`} />
              <InfoRow label="Email"           value={user.email} />
              <InfoRow label="Mobile"          value={user.mobile} />
              {user.gender && <InfoRow label="Gender" value={user.gender} />}
              <InfoRow
                label="Biometric login"
                value={user.biometric ? "Enabled" : "Disabled"}
                highlight={user.biometric ? "success" : "muted"}
              />
            </div>
          </div>

          {/* Stores */}
          <div className="site-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="h4 site-heading flex items-center gap-2">
                Your stores
                <span className="site-badge" style={{ backgroundColor: "var(--surface-secondary)", color: "var(--text-secondary)" }}>
                  {stores.length}
                </span>
              </h3>
              <button className="site-btn site-btn-primary"
                onClick={() => navigate("/store/create-store")}>
                + New Store
              </button>
            </div>

            <div className="space-y-3">
              {stores.map((store: Store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  onManage={() =>
                    navigate("/store/store-profile", { state: { storeUsername: store.username } })
                  }
                />
              ))}
              {stores.length === 0 && (
                <div className="site-empty-state py-8">
                  <StoreIcon className="text-base" />
                  <p className="site-empty-title">No stores yet</p>
                  <p className="site-empty-desc">Create your first store to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}