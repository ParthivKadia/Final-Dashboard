const reviews = [
  { id: 1, customer: "Aarav Sharma", product: "Wireless Earbuds Pro", rating: 5, comment: "Amazing sound and fast delivery.", date: "25 Mar 2026" },
  { id: 2, customer: "Priya Mehta", product: "Cotton Polo Shirt", rating: 4, comment: "Fabric quality is very good.", date: "24 Mar 2026" },
  { id: 3, customer: "Sneha Kapoor", product: "Atomic Habits", rating: 5, comment: "Book arrived in perfect condition.", date: "23 Mar 2026" },
];

export default function CustomerReviews() {
  return (
    <div className="site-page site-page-padding">
      <div style={{ maxWidth: 800, margin: "0 auto" }}>

        <div className="site-page-header">
          <div>
            <h1 className="site-page-title">Customer Reviews</h1>
            <p className="site-page-subtitle">Recent product feedback from customers</p>
          </div>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          {reviews.map((review) => (
            <div key={review.id} className="site-card" style={{ padding: "20px 24px" }}>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <span className="site-heading" style={{ fontSize: 15, fontWeight: 700 }}>
                  {review.customer}
                </span>
                <span className="site-text-muted" style={{ fontSize: 12 }}>
                  {review.date}
                </span>
              </div>

              <div className="site-text-brand" style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                {review.product}
              </div>

              <div style={{ fontSize: 14, color: "var(--featured-color)", marginBottom: 8, letterSpacing: 1 }}>
                {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
              </div>

              <div className="site-subtext" style={{ fontSize: 14, lineHeight: 1.6 }}>
                {review.comment}
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}