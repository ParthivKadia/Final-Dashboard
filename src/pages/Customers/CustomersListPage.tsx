import { useMemo, useState } from "react";

type CustomerType = "New" | "Repeat" | "VIP";
type RatingLevel = "Excellent" | "Good" | "Average" | "Low";

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  orders: number;
  spent: number;
  lastOrder: string;
  type: CustomerType;
  rating: number;
  ratingLevel: RatingLevel;
  status: "Active" | "Inactive";
};

type CustomersListPageProps = {
  title: string;
  subtitle: string;
  defaultFilter: "All" | "New" | "Repeat" | "Ratings";
};

const customers: Customer[] = [
  { id: 1, name: "Aarav Sharma", email: "aarav@gmail.com", phone: "+91 98765 11111", city: "Delhi", orders: 3, spent: 8499, lastOrder: "26 Mar 2026", type: "New", rating: 4.8, ratingLevel: "Excellent", status: "Active" },
  { id: 2, name: "Priya Mehta", email: "priya@gmail.com", phone: "+91 98765 22222", city: "Mumbai", orders: 12, spent: 22499, lastOrder: "24 Mar 2026", type: "Repeat", rating: 4.6, ratingLevel: "Excellent", status: "Active" },
  { id: 3, name: "Kabir Singh", email: "kabir@gmail.com", phone: "+91 98765 33333", city: "Jaipur", orders: 8, spent: 16399, lastOrder: "22 Mar 2026", type: "Repeat", rating: 4.2, ratingLevel: "Good", status: "Active" },
  { id: 4, name: "Sneha Kapoor", email: "sneha@gmail.com", phone: "+91 98765 44444", city: "Bengaluru", orders: 1, spent: 4999, lastOrder: "21 Mar 2026", type: "New", rating: 4.9, ratingLevel: "Excellent", status: "Active" },
  { id: 5, name: "Rohan Verma", email: "rohan@gmail.com", phone: "+91 98765 55555", city: "Pune", orders: 5, spent: 9999, lastOrder: "20 Mar 2026", type: "Repeat", rating: 3.9, ratingLevel: "Average", status: "Active" },
  { id: 6, name: "Ananya Rao", email: "ananya@gmail.com", phone: "+91 98765 66666", city: "Hyderabad", orders: 15, spent: 28999, lastOrder: "19 Mar 2026", type: "VIP", rating: 4.7, ratingLevel: "Excellent", status: "Active" },
  { id: 7, name: "Neel Joshi", email: "neel@gmail.com", phone: "+91 98765 77777", city: "Surat", orders: 2, spent: 2199, lastOrder: "17 Mar 2026", type: "New", rating: 3.7, ratingLevel: "Average", status: "Inactive" },
  { id: 8, name: "Diya Nair", email: "diya@gmail.com", phone: "+91 98765 88888", city: "Chennai", orders: 9, spent: 18499, lastOrder: "16 Mar 2026", type: "Repeat", rating: 4.4, ratingLevel: "Good", status: "Active" },
];

const typeBadge: Record<CustomerType, { bg: string; color: string }> = {
  New: { bg: "#eff6ff", color: "#2563eb" },
  Repeat: { bg: "#f0fdf4", color: "#16a34a" },
  VIP: { bg: "#faf5ff", color: "#9333ea" },
};

const ratingBadge: Record<RatingLevel, { bg: string; color: string }> = {
  Excellent: { bg: "#f0fdf4", color: "#16a34a" },
  Good: { bg: "#eff6ff", color: "#2563eb" },
  Average: { bg: "#fffbeb", color: "#d97706" },
  Low: { bg: "#fef2f2", color: "#dc2626" },
};

export default function CustomersListPage({
  title,
  subtitle,
  defaultFilter,
}: CustomersListPageProps) {
  const [search, setSearch] = useState("");

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const term = search.toLowerCase();

      const matchesSearch =
        customer.name.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term) ||
        customer.city.toLowerCase().includes(term) ||
        customer.phone.toLowerCase().includes(term);

      if (defaultFilter === "New") return matchesSearch && customer.type === "New";
      if (defaultFilter === "Repeat") {
        return matchesSearch && (customer.type === "Repeat" || customer.type === "VIP");
      }
      if (defaultFilter === "Ratings") return matchesSearch && customer.rating >= 4;
      return matchesSearch;
    });
  }, [search, defaultFilter]);

  const stats = [
    {
      label: "Total Customers",
      value: filteredCustomers.length,
      color: "#2563eb",
      bg: "#eff6ff",
      icon: "👥",
    },
    {
      label: "New This Month",
      value: filteredCustomers.filter((c) => c.type === "New").length,
      color: "#16a34a",
      bg: "#f0fdf4",
      icon: "🆕",
    },
    {
      label: "Repeat Customers",
      value: filteredCustomers.filter((c) => c.type === "Repeat" || c.type === "VIP").length,
      color: "#9333ea",
      bg: "#faf5ff",
      icon: "🔁",
    },
    {
      label: "Avg Rating",
      value: (
        filteredCustomers.reduce((sum, c) => sum + c.rating, 0) /
        (filteredCustomers.length || 1)
      ).toFixed(1),
      color: "#d97706",
      bg: "#fffbeb",
      icon: "⭐",
    },
  ];

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .customers-page {
          min-height: 100vh;
          padding: 24px;
          background: #f8fafc;
          font-family: 'DM Sans', sans-serif;
        }

        .customers-shell {
          max-width: 1400px;
          margin: 0 auto;
        }

        .customers-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .customers-heading h1 {
          margin: 0;
          font-size: 30px;
          line-height: 1.2;
          color: #0f172a;
          font-weight: 700;
        }

        .customers-heading p {
          margin: 6px 0 0;
          font-size: 15px;
          color: #64748b;
        }

        .customers-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .primary-btn,
        .secondary-btn,
        .small-btn,
        .small-btn-muted {
          border: none;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
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

        .primary-btn:hover,
        .secondary-btn:hover,
        .small-btn:hover,
        .small-btn-muted:hover {
          transform: translateY(-1px);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: #fff;
          border-radius: 18px;
          padding: 20px;
          border: 1px solid #edf2f7;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
          min-width: 0;
        }

        .stat-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
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

        .filters-card {
          background: #fff;
          border-radius: 18px;
          padding: 16px;
          border: 1px solid #edf2f7;
          margin-bottom: 16px;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
        }

        .filters-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .input {
          width: 100%;
          height: 46px;
          border-radius: 12px;
          border: 1.5px solid #dbe4f0;
          background: #f8fafc;
          color: #334155;
          font-size: 14px;
          padding: 0 14px;
          outline: none;
          font-family: inherit;
        }

        .table-card {
          background: #fff;
          border-radius: 18px;
          border: 1px solid #edf2f7;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
        }

        .table-wrap {
          width: 100%;
          overflow-x: auto;
        }

        .customers-table {
          width: 100%;
          min-width: 960px;
          border-collapse: collapse;
        }

        .customers-table thead tr {
          background: #f8fafc;
        }

        .customers-table th {
          padding: 14px 16px;
          text-align: left;
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          white-space: nowrap;
        }

        .customers-table td {
          padding: 16px;
          border-top: 1px solid #f1f5f9;
          vertical-align: middle;
        }

        .customer-name {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
        }

        .customer-email {
          margin-top: 3px;
          font-size: 12px;
          color: #94a3b8;
        }

        .muted-text {
          font-size: 13px;
          color: #64748b;
        }

        .amount-text {
          font-size: 14px;
          font-weight: 700;
          color: #2563eb;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 11px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }

        .status-text {
          font-size: 13px;
          font-weight: 700;
        }

        .status-active {
          color: #16a34a;
        }

        .status-inactive {
          color: #dc2626;
        }

        .mobile-list {
          display: none;
          padding: 16px;
          gap: 14px;
        }

        .mobile-card {
          border: 1px solid #eef2f7;
          border-radius: 16px;
          padding: 16px;
          background: #fff;
        }

        .mobile-top {
          margin-bottom: 14px;
        }

        .mobile-meta {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 14px;
        }

        .mobile-meta-item {
          min-width: 0;
        }

        .mobile-meta-label {
          font-size: 11px;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 4px;
          font-weight: 700;
        }

        .mobile-meta-value {
          font-size: 13px;
          color: #0f172a;
          font-weight: 600;
          word-break: break-word;
        }

        .mobile-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 14px;
        }

        .mobile-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .small-btn {
          background: #eff6ff;
          color: #2563eb;
          border-radius: 8px;
          padding: 7px 12px;
          font-size: 12px;
          font-weight: 700;
        }

        .small-btn-muted {
          background: #f8fafc;
          color: #475569;
          border-radius: 8px;
          padding: 7px 12px;
          font-size: 12px;
          font-weight: 700;
        }

        .empty-state {
          padding: 56px 20px;
          text-align: center;
          color: #94a3b8;
        }

        .empty-icon {
          font-size: 42px;
          margin-bottom: 10px;
        }

        .empty-title {
          font-size: 16px;
          font-weight: 700;
          color: #334155;
        }

        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .customers-page {
            padding: 18px;
          }

          .customers-heading h1 {
            font-size: 26px;
          }
        }

        @media (max-width: 768px) {
          .customers-page {
            padding: 14px;
          }

          .customers-header {
            flex-direction: column;
            align-items: stretch;
          }

          .customers-actions {
            width: 100%;
          }

          .customers-actions button {
            flex: 1;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .table-wrap {
            display: none;
          }

          .mobile-list {
            display: grid;
          }
        }

        @media (max-width: 480px) {
          .customers-heading h1 {
            font-size: 22px;
          }

          .customers-heading p {
            font-size: 14px;
          }

          .mobile-meta {
            grid-template-columns: 1fr;
          }

          .primary-btn,
          .secondary-btn {
            width: 100%;
          }

          .stat-card,
          .filters-card,
          .mobile-card {
            border-radius: 14px;
          }
        }
      `}</style>

      <div className="customers-page">
        <div className="customers-shell">
          <div className="customers-header">
            <div className="customers-heading">
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>

            <div className="customers-actions">
              <button className="secondary-btn">Export</button>
              <button className="primary-btn">+ Add Customer</button>
            </div>
          </div>

          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <div className="stat-top">
                  <span className="stat-label">{stat.label}</span>
                  <div className="stat-icon" style={{ background: stat.bg }}>
                    {stat.icon}
                  </div>
                </div>
                <div className="stat-value" style={{ color: stat.color }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          <div className="filters-card">
            <div className="filters-row">
              <input
                className="input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customer, email, phone or city..."
              />
            </div>
          </div>

          <div className="table-card">
            {filteredCustomers.length > 0 && (
              <>
                <div className="table-wrap">
                  <table className="customers-table">
                    <thead>
                      <tr>
                        {["Customer", "Phone", "City", "Orders", "Spent", "Type", "Rating", "Status", "Last Order", "Actions"].map((head) => (
                          <th key={head}>{head}</th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {filteredCustomers.map((customer) => (
                        <tr key={customer.id}>
                          <td>
                            <div className="customer-name">{customer.name}</div>
                            <div className="customer-email">{customer.email}</div>
                          </td>
                          <td className="muted-text">{customer.phone}</td>
                          <td className="muted-text">{customer.city}</td>
                          <td className="muted-text">{customer.orders}</td>
                          <td className="amount-text">₹{customer.spent.toLocaleString()}</td>
                          <td>
                            <span
                              className="badge"
                              style={{
                                background: typeBadge[customer.type].bg,
                                color: typeBadge[customer.type].color,
                              }}
                            >
                              {customer.type}
                            </span>
                          </td>
                          <td>
                            <span
                              className="badge"
                              style={{
                                background: ratingBadge[customer.ratingLevel].bg,
                                color: ratingBadge[customer.ratingLevel].color,
                              }}
                            >
                              {customer.rating} ★
                            </span>
                          </td>
                          <td>
                            <span
                              className={`status-text ${
                                customer.status === "Active"
                                  ? "status-active"
                                  : "status-inactive"
                              }`}
                            >
                              {customer.status}
                            </span>
                          </td>
                          <td className="muted-text">{customer.lastOrder}</td>
                          <td>
                            <div className="mobile-actions">
                              <button className="small-btn">View</button>
                              <button className="small-btn-muted">Message</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mobile-list">
                  {filteredCustomers.map((customer) => (
                    <div key={customer.id} className="mobile-card">
                      <div className="mobile-top">
                        <div className="customer-name">{customer.name}</div>
                        <div className="customer-email">{customer.email}</div>
                      </div>

                      <div className="mobile-meta">
                        <div className="mobile-meta-item">
                          <div className="mobile-meta-label">Phone</div>
                          <div className="mobile-meta-value">{customer.phone}</div>
                        </div>
                        <div className="mobile-meta-item">
                          <div className="mobile-meta-label">City</div>
                          <div className="mobile-meta-value">{customer.city}</div>
                        </div>
                        <div className="mobile-meta-item">
                          <div className="mobile-meta-label">Orders</div>
                          <div className="mobile-meta-value">{customer.orders}</div>
                        </div>
                        <div className="mobile-meta-item">
                          <div className="mobile-meta-label">Spent</div>
                          <div className="mobile-meta-value">₹{customer.spent.toLocaleString()}</div>
                        </div>
                        <div className="mobile-meta-item">
                          <div className="mobile-meta-label">Last Order</div>
                          <div className="mobile-meta-value">{customer.lastOrder}</div>
                        </div>
                        <div className="mobile-meta-item">
                          <div className="mobile-meta-label">Status</div>
                          <div
                            className={`mobile-meta-value ${
                              customer.status === "Active"
                                ? "status-active"
                                : "status-inactive"
                            }`}
                          >
                            {customer.status}
                          </div>
                        </div>
                      </div>

                      <div className="mobile-badges">
                        <span
                          className="badge"
                          style={{
                            background: typeBadge[customer.type].bg,
                            color: typeBadge[customer.type].color,
                          }}
                        >
                          {customer.type}
                        </span>

                        <span
                          className="badge"
                          style={{
                            background: ratingBadge[customer.ratingLevel].bg,
                            color: ratingBadge[customer.ratingLevel].color,
                          }}
                        >
                          {customer.rating} ★
                        </span>
                      </div>

                      <div className="mobile-actions">
                        <button className="small-btn">View</button>
                        <button className="small-btn-muted">Message</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {filteredCustomers.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <div className="empty-title">No customers found</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}


// import { useMemo, useState, type CSSProperties } from "react";

// type CustomerType = "New" | "Repeat" | "VIP";
// type RatingLevel = "Excellent" | "Good" | "Average" | "Low";

// type Customer = {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
//   city: string;
//   orders: number;
//   spent: number;
//   lastOrder: string;
//   type: CustomerType;
//   rating: number;
//   ratingLevel: RatingLevel;
//   status: "Active" | "Inactive";
// };

// type CustomersListPageProps = {
//   title: string;
//   subtitle: string;
//   defaultFilter: "All" | "New" | "Repeat" | "Ratings";
// };

// const customers: Customer[] = [
//   { id: 1, name: "Aarav Sharma", email: "aarav@gmail.com", phone: "+91 98765 11111", city: "Delhi", orders: 3, spent: 8499, lastOrder: "26 Mar 2026", type: "New", rating: 4.8, ratingLevel: "Excellent", status: "Active" },
//   { id: 2, name: "Priya Mehta", email: "priya@gmail.com", phone: "+91 98765 22222", city: "Mumbai", orders: 12, spent: 22499, lastOrder: "24 Mar 2026", type: "Repeat", rating: 4.6, ratingLevel: "Excellent", status: "Active" },
//   { id: 3, name: "Kabir Singh", email: "kabir@gmail.com", phone: "+91 98765 33333", city: "Jaipur", orders: 8, spent: 16399, lastOrder: "22 Mar 2026", type: "Repeat", rating: 4.2, ratingLevel: "Good", status: "Active" },
//   { id: 4, name: "Sneha Kapoor", email: "sneha@gmail.com", phone: "+91 98765 44444", city: "Bengaluru", orders: 1, spent: 4999, lastOrder: "21 Mar 2026", type: "New", rating: 4.9, ratingLevel: "Excellent", status: "Active" },
//   { id: 5, name: "Rohan Verma", email: "rohan@gmail.com", phone: "+91 98765 55555", city: "Pune", orders: 5, spent: 9999, lastOrder: "20 Mar 2026", type: "Repeat", rating: 3.9, ratingLevel: "Average", status: "Active" },
//   { id: 6, name: "Ananya Rao", email: "ananya@gmail.com", phone: "+91 98765 66666", city: "Hyderabad", orders: 15, spent: 28999, lastOrder: "19 Mar 2026", type: "VIP", rating: 4.7, ratingLevel: "Excellent", status: "Active" },
//   { id: 7, name: "Neel Joshi", email: "neel@gmail.com", phone: "+91 98765 77777", city: "Surat", orders: 2, spent: 2199, lastOrder: "17 Mar 2026", type: "New", rating: 3.7, ratingLevel: "Average", status: "Inactive" },
//   { id: 8, name: "Diya Nair", email: "diya@gmail.com", phone: "+91 98765 88888", city: "Chennai", orders: 9, spent: 18499, lastOrder: "16 Mar 2026", type: "Repeat", rating: 4.4, ratingLevel: "Good", status: "Active" },
// ];

// const typeBadge: Record<CustomerType, { bg: string; color: string }> = {
//   New: { bg: "#eff6ff", color: "#2563eb" },
//   Repeat: { bg: "#f0fdf4", color: "#16a34a" },
//   VIP: { bg: "#faf5ff", color: "#9333ea" },
// };

// const ratingBadge: Record<RatingLevel, { bg: string; color: string }> = {
//   Excellent: { bg: "#f0fdf4", color: "#16a34a" },
//   Good: { bg: "#eff6ff", color: "#2563eb" },
//   Average: { bg: "#fffbeb", color: "#d97706" },
//   Low: { bg: "#fef2f2", color: "#dc2626" },
// };

// export default function CustomersListPage({
//   title,
//   subtitle,
//   defaultFilter,
// }: CustomersListPageProps) {
//   const [search, setSearch] = useState("");

//   const filteredCustomers = useMemo(() => {
//     return customers.filter((customer) => {
//       const matchesSearch =
//         customer.name.toLowerCase().includes(search.toLowerCase()) ||
//         customer.email.toLowerCase().includes(search.toLowerCase()) ||
//         customer.city.toLowerCase().includes(search.toLowerCase());

//       if (defaultFilter === "New") return matchesSearch && customer.type === "New";
//       if (defaultFilter === "Repeat") return matchesSearch && (customer.type === "Repeat" || customer.type === "VIP");
//       if (defaultFilter === "Ratings") return matchesSearch && customer.rating >= 4;
//       return matchesSearch;
//     });
//   }, [search, defaultFilter]);

//   const stats = [
//     {
//       label: "Total Customers",
//       value: filteredCustomers.length,
//       color: "#2563eb",
//       bg: "#eff6ff",
//       icon: "👥",
//     },
//     {
//       label: "New This Month",
//       value: filteredCustomers.filter((c) => c.type === "New").length,
//       color: "#16a34a",
//       bg: "#f0fdf4",
//       icon: "🆕",
//     },
//     {
//       label: "Repeat Customers",
//       value: filteredCustomers.filter((c) => c.type === "Repeat" || c.type === "VIP").length,
//       color: "#9333ea",
//       bg: "#faf5ff",
//       icon: "🔁",
//     },
//     {
//       label: "Avg Rating",
//       value: (
//         filteredCustomers.reduce((sum, c) => sum + c.rating, 0) /
//           (filteredCustomers.length || 1)
//       ).toFixed(1),
//       color: "#d97706",
//       bg: "#fffbeb",
//       icon: "⭐",
//     },
//   ];

//   return (
//     <div style={{ padding: "28px", background: "#f8fafc", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", gap: "16px", flexWrap: "wrap" }}>
//         <div>
//           <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#0f172a", margin: 0 }}>{title}</h1>
//           <p style={{ fontSize: "14px", color: "#64748b", margin: "4px 0 0" }}>{subtitle}</p>
//         </div>

//         <div style={{ display: "flex", gap: "10px" }}>
//           <button style={secondaryButtonStyle}>Export</button>
//           <button style={primaryButtonStyle}>+ Add Customer</button>
//         </div>
//       </div>

//       <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
//         {stats.map((stat) => (
//           <div key={stat.label} style={statCardStyle}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
//               <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}>{stat.label}</span>
//               <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 {stat.icon}
//               </div>
//             </div>
//             <div style={{ fontSize: "28px", fontWeight: 700, color: stat.color }}>{stat.value}</div>
//           </div>
//         ))}
//       </div>

//       <div style={filterBarStyle}>
//         <input
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search customer, email or city..."
//           style={inputStyle}
//         />
//       </div>

//       <div style={tableCardStyle}>
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr style={{ background: "#f8fafc" }}>
//               {["Customer", "Phone", "City", "Orders", "Spent", "Type", "Rating", "Status", "Last Order"].map((head) => (
//                 <th
//                   key={head}
//                   style={{
//                     padding: "14px 16px",
//                     textAlign: "left",
//                     fontSize: "11px",
//                     fontWeight: 700,
//                     color: "#94a3b8",
//                     textTransform: "uppercase",
//                     letterSpacing: "0.06em",
//                   }}
//                 >
//                   {head}
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           <tbody>
//             {filteredCustomers.map((customer) => (
//               <tr key={customer.id} style={{ borderTop: "1px solid #f1f5f9" }}>
//                 <td style={tdStyle}>
//                   <div>
//                     <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{customer.name}</div>
//                     <div style={{ fontSize: "12px", color: "#94a3b8" }}>{customer.email}</div>
//                   </div>
//                 </td>
//                 <td style={tdStyle}>{customer.phone}</td>
//                 <td style={tdStyle}>{customer.city}</td>
//                 <td style={tdStyle}>{customer.orders}</td>
//                 <td style={{ ...tdStyle, fontWeight: 700, color: "#2563eb" }}>₹{customer.spent.toLocaleString()}</td>
//                 <td style={tdStyle}>
//                   <span style={{ background: typeBadge[customer.type].bg, color: typeBadge[customer.type].color, padding: "5px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 700 }}>
//                     {customer.type}
//                   </span>
//                 </td>
//                 <td style={tdStyle}>
//                   <span style={{ background: ratingBadge[customer.ratingLevel].bg, color: ratingBadge[customer.ratingLevel].color, padding: "5px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 700 }}>
//                     {customer.rating} ★
//                   </span>
//                 </td>
//                 <td style={tdStyle}>
//                   <span style={{ color: customer.status === "Active" ? "#16a34a" : "#dc2626", fontWeight: 700 }}>
//                     {customer.status}
//                   </span>
//                 </td>
//                 <td style={tdStyle}>{customer.lastOrder}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {filteredCustomers.length === 0 && (
//           <div style={{ padding: "56px", textAlign: "center", color: "#94a3b8" }}>
//             <div style={{ fontSize: "42px", marginBottom: "10px" }}>👥</div>
//             <div style={{ fontSize: "16px", fontWeight: 700 }}>No customers found</div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// const primaryButtonStyle: CSSProperties = {
//   padding: "10px 18px",
//   borderRadius: "10px",
//   border: "none",
//   background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
//   color: "#fff",
//   fontSize: "14px",
//   fontWeight: 600,
//   cursor: "pointer",
// };

// const secondaryButtonStyle: CSSProperties = {
//   padding: "10px 16px",
//   borderRadius: "10px",
//   border: "1.5px solid #e2e8f0",
//   background: "#fff",
//   color: "#374151",
//   fontSize: "14px",
//   fontWeight: 500,
//   cursor: "pointer",
// };

// const statCardStyle: CSSProperties = {
//   background: "#fff",
//   borderRadius: "14px",
//   padding: "20px",
//   border: "1px solid #f1f5f9",
//   boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
// };

// const filterBarStyle: CSSProperties = {
//   background: "#fff",
//   borderRadius: "14px",
//   padding: "16px 20px",
//   border: "1px solid #f1f5f9",
//   marginBottom: "20px",
// };

// const inputStyle: CSSProperties = {
//   width: "100%",
//   padding: "10px 14px",
//   borderRadius: "9px",
//   border: "1.5px solid #e2e8f0",
//   fontSize: "13px",
//   color: "#374151",
//   outline: "none",
//   background: "#f8fafc",
//   boxSizing: "border-box",
// };

// const tableCardStyle: CSSProperties = {
//   background: "#fff",
//   borderRadius: "14px",
//   border: "1px solid #f1f5f9",
//   overflow: "hidden",
//   boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
// };

// const tdStyle: CSSProperties = {
//   padding: "14px 16px",
//   fontSize: "13px",
//   color: "#64748b",
// };
