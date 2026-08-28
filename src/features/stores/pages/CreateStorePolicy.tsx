// src/pages/Policies/CreateStorePolicy.tsx
//
// Create / edit a store policy (Privacy, Terms, Refund, Shipping, Cookies).
// Follows the same visual language as Orders/Customers/Analytics/Settings —
// site-* classes from site-theme.css, zero hardcoded Tailwind colour classes.
//
// Data below is MOCKED. Wire up to your real policies API before shipping:
//   GET    /api/v1/store/policies
//   POST   /api/v1/store/policies
//   PUT    /api/v1/store/policies/:id

import { useMemo, useState } from "react";
import {
  ShieldCheck,
  FileText,
  RotateCcw,
  Truck,
  Cookie,
  Save,
  Eye,
  Clock,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

type PolicyType = "privacy" | "terms" | "refund" | "shipping" | "cookies";
type PolicyStatus = "draft" | "published";

type Policy = {
  type: PolicyType;
  label: string;
  icon: React.ReactNode;
  title: string;
  content: string;
  status: PolicyStatus;
  lastUpdated: string; // ISO date
};

// ─── Mocked existing policies ───────────────────────────────────────────────

const MOCK_POLICIES: Record<PolicyType, Policy> = {
  privacy: {
    type: "privacy",
    label: "Privacy Policy",
    icon: <ShieldCheck className="h-4 w-4" />,
    title: "Privacy Policy",
    content:
      "We collect only the information needed to process your orders and " +
      "improve your shopping experience — name, email, shipping address, " +
      "and payment details. We never sell your data to third parties. " +
      "You can request a copy or deletion of your data at any time by " +
      "contacting support@storely.co.in.",
    status: "published",
    lastUpdated: "2026-06-02",
  },
  terms: {
    type: "terms",
    label: "Terms & Conditions",
    icon: <FileText className="h-4 w-4" />,
    title: "Terms & Conditions",
    content:
      "By placing an order on this store, you agree to pay the listed " +
      "price plus applicable taxes and shipping. Product images are " +
      "representative; minor variations in colour or packaging may occur. " +
      "We reserve the right to cancel orders in cases of pricing errors " +
      "or suspected fraud.",
    status: "published",
    lastUpdated: "2026-05-18",
  },
  refund: {
    type: "refund",
    label: "Refund Policy",
    icon: <RotateCcw className="h-4 w-4" />,
    title: "Refund & Return Policy",
    content:
      "Items can be returned within 7 days of delivery if unused and in " +
      "original packaging. Refunds are processed to the original payment " +
      "method within 5-7 business days of us receiving the returned item. " +
      "Customised or perishable items are not eligible for return.",
    status: "draft",
    lastUpdated: "2026-07-01",
  },
  shipping: {
    type: "shipping",
    label: "Shipping Policy",
    icon: <Truck className="h-4 w-4" />,
    title: "Shipping Policy",
    content:
      "Orders are dispatched within 1-2 business days. Standard delivery " +
      "takes 3-6 business days depending on your location. Free shipping " +
      "applies on orders above ₹999; a flat ₹49 fee applies below that.",
    status: "published",
    lastUpdated: "2026-04-22",
  },
  cookies: {
    type: "cookies",
    label: "Cookie Policy",
    icon: <Cookie className="h-4 w-4" />,
    title: "Cookie Policy",
    content: "",
    status: "draft",
    lastUpdated: "2026-07-09",
  },
};

const POLICY_ORDER: PolicyType[] = [
  "privacy",
  "terms",
  "refund",
  "shipping",
  "cookies",
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function CreateStorePolicy() {
  const [policies, setPolicies] =
    useState<Record<PolicyType, Policy>>(MOCK_POLICIES);
  const [activeType, setActiveType] = useState<PolicyType>("privacy");
  const [saved, setSaved] = useState(false);

  const active = policies[activeType];

  const wordCount = useMemo(
    () => (active.content.trim() ? active.content.trim().split(/\s+/).length : 0),
    [active.content]
  );

  const updateActive = (patch: Partial<Policy>) => {
    setSaved(false);
    setPolicies((prev) => ({
      ...prev,
      [activeType]: { ...prev[activeType], ...patch },
    }));
  };

  const handleSave = () => {
    updateActive({ lastUpdated: new Date().toISOString().slice(0, 10) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="site-page site-page-padding">
      <div className="mx-auto w-full max-w-5xl">
        {/* ── Page header ── */}
        <div className="site-page-header">
          <div>
            <h1 className="site-page-title">Store Policies</h1>
            <p className="site-page-subtitle">
              Set the policies customers see at checkout and in your store footer
            </p>
          </div>
          <button className="site-btn site-btn-primary" onClick={handleSave}>
            <Save className="h-4 w-4" />
            Save changes
          </button>
        </div>

        {saved && (
          <div className="site-banner site-banner-success mb-4">
            <span>{active.label} saved successfully</span>
          </div>
        )}

        {/* ── Policy type tabs ── */}
        <div className="site-tabs mb-5">
          {POLICY_ORDER.map((type) => (
            <button
              key={type}
              className={`site-tab ${activeType === type ? "site-tab--active" : ""}`}
              onClick={() => setActiveType(type)}
            >
              {policies[type].label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* ── Editor ── */}
          <div className="site-card lg:col-span-2">
            <div className="site-card-body">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="site-emoji-wrap-sm site-surface-tertiary">
                    {active.icon}
                  </span>
                  <h3 className="h3">{active.label}</h3>
                </div>
                <span
                  className={`site-badge ${
                    active.status === "published"
                      ? "site-badge--active"
                      : "site-badge--low"
                  }`}
                >
                  <span className="site-badge-dot" />
                  {active.status === "published" ? "Published" : "Draft"}
                </span>
              </div>

              <div className="mb-4">
                <label className="site-label">Policy title</label>
                <input
                  className="site-input"
                  value={active.title}
                  onChange={(e) => updateActive({ title: e.target.value })}
                  placeholder="e.g. Privacy Policy"
                />
              </div>

              <div className="mb-2">
                <label className="site-label">Policy content</label>
                <textarea
                  className="site-input"
                  style={{ minHeight: "16rem" }}
                  value={active.content}
                  onChange={(e) => updateActive({ content: e.target.value })}
                  placeholder={`Write your ${active.label.toLowerCase()} here…`}
                />
              </div>
              <p className="site-text-muted mb-5" style={{ fontSize: "0.75rem" }}>
                {wordCount} words
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  className="site-btn site-btn-outline"
                  onClick={() =>
                    updateActive({
                      status: active.status === "published" ? "draft" : "published",
                    })
                  }
                >
                  <Eye className="h-4 w-4" />
                  {active.status === "published" ? "Unpublish" : "Publish"}
                </button>
                <button className="site-btn site-btn-primary" onClick={handleSave}>
                  <Save className="h-4 w-4" />
                  Save {active.label}
                </button>
              </div>
            </div>
          </div>

          {/* ── Sidebar: all policies status ── */}
          <div className="site-card">
            <div className="site-card-body">
              <h6 className="mb-4">All policies</h6>
              <div className="flex flex-col gap-1">
                {POLICY_ORDER.map((type) => {
                  const p = policies[type];
                  return (
                    <button
                      key={type}
                      onClick={() => setActiveType(type)}
                      className={`sidebar-item ${
                        activeType === type ? "sidebar-item--active" : ""
                      }`}
                    >
                      <span className="site-emoji-wrap-sm site-surface-tertiary">
                        {p.icon}
                      </span>
                      <span className="sidebar-item-label">{p.label}</span>
                      <span
                        className={`site-badge ${
                          p.status === "published"
                            ? "site-badge--active"
                            : "site-badge--low"
                        }`}
                      >
                        <span className="site-badge-dot" />
                      </span>
                    </button>
                  );
                })}
              </div>

              <hr className="site-divider my-4" />

              <div className="flex items-center gap-2 site-subtext" style={{ fontSize: "0.8125rem" }}>
                <Clock className="h-3.5 w-3.5" />
                Last updated{" "}
                {new Date(active.lastUpdated).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}