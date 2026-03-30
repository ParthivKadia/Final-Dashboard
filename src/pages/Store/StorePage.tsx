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

type StorePageProps = {
  title: string;
  subtitle: string;
  stats: Stat[];
  chartTitle: string;
  chartBars: number[];
  chartLabels: string[];
  sideTitle: string;
  sideItems: SideItem[];
  tableTitle: string;
  tableRows: Row[];
};

export default function StorePage({
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
}: StorePageProps) {
  const maxBarValue = Math.max(...chartBars, 1);

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .store-page {
          min-height: 100vh;
          padding: 24px;
          background: #f8fafc;
          font-family: 'DM Sans', sans-serif;
        }

        .store-shell {
          max-width: 1400px;
          margin: 0 auto;
        }

        .store-header {
          margin-bottom: 24px;
        }

        .store-header h1 {
          margin: 0;
          font-size: 30px;
          line-height: 1.2;
          font-weight: 700;
          color: #0f172a;
        }

        .store-header p {
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

        .content-grid {
          display: grid;
          grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
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

        .chart-area {
          height: 280px;
          display: flex;
          align-items: flex-end;
          gap: 12px;
          padding-top: 16px;
          overflow-x: auto;
        }

        .chart-bar-wrap {
          flex: 1;
          min-width: 52px;
          text-align: center;
        }

        .chart-value {
          font-size: 12px;
          font-weight: 700;
          color: #2563eb;
          margin-bottom: 8px;
        }

        .chart-track {
          height: 220px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .chart-bar {
          width: 100%;
          max-width: 56px;
          min-height: 18px;
          border-radius: 12px 12px 8px 8px;
          background: linear-gradient(180deg, #60a5fa, #2563eb 55%, #1d4ed8);
          box-shadow: 0 10px 22px rgba(37, 99, 235, 0.22);
        }

        .chart-label {
          margin-top: 10px;
          font-size: 12px;
          color: #64748b;
          white-space: nowrap;
        }

        .side-list {
          display: grid;
          gap: 14px;
        }

        .side-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f1f5f9;
        }

        .side-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .side-label {
          font-size: 14px;
          color: #475569;
          font-weight: 500;
        }

        .side-value {
          font-size: 17px;
          font-weight: 700;
        }

        .table-list {
          display: grid;
          gap: 12px;
        }

        .table-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 14px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .table-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .row-name {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
        }

        .row-meta {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 4px;
        }

        .row-right {
          text-align: right;
          flex-shrink: 0;
        }

        .row-value {
          font-size: 14px;
          font-weight: 700;
          color: #2563eb;
        }

        .row-extra {
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
          .store-page {
            padding: 18px;
          }

          .content-grid {
            grid-template-columns: 1fr;
          }

          .store-header h1 {
            font-size: 26px;
          }
        }

        @media (max-width: 768px) {
          .store-page {
            padding: 14px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .table-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .row-right {
            text-align: left;
          }

          .chart-area {
            gap: 10px;
          }
        }

        @media (max-width: 480px) {
          .store-header h1 {
            font-size: 22px;
          }

          .store-header p {
            font-size: 14px;
          }

          .card {
            padding: 16px;
            border-radius: 14px;
          }

          .chart-bar-wrap {
            min-width: 46px;
          }

          .chart-track {
            height: 180px;
          }

          .chart-area {
            height: 230px;
          }
        }
      `}</style>

      <div className="store-page">
        <div className="store-shell">
          <div className="store-header">
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
                <h3 className="card-title">{chartTitle}</h3>
                <span className="pill">Overview</span>
              </div>

              <div className="chart-area">
                {chartBars.map((value, index) => {
                  const height = Math.max((value / maxBarValue) * 100, 12);

                  return (
                    <div key={index} className="chart-bar-wrap">
                      <div className="chart-value">{value}</div>
                      <div className="chart-track">
                        <div className="chart-bar" style={{ height: `${height}%` }} />
                      </div>
                      <div className="chart-label">{chartLabels[index]}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">{sideTitle}</h3>
              </div>

              <div className="side-list">
                {sideItems.map((item) => (
                  <div key={item.label} className="side-row">
                    <span className="side-label">{item.label}</span>
                    <span className="side-value" style={{ color: item.color }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">{tableTitle}</h3>
            </div>

            <div className="table-list">
              {tableRows.map((row) => (
                <div key={row.name} className="table-row">
                  <div>
                    <div className="row-name">{row.name}</div>
                    <div className="row-meta">{row.meta}</div>
                  </div>
                  <div className="row-right">
                    <div className="row-value">{row.value}</div>
                    <div className="row-extra">{row.extra}</div>
                  </div>
                </div>
              ))}
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

// type StorePageProps = {
//   title: string;
//   subtitle: string;
//   stats: Stat[];
//   chartTitle: string;
//   chartBars: number[];
//   chartLabels: string[];
//   sideTitle: string;
//   sideItems: SideItem[];
//   tableTitle: string;
//   tableRows: Row[];
// };

// export default function StorePage({
//   title,
//   subtitle,
//   stats,
//   chartTitle,
//   chartBars,
//   chartLabels,
//   sideTitle,
//   sideItems,
//   tableTitle,
//   tableRows,
// }: StorePageProps) {
//   return (
//     <div style={{ padding: "28px", background: "#f8fafc", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
//       <div style={{ marginBottom: 24 }}>
//         <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#0f172a" }}>{title}</h1>
//         <p style={{ margin: "4px 0 0", fontSize: 14, color: "#64748b" }}>{subtitle}</p>
//       </div>

//       <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
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

//       <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 24 }}>
//         <div style={cardStyle}>
//           <div style={headerStyle}>
//             <h3 style={titleStyle}>{chartTitle}</h3>
//             <span style={pillStyle}>Overview</span>
//           </div>

//           <div style={{ display: "grid", gridTemplateColumns: `repeat(${chartBars.length}, 1fr)`, gap: 12, alignItems: "end", height: 240, paddingTop: 16 }}>
//             {chartBars.map((value, index) => (
//               <div key={index} style={{ textAlign: "center" }}>
//                 <div
//                   style={{
//                     height: `${value * 2.2}px`,
//                     background: "linear-gradient(180deg, #3b82f6, #1d4ed8)",
//                     borderRadius: 10,
//                     marginBottom: 10,
//                   }}
//                 />
//                 <div style={{ fontSize: 12, color: "#64748b" }}>{chartLabels[index]}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div style={cardStyle}>
//           <div style={headerStyle}>
//             <h3 style={titleStyle}>{sideTitle}</h3>
//           </div>

//           <div style={{ display: "grid", gap: 14 }}>
//             {sideItems.map((item) => (
//               <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                 <span style={{ fontSize: 14, color: "#475569", fontWeight: 500 }}>{item.label}</span>
//                 <span style={{ fontSize: 17, fontWeight: 700, color: item.color }}>{item.value}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div style={cardStyle}>
//         <div style={headerStyle}>
//           <h3 style={titleStyle}>{tableTitle}</h3>
//         </div>

//         <div style={{ display: "grid", gap: 12 }}>
//           {tableRows.map((row) => (
//             <div key={row.name} style={rowStyle}>
//               <div>
//                 <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{row.name}</div>
//                 <div style={{ fontSize: 12, color: "#94a3b8" }}>{row.meta}</div>
//               </div>
//               <div style={{ textAlign: "right" }}>
//                 <div style={{ fontSize: 14, fontWeight: 700, color: "#2563eb" }}>{row.value}</div>
//                 <div style={{ fontSize: 12, color: "#64748b" }}>{row.extra}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// const cardStyle: CSSProperties = {
//   background: "#fff",
//   borderRadius: 16,
//   padding: 20,
//   border: "1px solid #e2e8f0",
//   boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
// };

// const headerStyle: CSSProperties = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
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

// const rowStyle: CSSProperties = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   padding: "12px 0",
//   borderBottom: "1px solid #f1f5f9",
// };
