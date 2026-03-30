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
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .settings-page {
          min-height: 100vh;
          padding: 24px;
          background: #f8fafc;
          font-family: 'DM Sans', sans-serif;
        }

        .settings-shell {
          max-width: 1400px;
          margin: 0 auto;
        }

        .settings-header {
          margin-bottom: 24px;
        }

        .settings-header h1 {
          margin: 0;
          font-size: 30px;
          line-height: 1.2;
          font-weight: 700;
          color: #0f172a;
        }

        .settings-header p {
          margin: 6px 0 0;
          font-size: 15px;
          color: #64748b;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .content-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
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
          flex-wrap: wrap;
          margin-bottom: 16px;
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

        .info-list,
        .detail-list {
          display: grid;
          gap: 12px;
        }

        .info-row,
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .info-row:last-child,
        .detail-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .info-label {
          font-size: 14px;
          color: #475569;
          font-weight: 500;
        }

        .info-value {
          font-size: 16px;
          font-weight: 700;
        }

        .detail-name {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
        }

        .detail-meta {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 4px;
        }

        .detail-right {
          text-align: right;
          flex-shrink: 0;
        }

        .detail-value {
          font-size: 14px;
          font-weight: 700;
          color: #2563eb;
        }

        .detail-extra {
          font-size: 12px;
          color: #64748b;
          margin-top: 4px;
        }

        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .settings-page {
            padding: 18px;
          }

          .content-grid {
            grid-template-columns: 1fr;
          }

          .settings-header h1 {
            font-size: 26px;
          }
        }

        @media (max-width: 768px) {
          .settings-page {
            padding: 14px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .info-row,
          .detail-row {
            flex-direction: column;
            align-items: flex-start;
          }

          .detail-right {
            text-align: left;
          }
        }

        @media (max-width: 480px) {
          .settings-header h1 {
            font-size: 22px;
          }

          .settings-header p {
            font-size: 14px;
          }

          .card {
            padding: 16px;
            border-radius: 14px;
          }
        }
      `}</style>

      <div className="settings-page">
        <div className="settings-shell">
          <div className="settings-header">
            <h1>{title}</h1>
            <p>{subtitle}</p>
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

          <div className="content-grid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">{sideTitle}</h3>
                <span className="pill">Overview</span>
              </div>

              <div className="info-list">
                {sideItems.map((item) => (
                  <div key={item.label} className="info-row">
                    <span className="info-label">{item.label}</span>
                    <span className="info-value" style={{ color: item.color }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">{tableTitle}</h3>
                <span className="pill">Details</span>
              </div>

              <div className="detail-list">
                {tableRows.map((row) => (
                  <div key={row.name} className="detail-row">
                    <div>
                      <div className="detail-name">{row.name}</div>
                      <div className="detail-meta">{row.meta}</div>
                    </div>
                    <div className="detail-right">
                      <div className="detail-value">{row.value}</div>
                      <div className="detail-extra">{row.extra}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


// import { type CSSProperties } from "react";

// type Stat = {
//   label: string;
//   value: string;
//   subtext: string;
//   color: string;
//   bg: string;
//   icon: string;
// };

// type SideItem = {
//   label: string;
//   value: string;
//   color: string;
// };

// type Row = {
//   name: string;
//   meta: string;
//   value: string;
//   extra: string;
// };

// type SettingsPageProps = {
//   title: string;
//   subtitle: string;
//   stats: Stat[];
//   sideTitle: string;
//   sideItems: SideItem[];
//   tableTitle: string;
//   tableRows: Row[];
// };

// export default function SettingsPage({
//   title,
//   subtitle,
//   stats,
//   sideTitle,
//   sideItems,
//   tableTitle,
//   tableRows,
// }: SettingsPageProps) {
//   return (
//     <div style={pageStyle}>
//       <div style={{ marginBottom: 24 }}>
//         <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#0f172a" }}>{title}</h1>
//         <p style={{ margin: "4px 0 0", fontSize: 14, color: "#64748b" }}>{subtitle}</p>
//       </div>

//       <div style={responsiveGrid4}>
//         {stats.map((item) => (
//           <div key={item.label} style={cardStyle}>
//             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
//               <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{item.label}</span>
//               <div
//                 style={{
//                   width: 40,
//                   height: 40,
//                   borderRadius: 12,
//                   background: item.bg,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontSize: 18,
//                 }}
//               >
//                 {item.icon}
//               </div>
//             </div>
//             <div style={{ fontSize: 28, fontWeight: 700, color: item.color }}>{item.value}</div>
//             <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 6 }}>{item.subtext}</div>
//           </div>
//         ))}
//       </div>

//       <div style={responsiveGrid2}>
//         <div style={cardStyle}>
//           <div style={headerStyle}>
//             <h3 style={titleStyle}>{sideTitle}</h3>
//             <span style={pillStyle}>Overview</span>
//           </div>

//           <div style={{ display: "grid", gap: 14 }}>
//             {sideItems.map((item) => (
//               <div key={item.label} style={infoRowStyle}>
//                 <span style={{ fontSize: 14, color: "#475569", fontWeight: 500 }}>{item.label}</span>
//                 <span style={{ fontSize: 16, fontWeight: 700, color: item.color }}>{item.value}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div style={cardStyle}>
//           <div style={headerStyle}>
//             <h3 style={titleStyle}>{tableTitle}</h3>
//             <span style={pillStyle}>Details</span>
//           </div>

//           <div style={{ display: "grid", gap: 12 }}>
//             {tableRows.map((row) => (
//               <div key={row.name} style={detailRowStyle}>
//                 <div>
//                   <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{row.name}</div>
//                   <div style={{ fontSize: 12, color: "#94a3b8" }}>{row.meta}</div>
//                 </div>
//                 <div style={{ textAlign: "right" }}>
//                   <div style={{ fontSize: 14, fontWeight: 700, color: "#2563eb" }}>{row.value}</div>
//                   <div style={{ fontSize: 12, color: "#64748b" }}>{row.extra}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// const pageStyle: CSSProperties = {
//   padding: "clamp(16px, 3vw, 28px)",
//   background: "#f8fafc",
//   minHeight: "100vh",
//   fontFamily: "'DM Sans', sans-serif",
// };

// const responsiveGrid4: CSSProperties = {
//   display: "grid",
//   gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
//   gap: 16,
//   marginBottom: 24,
// };

// const responsiveGrid2: CSSProperties = {
//   display: "grid",
//   gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
//   gap: 16,
// };

// const cardStyle: CSSProperties = {
//   background: "#fff",
//   borderRadius: 16,
//   padding: 20,
//   border: "1px solid #e2e8f0",
//   boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
//   minWidth: 0,
// };

// const headerStyle: CSSProperties = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   gap: 12,
//   flexWrap: "wrap",
//   marginBottom: 16,
// };

// const titleStyle: CSSProperties = {
//   margin: 0,
//   fontSize: 18,
//   fontWeight: 700,
//   color: "#0f172a",
// };

// const pillStyle: CSSProperties = {
//   fontSize: 12,
//   fontWeight: 600,
//   padding: "6px 10px",
//   borderRadius: 999,
//   background: "#eff6ff",
//   color: "#2563eb",
// };

// const infoRowStyle: CSSProperties = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   gap: 12,
//   padding: "12px 0",
//   borderBottom: "1px solid #f1f5f9",
// };

// const detailRowStyle: CSSProperties = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   gap: 12,
//   padding: "12px 0",
//   borderBottom: "1px solid #f1f5f9",
// };
