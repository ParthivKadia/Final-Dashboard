const reviews = [
  { id: 1, customer: "Aarav Sharma", product: "Wireless Earbuds Pro", rating: 5, comment: "Amazing sound and fast delivery.", date: "25 Mar 2026" },
  { id: 2, customer: "Priya Mehta", product: "Cotton Polo Shirt", rating: 4, comment: "Fabric quality is very good.", date: "24 Mar 2026" },
  { id: 3, customer: "Sneha Kapoor", product: "Atomic Habits", rating: 5, comment: "Book arrived in perfect condition.", date: "23 Mar 2026" },
];

export default function CustomerReviews() {
  return (
    <div style={{ padding: 28, background: "#f8fafc", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#0f172a" }}>Customer Reviews</h1>
      <p style={{ margin: "4px 0 24px", fontSize: 14, color: "#64748b" }}>Recent product feedback from customers</p>

      <div style={{ display: "grid", gap: 16 }}>
        {reviews.map((review) => (
          <div key={review.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{review.customer}</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>{review.date}</div>
            </div>
            <div style={{ fontSize: 13, color: "#2563eb", marginBottom: 6 }}>{review.product}</div>
            <div style={{ fontSize: 13, color: "#f59e0b", marginBottom: 8 }}>{"★".repeat(review.rating)}</div>
            <div style={{ fontSize: 14, color: "#475569" }}>{review.comment}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
