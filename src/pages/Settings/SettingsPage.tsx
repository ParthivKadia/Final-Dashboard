type Stat = {
  label: string;
  value: string;
  subtext: string;
  color: string;
  bg: string;
  icon: string;
};

type SideItem = {
  label: string;
  value: string;
  color: string;
};

type Row = {
  name: string;
  meta: string;
  value: string;
  extra: string;
};

type SettingsPageProps = {
  title: string;
  subtitle: string;
  stats: Stat[];
  sideTitle: string;
  sideItems: SideItem[];
  tableTitle: string;
  tableRows: Row[];
};

export default function SettingsPage({
  title,
  subtitle,
  stats,
  sideTitle,
  sideItems,
  tableTitle,
  tableRows,
}: SettingsPageProps) {
  return (
    <div className="site-page site-page-padding">
      <div className="analytics-shell">

        {/* ── Header ── */}
        <div className="site-page-header" style={{ marginBottom: 24 }}>
          <div>
            <h1 className="site-page-title">{title}</h1>
            <p className="site-page-subtitle">{subtitle}</p>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="analytics-stats-grid">
          {stats.map((item) => (
            <div key={item.label} className="site-card analytics-stat-card">
              <div className="analytics-stat-top">
                <span className="analytics-stat-label site-subtext">{item.label}</span>
                <div className="analytics-stat-icon" style={{ background: item.bg }}>
                  {item.icon}
                </div>
              </div>
              <div className="analytics-stat-value" style={{ color: item.color }}>
                {item.value}
              </div>
              <div className="analytics-stat-subtext site-text-muted">{item.subtext}</div>
            </div>
          ))}
        </div>

        {/* ── Two-col content grid ── */}
        <div className="settings-content-grid">

          {/* Overview panel */}
          <div className="site-card settings-panel">
            <div className="analytics-card-header">
              <h3 className="analytics-card-title site-heading">{sideTitle}</h3>
              <span className="analytics-pill site-badge site-badge--brand">Overview</span>
            </div>
            <div className="settings-info-list">
              {sideItems.map((item) => (
                <div key={item.label} className="settings-info-row">
                  <span className="settings-info-label site-subtext">{item.label}</span>
                  <span className="settings-info-value" style={{ color: item.color }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Details panel */}
          <div className="site-card settings-panel">
            <div className="analytics-card-header">
              <h3 className="analytics-card-title site-heading">{tableTitle}</h3>
              <span className="analytics-pill site-badge site-badge--brand">Details</span>
            </div>
            <div className="settings-detail-list">
              {tableRows.map((row) => (
                <div key={row.name} className="settings-detail-row">
                  <div>
                    <div className="settings-detail-name site-heading">{row.name}</div>
                    <div className="settings-detail-meta site-text-muted">{row.meta}</div>
                  </div>
                  <div className="settings-detail-right">
                    <div className="settings-detail-value site-text-brand">{row.value}</div>
                    <div className="settings-detail-extra site-subtext">{row.extra}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}