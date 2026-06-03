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

// Maps to site-theme CSS classes (defined in site-theme.css section 51)
const typeClass: Record<CustomerType, string> = {
  New:    "cust-type--new",
  Repeat: "cust-type--repeat",
  VIP:    "cust-type--vip",
};

const ratingClass: Record<RatingLevel, string> = {
  Excellent: "cust-rating--excellent",
  Good:      "cust-rating--good",
  Average:   "cust-rating--average",
  Low:       "cust-rating--low",
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

      if (defaultFilter === "New")    return matchesSearch && customer.type === "New";
      if (defaultFilter === "Repeat") return matchesSearch && (customer.type === "Repeat" || customer.type === "VIP");
      if (defaultFilter === "Ratings") return matchesSearch && customer.rating >= 4;
      return matchesSearch;
    });
  }, [search, defaultFilter]);

  const stats = [
    { label: "Total Customers",   value: filteredCustomers.length },
    { label: "New This Month",    value: filteredCustomers.filter(c => c.type === "New").length },
    { label: "Repeat Customers",  value: filteredCustomers.filter(c => c.type === "Repeat" || c.type === "VIP").length },
    {
      label: "Avg Rating",
      value: (filteredCustomers.reduce((s, c) => s + c.rating, 0) / (filteredCustomers.length || 1)).toFixed(1),
    },
  ];

  return (
    <div className="site-page site-page-padding">
      <div className="customers-shell">

        {/* ── Header ── */}
        <div className="site-page-header">
          <div>
            <h1 className="site-page-title">{title}</h1>
            <p className="site-page-subtitle">{subtitle}</p>
          </div>
          <div className="customers-actions">
            <button className="site-btn site-btn-ghost site-btn-sm">Export</button>
            <button className="site-btn site-btn-primary site-btn-sm">+ Add Customer</button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="customers-stats-grid">
          {stats.map(stat => (
            <div key={stat.label} className="site-card customers-stat-card">
              <span className="customers-stat-label site-subtext">{stat.label}</span>
              <div className="customers-stat-value site-text-brand">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* ── Search ── */}
        <div className="site-card customers-filters-card">
          <div className="site-search-wrap">
            <i className="ti ti-search site-search-icon" aria-hidden="true" />
            <input
              className="site-input"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search customer, email, phone or city…"
            />
          </div>
        </div>

        {/* ── Table Card ── */}
        <div className="site-card customers-table-card">
          {filteredCustomers.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="customers-table-wrap">
                <table className="site-table customers-table">
                  <thead>
                    <tr>
                      {["Customer", "Phone", "City", "Orders", "Spent", "Type", "Rating", "Status", "Last Order", "Actions"].map(h => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map(customer => (
                      <tr key={customer.id}>
                        <td>
                          <div className="customers-name">{customer.name}</div>
                          <div className="customers-email">{customer.email}</div>
                        </td>
                        <td className="site-subtext" style={{ fontSize: "13px" }}>{customer.phone}</td>
                        <td className="site-subtext" style={{ fontSize: "13px" }}>{customer.city}</td>
                        <td className="site-subtext" style={{ fontSize: "13px" }}>{customer.orders}</td>
                        <td className="customers-spent">{`₹${customer.spent.toLocaleString()}`}</td>
                        <td>
                          <span className={`site-badge ${typeClass[customer.type]}`}>
                            {customer.type}
                          </span>
                        </td>
                        <td>
                          <span className={`site-badge ${ratingClass[customer.ratingLevel]}`}>
                            {customer.rating} ★
                          </span>
                        </td>
                        <td>
                          <span className={customer.status === "Active" ? "customers-status--active" : "customers-status--inactive"}>
                            {customer.status}
                          </span>
                        </td>
                        <td className="site-subtext" style={{ fontSize: "13px" }}>{customer.lastOrder}</td>
                        <td>
                          <div className="customers-action-group">
                            <button className="site-btn site-btn-outline site-btn-sm">View</button>
                            <button className="site-btn site-btn-ghost site-btn-sm">Message</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="customers-mobile-list">
                {filteredCustomers.map(customer => (
                  <div key={customer.id} className="customers-mobile-card">
                    <div className="customers-mobile-top">
                      <div className="customers-name">{customer.name}</div>
                      <div className="customers-email">{customer.email}</div>
                    </div>
                    <div className="customers-mobile-meta">
                      {[
                        { label: "Phone",      value: customer.phone },
                        { label: "City",       value: customer.city },
                        { label: "Orders",     value: String(customer.orders) },
                        { label: "Spent",      value: `₹${customer.spent.toLocaleString()}` },
                        { label: "Last Order", value: customer.lastOrder },
                        { label: "Status",     value: customer.status, isStatus: true },
                      ].map(({ label, value, isStatus }) => (
                        <div key={label} className="customers-mobile-meta-item">
                          <div className="customers-mobile-meta-label site-label-xs">{label}</div>
                          <div className={`customers-mobile-meta-value ${isStatus ? (value === "Active" ? "customers-status--active" : "customers-status--inactive") : "site-heading"}`}>
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="customers-mobile-badges">
                      <span className={`site-badge ${typeClass[customer.type]}`}>{customer.type}</span>
                      <span className={`site-badge ${ratingClass[customer.ratingLevel]}`}>{customer.rating} ★</span>
                    </div>
                    <div className="customers-action-group">
                      <button className="site-btn site-btn-outline site-btn-sm">View</button>
                      <button className="site-btn site-btn-ghost site-btn-sm">Message</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="site-empty-state">
              <div className="site-empty-icon">👥</div>
              <p className="site-empty-title">No customers found</p>
              <p className="site-empty-desc">Try adjusting your search</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}