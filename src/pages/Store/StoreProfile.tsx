// src/pages/Store/StoreProfile.tsx
// All colours/surfaces come from site-theme.css — zero hardcoded Tailwind colour classes.

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { updateStore } from "../../services/storeService";
import { useAppStore } from "../../store/useAppStore";
import type { Store, CreateStoreBody } from "../../types/store";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import CloudinaryUploadWidget from "../../ImageUpload";

// ─── Constants ────────────────────────────────────────────────────────────────

const THEMES = [
  { id: "MINIMAL_LIGHT", label: "Minimal Light", icon: "☀️" },
  { id: "MINIMAL_DARK",  label: "Minimal Dark",  icon: "🌙" },
  { id: "BOLD_LIGHT",    label: "Bold Light",    icon: "🎨" },
  { id: "BOLD_DARK",     label: "Bold Dark",     icon: "🎨" },
  { id: "CLASSIC",       label: "Classic",       icon: "🏛️" },
];

const SOCIAL_FIELDS = [
  { field: "instagram" as const, label: "Instagram",   prefix: "instagram.com/", placeholder: "yourhandle"    },
  { field: "whatsapp"  as const, label: "WhatsApp",    prefix: "",              placeholder: "1234567890" },
  { field: "facebook"  as const, label: "Facebook",    prefix: "facebook.com/",  placeholder: "yourpage"     },
  { field: "twitter"   as const, label: "Twitter / X", prefix: "x.com/",         placeholder: "yourhandle"   },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric", month: "short", day: "numeric",
  });
}

type DraftStore = {
  name: string; bio: string; logoUrl: string; bannerUrl: string; theme: string;
  instagram: string; whatsapp: string; facebook: string; twitter: string;
};

function storeToDraft(store: Store): DraftStore {
  return {
    name:      store.name,
    bio:       store.bio       ?? "",
    logoUrl:   store.logoUrl   ?? "",
    bannerUrl: store.bannerUrl ?? "",
    theme:     store.theme     ?? "MINIMAL_LIGHT",
    instagram: store.socialLinks?.instagram ?? "",
    whatsapp:  store.socialLinks?.whatsapp  ?? "",
    facebook:  store.socialLinks?.facebook  ?? "",
    twitter:   store.socialLinks?.twitter   ?? "",
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, badge, children }: {
  title: string; badge?: string; children: React.ReactNode;
}) {
  return (
    <div className="site-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <h3 className="h4 site-heading">{title}</h3>
        {badge && <span className="site-badge site-badge--brand">{badge}</span>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="site-label-xs mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function ReadonlyField({ value, muted }: { value: string; muted?: boolean }) {
  return (
    <div className="w-full px-3.5 py-2.5 rounded-xl text-sm"
      style={{
        border:          "1px solid var(--border-subtle)",
        backgroundColor: "var(--surface-secondary)",
        color:           muted ? "var(--text-muted)" : "var(--text-primary)",
      }}>
      {value}
    </div>
  );
}

function SideRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center gap-3 py-2.5 site-border-bottom last:border-0">
      <span className="text-xs site-subtext">{label}</span>
      <span className="text-xs font-semibold site-heading text-right site-truncate max-w-[60%]">{value}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StoreProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  const { stores, activeStore: globalActive, setActiveStore, updateStoreInList, authStatus } = useAppStore();

  const passedUsername: string | undefined = (location.state as any)?.storeUsername;

  const resolvedStore: Store | null =
    (passedUsername && stores.find(s => s.username === passedUsername)) ||
    globalActive || stores[0] || null;

  const [activeStore, setLocalActive] = useState<Store | null>(resolvedStore);
  const [draft,       setDraft]       = useState<DraftStore | null>(resolvedStore ? storeToDraft(resolvedStore) : null);
  const [isEditing,   setIsEditing]   = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [saveError,   setSaveError]   = useState<string | null>(null);

  useEffect(() => {
    if (!activeStore && resolvedStore) {
      setLocalActive(resolvedStore);
      setDraft(storeToDraft(resolvedStore));
    }
  }, [resolvedStore]);

  const switchStore = (store: Store) => {
    if (isEditing) return;
    setLocalActive(store); setDraft(storeToDraft(store));
    setActiveStore(store); setSaveError(null);
  };

  const handleEdit   = () => { if (activeStore) setDraft(storeToDraft(activeStore)); setIsEditing(true);  setSaveError(null); };
  const handleCancel = () => { if (activeStore) setDraft(storeToDraft(activeStore)); setIsEditing(false); setSaveError(null); };

  const handleSave = async () => {
    if (!activeStore || !draft) return;
    setSaving(true); setSaveError(null);
    const body: Partial<CreateStoreBody> = {
      username: activeStore.username,
      name: draft.name, bio: draft.bio,
      logoUrl: draft.logoUrl, bannerUrl: draft.bannerUrl, theme: draft.theme,
      socialLinks: { instagram: draft.instagram, whatsapp: draft.whatsapp, facebook: draft.facebook, twitter: draft.twitter },
    };
    try {
      const response = await updateStore(activeStore.username, body);
      const updated: Store = {
        ...activeStore, ...response.data,
        name: draft.name, bio: draft.bio,
        logoUrl: draft.logoUrl, bannerUrl: draft.bannerUrl, theme: draft.theme,
        socialLinks: { instagram: draft.instagram, whatsapp: draft.whatsapp, facebook: draft.facebook, twitter: draft.twitter },
      };
      setLocalActive(updated); setDraft(storeToDraft(updated));
      updateStoreInList(updated); setIsEditing(false);
    } catch (err: any) {
      setSaveError(err?.message || "Failed to save changes.");
    } finally { setSaving(false); }
  };

  const updateDraft = (field: keyof DraftStore, value: string) =>
    setDraft(prev => prev ? { ...prev, [field]: value } : prev);

  const handleLogoUpload   = useCallback((url: string) => setDraft(p => p ? { ...p, logoUrl:   url } : p), []);
  const handleBannerUpload = useCallback((url: string) => setDraft(p => p ? { ...p, bannerUrl: url } : p), []);

  // ── Guards ────────────────────────────────────────────────────────────────

  if (authStatus === "loading" || authStatus === "idle") {
    return (
      <div className="site-page flex items-center justify-center h-screen">
        <p className="text-sm site-subtext">Loading store profile…</p>
      </div>
    );
  }

  if (!activeStore || !draft) {
    return (
      <div className="site-page flex items-center justify-center h-screen">
        <p className="text-sm" style={{ color: "var(--danger-solid)" }}>Store not found.</p>
      </div>
    );
  }

  // current values (editing = draft, viewing = store)
  const cur = {
    name:      isEditing ? draft.name      : activeStore.name,
    bio:       isEditing ? draft.bio       : (activeStore.bio ?? ""),
    logoUrl:   isEditing ? draft.logoUrl   : (activeStore.logoUrl ?? ""),
    bannerUrl: isEditing ? draft.bannerUrl : (activeStore.bannerUrl ?? ""),
    instagram: isEditing ? draft.instagram : (activeStore.socialLinks?.instagram ?? ""),
    whatsapp:  isEditing ? draft.whatsapp  : (activeStore.socialLinks?.whatsapp  ?? ""),
    facebook:  isEditing ? draft.facebook  : (activeStore.socialLinks?.facebook  ?? ""),
    twitter:   isEditing ? draft.twitter   : (activeStore.socialLinks?.twitter   ?? ""),
  };

  return (
    <div className="site-page site-page-padding">
      <PageMeta title="Store Profile | Storly Dashboard" description="Manage your store profile" />
      <PageBreadcrumb pageTitle="Store Profile" />

      <div className="space-y-5">

        {/* ── Store Switcher ── */}
        {stores.length > 1 && (
          <div className="site-card p-4">
            <p className="site-label-xs mb-3">Switch store</p>
            <div className="flex flex-wrap gap-2">
              {stores.map(store => {
                const isActive = activeStore.username === store.username;
                return (
                  <button key={store.id}
                    onClick={() => switchStore(store)}
                    disabled={isEditing}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      borderColor:     isActive ? "var(--btn-primary-bg)"   : "var(--border-medium)",
                      backgroundColor: isActive ? "var(--surface-tertiary)" : "transparent",
                      color:           isActive ? "var(--text-brand)"       : "var(--text-secondary)",
                    }}>
                    {store.logoUrl
                      ? <img src={store.logoUrl} alt="" className="w-5 h-5 rounded-md object-cover"
                          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      : <span className="text-xs">🏪</span>
                    }
                    {store.name}
                  </button>
                );
              })}
            </div>
            {isEditing && (
              <p className="text-xs mt-2" style={{ color: "var(--featured-color)" }}>
                Save or cancel your changes before switching stores.
              </p>
            )}
          </div>
        )}

        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold site-heading">{activeStore.name}</h2>
            <p className="text-sm site-subtext">
              storly.co.in/{activeStore.username} · Created {formatDate(activeStore.createdAt)}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            {!isEditing ? (
              <>
                <button className="site-btn site-btn-ghost site-btn-sm"
                  onClick={() => navigate("/store/create-store")}>
                  + New store
                </button>
                <button className="site-btn site-btn-primary site-btn-sm" onClick={handleEdit}>
                  Edit profile
                </button>
              </>
            ) : (
              <>
                <button className="site-btn site-btn-ghost site-btn-sm" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="site-btn site-btn-primary site-btn-sm" onClick={handleSave} disabled={saving}>
                  {saving ? <><span className="site-spinner" /> Saving…</> : "Save changes"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Save error ── */}
        {saveError && (
          <div className="site-banner site-banner-error">
            <span>⚠️ {saveError}</span>
            <button className="text-lg leading-none opacity-60 hover:opacity-100 ml-2"
              onClick={() => setSaveError(null)}>×</button>
          </div>
        )}

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">

            {/* Basic Info */}
            <Section title="Store details" badge={isEditing ? "Editing" : undefined}>
              <div className="space-y-4">
                <Field label="Store name">
                  {isEditing
                    ? <input value={draft.name} onChange={e => updateDraft("name", e.target.value)} className="site-input" />
                    : <ReadonlyField value={activeStore.name} />}
                </Field>
                <Field label="Username (URL)">
                  <ReadonlyField value={`storly.co.in/${activeStore.username}`} muted />
                  {isEditing && (
                    <p className="text-xs site-text-muted mt-1">Store URL cannot be changed after creation.</p>
                  )}
                </Field>
                <Field label="Bio / Description">
                  {isEditing
                    ? <textarea value={draft.bio} onChange={e => updateDraft("bio", e.target.value)}
                        rows={4} maxLength={500} className="site-input" />
                    : <ReadonlyField value={activeStore.bio || "—"} />}
                </Field>
              </div>
            </Section>

            {/* Appearance */}
            <Section title="Appearance">
              <div className="space-y-4">

                {/* Theme */}
                <Field label="Theme">
                  {isEditing ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {THEMES.map(t => {
                        const selected = draft.theme === t.id;
                        return (
                          <button key={t.id} onClick={() => updateDraft("theme", t.id)}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all"
                            style={{
                              borderColor:     selected ? "var(--btn-primary-bg)"   : "var(--border-medium)",
                              backgroundColor: selected ? "var(--surface-tertiary)" : "var(--surface-secondary)",
                              color:           selected ? "var(--text-brand)"       : "var(--text-secondary)",
                            }}>
                            <span className="text-base">{t.icon}</span>
                            <span className="text-xs">{t.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <ReadonlyField value={activeStore.theme?.replace(/_/g, " ") ?? "—"} />
                  )}
                </Field>

                {/* Logo */}
                <Field label="Store Logo">
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <CloudinaryUploadWidget onUpload={handleLogoUpload} />
                        {draft.logoUrl && (
                          <div className="relative site-thumb shrink-0"
                            style={{ width: "4rem", height: "4rem", border: "1px solid var(--border-medium)" }}>
                            <img src={draft.logoUrl} alt="Logo preview" className="w-full h-full object-cover"
                              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                            <button type="button"
                              className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center hover:bg-red-600 transition-colors"
                              onClick={() => updateDraft("logoUrl", "")}>✕</button>
                          </div>
                        )}
                      </div>
                      {draft.logoUrl && (
                        <p className="text-[11px] site-text-muted site-truncate">{draft.logoUrl}</p>
                      )}
                    </div>
                  ) : (
                    <>
                      <ReadonlyField value={activeStore.logoUrl || "Not set"} muted={!activeStore.logoUrl} />
                      {activeStore.logoUrl && (
                        <div className="mt-2 flex items-center gap-3 p-3 rounded-xl site-surface-secondary"
                          style={{ border: "1px solid var(--border-subtle)" }}>
                          <img src={activeStore.logoUrl} alt="Logo preview"
                            className="w-10 h-10 rounded-lg object-cover"
                            style={{ border: "1px solid var(--border-subtle)" }}
                            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          <p className="text-xs site-text-muted">Logo preview</p>
                        </div>
                      )}
                    </>
                  )}
                </Field>

                {/* Banner */}
                <Field label="Store Banner">
                  {isEditing ? (
                    <div className="space-y-2">
                      <CloudinaryUploadWidget onUpload={handleBannerUpload} />
                      {draft.bannerUrl && (
                        <div className="relative w-full site-thumb mt-2"
                          style={{ height: "6rem", border: "1px solid var(--border-medium)" }}>
                          <img src={draft.bannerUrl} alt="Banner preview" className="w-full h-full object-cover"
                            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          <button type="button"
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
                            onClick={() => updateDraft("bannerUrl", "")}>✕</button>
                        </div>
                      )}
                      {draft.bannerUrl && (
                        <p className="text-[11px] site-text-muted site-truncate">{draft.bannerUrl}</p>
                      )}
                    </div>
                  ) : (
                    <>
                      <ReadonlyField value={activeStore.bannerUrl || "Not set"} muted={!activeStore.bannerUrl} />
                      {activeStore.bannerUrl && (
                        <div className="mt-2 site-thumb w-full" style={{ height: "5rem", border: "1px solid var(--border-subtle)" }}>
                          <img src={activeStore.bannerUrl} alt="Banner preview" className="w-full h-full object-cover"
                            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        </div>
                      )}
                    </>
                  )}
                </Field>
              </div>
            </Section>

            {/* Social Links */}
            <Section title="Social links">
              <div className="space-y-4">
                {SOCIAL_FIELDS.map(({ field, label, prefix, placeholder }) => (
                  <Field key={field} label={label}>
                    {isEditing ? (
                      <div className="site-input-prefix">
                        <span className="site-input-prefix-icon"
                          style={{ fontSize: "0.75rem", left: "0.875rem", whiteSpace: "nowrap", width: "auto" }}>
                          {prefix}
                        </span>
                        <input value={draft[field]} onChange={e => updateDraft(field, e.target.value)}
                          placeholder={placeholder} className="site-input"
                          style={{ paddingLeft: `${prefix.length * 7 + 14}px` }} />
                      </div>
                    ) : (
                      <ReadonlyField
                        value={activeStore.socialLinks?.[field]
                          ? `${prefix}${activeStore.socialLinks[field]}`
                          : "Not set"}
                        muted={!activeStore.socialLinks?.[field]}
                      />
                    )}
                  </Field>
                ))}
              </div>
            </Section>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-5">

            {/* Live preview */}
            <div className="site-card p-5">
              <p className="site-label-xs mb-4">Store preview</p>
              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-medium)" }}>

                {/* Banner + logo */}
                <div className="relative h-16"
                  style={{ background: "linear-gradient(to right, var(--brand-400), var(--brand-800))" }}>
                  {cur.bannerUrl && (
                    <img src={cur.bannerUrl} alt="banner" className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  )}
                  <div className="absolute left-3 -bottom-5 w-10 h-10 rounded-xl border-2 shadow overflow-hidden flex items-center justify-center text-sm z-10"
                    style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-bg)" }}>
                    {cur.logoUrl
                      ? <img src={cur.logoUrl} alt="logo" className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      : "🏪"
                    }
                  </div>
                </div>

                {/* Info */}
                <div className="px-3 pt-7 pb-3" style={{ backgroundColor: "var(--card-bg)" }}>
                  <p className="text-sm font-bold site-heading site-truncate">
                    {cur.name || "Store name"}
                  </p>
                  <p className="text-xs site-text-muted site-truncate">storly.co.in/{activeStore.username}</p>
                  {cur.bio && (
                    <p className="text-xs site-subtext mt-1.5 line-clamp-2">{cur.bio}</p>
                  )}
                  <div className="mt-2 flex gap-1 flex-wrap">
                    {cur.instagram && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: "rgba(219,39,119,0.1)", color: "#db2777" }}>IG</span>
                    )}
                    {cur.whatsapp && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: "var(--status-active-bg)", color: "var(--status-active-text)" }}>WA</span>
                    )}
                    {cur.facebook && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: "var(--surface-tertiary)", color: "var(--text-brand)" }}>FB</span>
                    )}
                    {cur.twitter && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: "var(--surface-secondary)", color: "var(--text-secondary)" }}>X</span>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-[10px] site-text-muted mt-2.5 text-center">Updates live as you edit</p>
            </div>

            {/* Store info */}
            <div className="site-card p-5">
              <p className="site-label-xs mb-4">Store info</p>
              <div>
                <SideRow label="Store ID"  value={activeStore.id.slice(0, 8) + "…"} />
                <SideRow label="Username"  value={activeStore.username} />
                <SideRow label="Theme"     value={activeStore.theme?.replace(/_/g, " ") ?? "—"} />
                <SideRow label="Created"   value={formatDate(activeStore.createdAt)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}