type AnalyticsDashboardPageProps = {
  title: string;
  subtitle: string;
  stats: {
    label: string;
    value: string;
    subtext: string;
    color: string;
    bg: string;
    icon: React.ReactNode;
  }[];
  chartTitle: string;
  chartBars: number[];
  chartLabels: string[];
  sideTitle: string;
  sideItems: {
    label: string;
    value: string;
    color: string;
  }[];
  tableTitle: string;
  tableRows: {
    name: string;
    meta: string;
    value: string;
    extra: string;
  }[];
};

export default function AnalyticsDashboardPage({
  title,
  subtitle,
  stats,
  chartTitle,
  chartBars,
  chartLabels,
  sideTitle,
  sideItems,
  tableTitle,
  tableRows,
}: AnalyticsDashboardPageProps) {
  const maxBarValue = Math.max(...chartBars, 1);

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

        {/* ── Chart + Side Panel ── */}
        <div className="analytics-content-grid">

          {/* Bar Chart */}
          <div className="site-card analytics-chart-card">
            <div className="analytics-card-header">
              <h3 className="analytics-card-title site-heading">{chartTitle}</h3>
              <span className="analytics-pill site-badge site-badge--brand">Last 6 Months</span>
            </div>

            <div className="analytics-chart-area">
              {chartBars.map((value, index) => {
                const height = Math.max((value / maxBarValue) * 100, 12);
                return (
                  <div key={index} className="analytics-bar-wrap">
                    <div className="analytics-bar-value site-text-brand">{value}</div>
                    <div className="analytics-bar-track">
                      <div className="analytics-bar" style={{ height: `${height}%` }} />
                    </div>
                    <div className="analytics-bar-label site-subtext">{chartLabels[index]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Side Summary */}
          <div className="site-card analytics-side-card">
            <div className="analytics-card-header">
              <h3 className="analytics-card-title site-heading">{sideTitle}</h3>
            </div>
            <div className="analytics-side-list">
              {sideItems.map((item) => (
                <div key={item.label} className="analytics-side-row">
                  <span className="analytics-side-label site-subtext">{item.label}</span>
                  <span className="analytics-side-value" style={{ color: item.color }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Table ── */}
        <div className="site-card analytics-table-card">
          <div className="analytics-card-header">
            <h3 className="analytics-card-title site-heading">{tableTitle}</h3>
          </div>
          <div className="analytics-table-list">
            {tableRows.map((row) => (
              <div key={row.name} className="analytics-table-row">
                <div>
                  <div className="analytics-row-name site-heading">{row.name}</div>
                  <div className="analytics-row-meta site-text-muted">{row.meta}</div>
                </div>
                <div className="analytics-row-right">
                  <div className="analytics-row-value site-text-brand">{row.value}</div>
                  <div className="analytics-row-extra site-subtext">{row.extra}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}