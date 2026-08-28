// src/pages/Store/CreateStore.tsx
// All colours/surfaces come from site-theme.css — zero hardcoded Tailwind colour classes.

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createStore } from "@/shared/services/storeService";
import CloudinaryUploadWidget from "@/shared/components/forms/CloudinaryUploadWidget";
import { toast } from "sonner";
import { StoreIcon, Lightbulb } from "lucide-react";

const THEMES = [
  { id: "MINIMAL_LIGHT", label: "Minimal Light", desc: "Clean & airy",       icon: "☀️" },
  { id: "MINIMAL_DARK",  label: "Minimal Dark",  desc: "Sleek & bold",       icon: "🌙" },
  { id: "BOLD_LIGHT",    label: "Bold Light",    desc: "Bold & Light",       icon: "🎨" },
  { id: "BOLD_DARK",     label: "Bold Dark",     desc: "Bold & Dark",        icon: "🎨" },
  { id: "CLASSIC",       label: "Classic",       desc: "Timeless & elegant", icon: "🏛️" },
];

const SOCIAL_FIELDS = [
  { field: "instagram" as const, label: "Instagram",    prefix: "instagram.com/", placeholder: "yourusername" },
  { field: "whatsapp"  as const, label: "WhatsApp",     prefix: "",              placeholder: "1234567890" },
  { field: "facebook"  as const, label: "Facebook",     prefix: "facebook.com/",  placeholder: "yourpage"     },
  { field: "twitter"   as const, label: "Twitter / X",  prefix: "x.com/",         placeholder: "yourhandle"   },
];

interface FormData {
  username:  string;
  name:      string;
  bio:       string;
  logoUrl:   string;
  bannerUrl: string;
  theme:     string;
  instagram: string;
  whatsapp:  string;
  facebook:  string;
  twitter:   string;
}

export default function CreateStore() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"basic" | "appearance" | "social">("basic");
  const [saving, setSaving]       = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  // const { error, handleError, clearError } = useApiError();

  const [form, setForm] = useState<FormData>({
    username: "", name: "", bio: "", logoUrl: "", bannerUrl: "",
    theme: "MINIMAL_LIGHT",
    instagram: "", whatsapp: "", facebook: "", twitter: "",
  });

  const update = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // clearError();
  };

  const handleLogoUpload   = useCallback((url: string) => setForm(p => ({ ...p, logoUrl:   url })), []);
  const handleBannerUpload = useCallback((url: string) => setForm(p => ({ ...p, bannerUrl: url })), []);

  const handleSubmit = async () => {
    if (!form.username || !form.name) {
      toast.error("Store username and name are required.");
      if (!form.username) setActiveTab("basic");
      return;
    }
    setSaving(true);
    setUsernameError(null);
    try {
      await createStore({
        username:    form.username,
        name:        form.name,
        bio:         form.bio,
        logoUrl:     form.logoUrl,
        bannerUrl:   form.bannerUrl,
        theme:       form.theme,
        socialLinks: {
          instagram: form.instagram,
          whatsapp:  form.whatsapp,
          facebook:  form.facebook,
          twitter:   form.twitter,
        },
      });
      toast.success(`"${form.name}" is live 🎉`);
      navigate("/");
    } catch (err: any) {
      // This is exactly your "name already taken" case from earlier —
      // toast it directly using the server's message.
      const msg = err?.data?.message || err?.message || "Failed to create store.";
      toast.error(msg);
      if (msg.toLowerCase().includes("username") || msg.toLowerCase().includes("taken")) {
        setUsernameError(msg);
        setActiveTab("basic"); // jump them back to the field even if they're on Appearance/Social tab
      }
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "basic",      label: "Basic Info"   },
    { id: "appearance", label: "Appearance"   },
    { id: "social",     label: "Social Links" },
  ] as const;

  return (
    <div className="site-page site-page-padding">

      {/* ── Header ── */}
      <div className="site-page-header">
        <div className="flex items-center gap-3">
          <button className="site-back-btn" onClick={() => navigate("/store")}>←</button>
          <div>
            <h1 className="site-page-title">Create Your Store</h1>
            <p className="site-page-subtitle">Set up your online storefront in minutes</p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="site-btn site-btn-ghost" onClick={() => navigate("/")}>
            Cancel
          </button>
          <button className="site-btn site-btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving
              ? <><span className="site-spinner" /> Creating…</>
              : "Launch Store"
            }
          </button>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {/* <ErrorToast error={error} onDismiss={clearError} /> */}

      {/* ── Two-column layout ── */}
      <div className="flex flex-col lg:flex-row gap-5">

        {/* ── LEFT: Form ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">

          {/* Tabs */}
          <div className="site-tabs">
            {tabs.map(tab => (
              <button key={tab.id}
                className={`site-tab ${activeTab === tab.id ? "site-tab--active" : ""}`}
                onClick={() => setActiveTab(tab.id)}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── BASIC INFO ── */}
          {activeTab === "basic" && (
            <div className="site-card site-card-body">
              <h2 className="h3 site-heading mb-1">Store Details</h2>
              <p className="site-subtext text-sm mb-5">This is how customers will find and identify your store.</p>

              <div className="space-y-4">
                {/* Username */}
                <div>
                  <label className="site-label">
                    Store Username <span className="text-[var(--danger-solid)]">*</span>
                  </label>
                  <div className="site-input-prefix">
                    <span
                      className="site-input-prefix-icon"
                      style={{ fontSize: "0.75rem", left: "0.875rem", whiteSpace: "nowrap", width: "auto" }}
                    >
                      storely.co.in/
                    </span>
                    <input
                      value={form.username}
                      onChange={e => {
                        update("username", e.target.value.toLowerCase().replace(/\s+/g, ""));
                        setUsernameError(null);
                      }}
                      placeholder="yourstore"
                      className={`site-input site-input-mono ${usernameError ? "border-red-500" : ""}`}
                      style={{ paddingLeft: "6.5rem" }}
                    />
                  </div>
                  {usernameError ? (
                    <p className="text-xs mt-1" style={{ color: "var(--danger-text)" }}>{usernameError}</p>
                  ) : (
                    <p className="text-xs site-text-muted mt-1">Lowercase letters, numbers, and hyphens only</p>
                  )}
                </div>

                {/* Store Name */}
                <div>
                  <label className="site-label">
                    Store Name <span className="text-[var(--danger-solid)]">*</span>
                  </label>
                  <input
                    value={form.name}
                    onChange={e => update("name", e.target.value)}
                    placeholder="e.g. My Awesome Shop"
                    className="site-input"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="site-label">Bio / Description</label>
                  <textarea
                    value={form.bio}
                    onChange={e => update("bio", e.target.value)}
                    placeholder="Tell customers what your store is about…"
                    rows={4}
                    maxLength={500}
                    className="site-input"
                  />
                  <p className="text-xs site-text-muted mt-1">{form.bio.length}/300 characters</p>
                </div>
              </div>
            </div>
          )}

          {/* ── APPEARANCE ── */}
          {activeTab === "appearance" && (
            <div className="site-card site-card-body">
              <h2 className="h3 site-heading mb-1">Store Appearance</h2>
              <p className="site-subtext text-sm mb-5">Customize how your store looks to customers.</p>

              <div className="space-y-5">
                {/* Theme Picker */}
                <div>
                  <label className="site-label">Store Theme</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {THEMES.map(t => {
                      const selected = form.theme === t.id;
                      return (
                        <button key={t.id}
                          onClick={() => update("theme", t.id)}
                          className="create-store-theme-card flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center"
                          style={{
                            borderColor:     selected ? "var(--btn-primary-bg)"  : "var(--border-medium)",
                            backgroundColor: selected ? "var(--surface-tertiary)" : "var(--surface-secondary)",
                          }}>
                          <span className="text-2xl">{t.icon}</span>
                          <div>
                            <p className="text-xs font-bold"
                              style={{ color: selected ? "var(--text-brand)" : "var(--text-primary)" }}>
                              {t.label}
                            </p>
                            <p className="text-[10px] site-text-muted mt-0.5">{t.desc}</p>
                          </div>
                          {selected && (
                            <span className="site-badge site-badge--brand text-[10px]">Selected</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="site-label">Store Logo</label>
                  <div className="flex items-center gap-3 flex-wrap">
                    <CloudinaryUploadWidget onUpload={handleLogoUpload} />
                    {form.logoUrl && (
                      <div className="relative site-thumb shrink-0"
                        style={{ width: "4rem", height: "4rem", border: "1px solid var(--border-medium)" }}>
                        <img src={form.logoUrl} alt="Logo preview" className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        <button type="button"
                          className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center hover:bg-red-600 transition-colors"
                          onClick={() => update("logoUrl", "")}>✕</button>
                      </div>
                    )}
                  </div>
                  {form.logoUrl && (
                    <p className="text-[11px] site-text-muted mt-1.5 site-truncate">{form.logoUrl}</p>
                  )}
                </div>

                {/* Banner Upload */}
                <div>
                  <label className="site-label">Store Banner</label>
                  <div className="flex items-center gap-3 flex-wrap">
                    <CloudinaryUploadWidget onUpload={handleBannerUpload} />
                    {form.bannerUrl && (
                      <div className="relative w-full site-thumb mt-2"
                        style={{ border: "1px solid var(--border-medium)", height: "6rem", borderRadius: "0.75rem" }}>
                        <img src={form.bannerUrl} alt="Banner preview" className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        <button type="button"
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
                          onClick={() => update("bannerUrl", "")}>✕</button>
                      </div>
                    )}
                  </div>
                  {form.bannerUrl && (
                    <p className="text-[11px] site-text-muted mt-1.5 site-truncate">{form.bannerUrl}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── SOCIAL LINKS ── */}
          {activeTab === "social" && (
            <div className="site-card site-card-body">
              <h2 className="h3 site-heading mb-1">Social Links</h2>
              <p className="site-subtext text-sm mb-5">Connect your social profiles to build trust with customers.</p>

              <div className="space-y-4">
                {SOCIAL_FIELDS.map(({ field, label, prefix, placeholder }) => (
                  <div key={field}>
                    <label className="site-label">
                      {label}
                    </label>
                    <div className="site-input-prefix">
                      <span className="site-input-prefix-icon"
                        style={{ fontSize: "0.75rem", left: "0.875rem", whiteSpace: "nowrap", width: "auto" }}>
                        {prefix}
                      </span>
                      <input
                        value={form[field]}
                        onChange={e => update(field, e.target.value)}
                        placeholder={placeholder}
                        className="site-input"
                        style={{ paddingLeft: `${prefix.length * 7 + 14}px` }}
                      />
                    </div>
                  </div>
                ))}

                {/* Tip box */}
                <div className="site-banner site-banner-info">
                  <div>
                    <p className="flex text-sm font-semibold site-text-brand mb-1">
                      <Lightbulb /> Tip
                    </p>
                    <p className="text-xs site-subtext">
                      For WhatsApp, enter the full number (e.g. 1234567890).
                      Social links help customers reach you directly from your store.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Sidebar preview ── */}
        <div className="w-full lg:w-[300px] xl:w-[320px] shrink-0">
          <div className="site-card site-card-body overflow-hidden">
            <h3 className="h5 site-heading mb-4">Store Preview</h3>

            {/* Mini store card */}
            <div className="rounded-xl overflow-hidden site-card-sm"
              style={{ border: "1px solid var(--border-medium)" }}>

              {/* Banner + logo overlap */}
              <div className="relative">
                <div className="h-16 overflow-hidden"
                  style={{ background: "linear-gradient(to right, var(--brand-400), var(--brand-800))" }}>
                  {form.bannerUrl && (
                    <img src={form.bannerUrl} alt="banner" className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  )}
                </div>
                <div className="absolute left-4 -bottom-5 w-11 h-11 rounded-xl border-2 shadow-md overflow-hidden flex items-center justify-center text-xl z-10"
                  style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-bg)" }}>
                  {form.logoUrl
                    ? <img src={form.logoUrl} alt="logo" className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    : <StoreIcon className="text-base" />
                  }
                </div>
              </div>

              {/* Info */}
              <div className="px-4 pt-7 pb-4" style={{ backgroundColor: "var(--card-bg)" }}>
                <p className="text-sm font-bold site-heading site-truncate">
                  {form.name || "Your Store Name"}
                </p>
                <p className="text-xs site-text-muted site-truncate">
                  storely.co.in/{form.username || "yourstore"}
                </p>
                {form.bio && (
                  <p className="text-xs site-subtext mt-1.5 line-clamp-2">{form.bio}</p>
                )}

                {/* Social chips */}
                <div className="mt-2 flex gap-1 flex-wrap">
                  {form.instagram && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: "rgba(219,39,119,0.1)", color: "#db2777" }}>
                      IG
                    </span>
                  )}
                  {form.whatsapp && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: "var(--status-active-bg)", color: "var(--status-active-text)" }}>
                      WA
                    </span>
                  )}
                  {form.facebook && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: "var(--surface-tertiary)", color: "var(--text-brand)" }}>
                      FB
                    </span>
                  )}
                  {form.twitter && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: "var(--surface-secondary)", color: "var(--text-secondary)" }}>
                      X
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-[10px] site-text-muted mt-2.5 text-center">
              Live preview updates as you type
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}