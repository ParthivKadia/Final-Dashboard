import { useState } from "react";

type StoreProfileData = {
  storeName: string;
  businessCategory: string;
  supportEmail: string;
  phone: string;
  website: string;
  gstNumber: string;
  address: string;
  description: string;
  startYear: string;
};

const initialProfile: StoreProfileData = {
  storeName: "Storly",
  businessCategory: "Lifestyle & Electronics",
  supportEmail: "support@storly.com",
  phone: "+91 98765 43210",
  website: "www.storly.com",
  gstNumber: "27ABCDE1234F1Z5",
  address: "Mumbai, Maharashtra, India",
  description:
    "Storly is a modern ecommerce seller brand focused on electronics, fashion, and everyday lifestyle essentials.",
  startYear: "2023",
};

export default function StoreProfile() {
  const [profile, setProfile] = useState<StoreProfileData>(initialProfile);
  const [draft, setDraft] = useState<StoreProfileData>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);

  const storeAgeYears = Math.max(0, new Date().getFullYear() - Number(profile.startYear));

  const stats = [
    {
      label: "Store Rating",
      value: "4.8",
      subtext: "Average customer rating",
      color: "#2563eb",
      bg: "#eff6ff",
      icon: "⭐",
    },
    {
      label: "Products Live",
      value: "126",
      subtext: "Active listings",
      color: "#16a34a",
      bg: "#f0fdf4",
      icon: "🛍",
    },
    {
      label: "Profile Views",
      value: "18.4K",
      subtext: "Monthly visitors",
      color: "#d97706",
      bg: "#fffbeb",
      icon: "👁",
    },
    {
      label: "Store Age",
      value: `${storeAgeYears} yrs`,
      subtext: `Started in ${profile.startYear}`,
      color: "#9333ea",
      bg: "#faf5ff",
      icon: "🏪",
    },
  ];

  const handleChange = (field: keyof StoreProfileData, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = () => {
    setDraft(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft(profile);
    setIsEditing(false);
  };

  const handleSave = () => {
    setProfile(draft);
    setIsEditing(false);
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .store-profile-page {
          min-height: 100vh;
          padding: 24px;
          background: #f8fafc;
          font-family: 'DM Sans', sans-serif;
        }

        .store-profile-shell {
          max-width: 1400px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .page-header h1 {
          margin: 0;
          font-size: 30px;
          line-height: 1.2;
          font-weight: 700;
          color: #0f172a;
        }

        .page-header p {
          margin: 6px 0 0;
          font-size: 15px;
          color: #64748b;
        }

        .header-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .primary-btn,
        .secondary-btn {
          border: none;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
        }

        .primary-btn:hover,
        .secondary-btn:hover {
          transform: translateY(-1px);
        }

        .primary-btn {
          padding: 12px 18px;
          border-radius: 12px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          box-shadow: 0 10px 20px rgba(37, 99, 235, 0.22);
        }

        .secondary-btn {
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid #dbe4f0;
          background: #fff;
          color: #334155;
          font-size: 14px;
          font-weight: 600;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .card {
          background: #fff;
          border-radius: 18px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
          min-width: 0;
        }

        .stat-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 12px;
        }

        .stat-label {
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
        }

        .stat-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .stat-value {
          font-size: 30px;
          font-weight: 700;
          line-height: 1.1;
          word-break: break-word;
        }

        .stat-subtext {
          font-size: 13px;
          color: #94a3b8;
          margin-top: 6px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }

        .card-title {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
        }

        .pill {
          font-size: 12px;
          font-weight: 700;
          padding: 6px 10px;
          border-radius: 999px;
          background: #eff6ff;
          color: #2563eb;
          white-space: nowrap;
        }

        .business-card {
          margin-bottom: 24px;
        }

        .fields-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .field-label {
          display: block;
          margin-bottom: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
        }

        .input,
        .textarea,
        .readonly,
        .readonly-block {
          width: 100%;
          border-radius: 12px;
          font-size: 14px;
          color: #0f172a;
        }

        .input,
        .textarea {
          padding: 11px 12px;
          border: 1.5px solid #dbe3ef;
          outline: none;
          background: #fff;
          font-family: inherit;
        }

        .textarea {
          min-height: 110px;
          resize: vertical;
        }

        .readonly {
          padding: 11px 12px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .readonly-block {
          padding: 14px 12px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          line-height: 1.6;
        }

        .section-gap {
          margin-top: 18px;
        }

        .bottom-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
          gap: 16px;
        }

        .info-list {
          display: grid;
          gap: 14px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .info-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .info-label {
          font-size: 14px;
          color: #64748b;
        }

        .info-value {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          text-align: right;
        }

        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .store-profile-page {
            padding: 18px;
          }

          .fields-grid,
          .bottom-grid {
            grid-template-columns: 1fr;
          }

          .page-header h1 {
            font-size: 26px;
          }
        }

        @media (max-width: 768px) {
          .store-profile-page {
            padding: 14px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .page-header {
            flex-direction: column;
            align-items: stretch;
          }

          .header-actions {
            width: 100%;
          }

          .header-actions button {
            flex: 1;
          }

          .info-row {
            flex-direction: column;
            align-items: flex-start;
          }

          .info-value {
            text-align: left;
          }
        }

        @media (max-width: 480px) {
          .page-header h1 {
            font-size: 22px;
          }

          .page-header p {
            font-size: 14px;
          }

          .card {
            padding: 16px;
            border-radius: 14px;
          }

          .primary-btn,
          .secondary-btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="store-profile-page">
        <div className="store-profile-shell">
          <div className="page-header">
            <div>
              <h1>Store Profile</h1>
              <p>Manage your storefront identity, business information, and brand details</p>
            </div>

            {!isEditing ? (
              <button className="primary-btn" onClick={handleEdit}>
                Edit Profile
              </button>
            ) : (
              <div className="header-actions">
                <button className="secondary-btn" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="primary-btn" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="stats-grid">
            {stats.map((item) => (
              <div key={item.label} className="card">
                <div className="stat-top">
                  <span className="stat-label">{item.label}</span>
                  <div className="stat-icon" style={{ background: item.bg }}>
                    {item.icon}
                  </div>
                </div>
                <div className="stat-value" style={{ color: item.color }}>
                  {item.value}
                </div>
                <div className="stat-subtext">{item.subtext}</div>
              </div>
            ))}
          </div>

          <div className="card business-card">
            <div className="card-header">
              <h3 className="card-title">Business Information</h3>
              <span className="pill">{isEditing ? "Editing" : "Profile Overview"}</span>
            </div>

            <div className="fields-grid">
              <Field
                label="Store Name"
                value={isEditing ? draft.storeName : profile.storeName}
                editing={isEditing}
                onChange={(value) => handleChange("storeName", value)}
              />
              <Field
                label="Business Category"
                value={isEditing ? draft.businessCategory : profile.businessCategory}
                editing={isEditing}
                onChange={(value) => handleChange("businessCategory", value)}
              />
              <Field
                label="Support Email"
                value={isEditing ? draft.supportEmail : profile.supportEmail}
                editing={isEditing}
                onChange={(value) => handleChange("supportEmail", value)}
              />
              <Field
                label="Phone"
                value={isEditing ? draft.phone : profile.phone}
                editing={isEditing}
                onChange={(value) => handleChange("phone", value)}
              />
              <Field
                label="Website"
                value={isEditing ? draft.website : profile.website}
                editing={isEditing}
                onChange={(value) => handleChange("website", value)}
              />
              <Field
                label="GST Number"
                value={isEditing ? draft.gstNumber : profile.gstNumber}
                editing={isEditing}
                onChange={(value) => handleChange("gstNumber", value)}
              />
              <Field
                label="Start Year"
                value={isEditing ? draft.startYear : profile.startYear}
                editing={isEditing}
                onChange={(value) => handleChange("startYear", value)}
              />
            </div>

            <div className="section-gap">
              <Field
                label="Business Address"
                value={isEditing ? draft.address : profile.address}
                editing={isEditing}
                onChange={(value) => handleChange("address", value)}
              />
            </div>

            <div className="section-gap">
              <label className="field-label">Store Description</label>
              {isEditing ? (
                <textarea
                  className="textarea"
                  value={draft.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              ) : (
                <div className="readonly-block">{profile.description}</div>
              )}
            </div>
          </div>

          <div className="bottom-grid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Brand Summary</h3>
              </div>

              <div className="info-list">
                <InfoRow label="Public Store Name" value={profile.storeName} />
                <InfoRow label="Primary Category" value={profile.businessCategory} />
                <InfoRow label="Support Contact" value={profile.supportEmail} />
                <InfoRow label="Business Phone" value={profile.phone} />
                <InfoRow label="Website" value={profile.website} />
                <InfoRow label="Store Age" value={`${storeAgeYears} years`} />
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Store Health</h3>
              </div>

              <div className="info-list">
                <InfoRow label="Verification Status" value="Verified" valueColor="#16a34a" />
                <InfoRow label="Catalog Status" value="Healthy" valueColor="#2563eb" />
                <InfoRow label="Customer Trust Score" value="High" valueColor="#d97706" />
                <InfoRow label="Seller Tier" value="Gold" valueColor="#9333ea" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

type FieldProps = {
  label: string;
  value: string;
  editing: boolean;
  onChange: (value: string) => void;
};

function Field({ label, value, editing, onChange }: FieldProps) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {editing ? (
        <input className="input" value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <div className="readonly">{value}</div>
      )}
    </div>
  );
}

function InfoRow({
  label,
  value,
  valueColor = "#0f172a",
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className="info-value" style={{ color: valueColor }}>
        {value}
      </span>
    </div>
  );
}
