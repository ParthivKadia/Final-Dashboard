const messages = [
  { id: 1, customer: "Priya Mehta", subject: "Order delivery update", preview: "Can you confirm when my parcel will arrive?", time: "10:24 AM", unread: true },
  { id: 2, customer: "Kabir Singh", subject: "Return request", preview: "I want to exchange the size for my last order.", time: "09:10 AM", unread: true },
  { id: 3, customer: "Ananya Rao", subject: "Product availability", preview: "When will this item be back in stock?", time: "Yesterday", unread: false },
];

export default function Messages() {
  return (
    <div className="site-page site-page-padding">
      <div style={{ maxWidth: 800, margin: "0 auto" }}>

        <div className="site-page-header">
          <div>
            <h1 className="site-page-title">Messages</h1>
            <p className="site-page-subtitle">Customer conversations and support requests</p>
          </div>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`site-card site-card-hover ${message.unread ? "messages-card--unread" : ""}`}
              style={{ padding: "18px 24px" }}
            >

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="site-heading" style={{ fontSize: 15, fontWeight: 700 }}>
                    {message.customer}
                  </span>
                  {message.unread && (
                    <span className="site-badge" style={{
                      backgroundColor: "var(--status-out-bg)",
                      color: "var(--status-out-text)",
                      fontSize: 10,
                      padding: "2px 8px",
                    }}>
                      Unread
                    </span>
                  )}
                </div>
                <span className="site-text-muted" style={{ fontSize: 12, flexShrink: 0, marginLeft: 12 }}>
                  {message.time}
                </span>
              </div>

              <div className="site-text-brand" style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                {message.subject}
              </div>

              <div className="site-subtext" style={{ fontSize: 14, lineHeight: 1.6 }}>
                {message.preview}
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}