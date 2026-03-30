const messages = [
  { id: 1, customer: "Priya Mehta", subject: "Order delivery update", preview: "Can you confirm when my parcel will arrive?", time: "10:24 AM", unread: true },
  { id: 2, customer: "Kabir Singh", subject: "Return request", preview: "I want to exchange the size for my last order.", time: "09:10 AM", unread: true },
  { id: 3, customer: "Ananya Rao", subject: "Product availability", preview: "When will this item be back in stock?", time: "Yesterday", unread: false },
];

export default function Messages() {
  return (
    <div style={{ padding: 28, background: "#f8fafc", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#0f172a" }}>Messages</h1>
      <p style={{ margin: "4px 0 24px", fontSize: 14, color: "#64748b" }}>Customer conversations and support requests</p>

      <div style={{ display: "grid", gap: 14 }}>
        {messages.map((message) => (
          <div key={message.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{message.customer}</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>{message.time}</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#2563eb", marginBottom: 6 }}>{message.subject}</div>
            <div style={{ fontSize: 14, color: "#475569" }}>{message.preview}</div>
            {message.unread && (
              <div style={{ marginTop: 10, fontSize: 11, fontWeight: 700, color: "#dc2626" }}>Unread</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
