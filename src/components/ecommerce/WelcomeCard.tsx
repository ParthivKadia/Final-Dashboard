import React from "react";
import { useNavigate } from "react-router-dom";

const WelcomeCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="rounded-2xl p-4 sm:p-6 flex flex-col justify-between min-h-[160px]"
      style={{ backgroundColor: "var(--brand-700)" }}
    >
      <div>
        <p className="text-base sm:text-lg font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>
          Good Evening 🌙
        </p>
        <h2 className="text-3xl font-bold mt-1" style={{ color: "#ffffff" }}>
          Seller
        </h2>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.70)" }}>
          Here's what's happening in your store today.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6">
        {[
          { icon: "📦", label: "Orders today",     value: "24" },
          { icon: "💰", label: "Revenue today",    value: "₹18,240" },
          { icon: "📈", label: "Avg. order value", value: "₹760" },
        ].map(({ icon, label, value }) => (
          <div
            key={label}
            className="rounded-xl p-2.5 sm:p-3 min-w-0"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            <div
              className="flex items-start gap-1 text-[10px] sm:text-xs mb-1 leading-tight"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              <span className="shrink-0">{icon}</span>
              <span className="break-words">{label}</span>
            </div>
            <p
              className="text-xl sm:text-2xl font-bold leading-none break-words"
              style={{ color: "#ffffff" }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/products/inventory")}
        className="mt-4 text-sm font-medium px-4 py-2 rounded-lg w-fit transition-colors"
        style={{
          backgroundColor: "rgba(255,255,255,0.20)",
          color: "#ffffff",
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.30)")}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.20)")}
      >
        Manage Inventory →
      </button>
    </div>
  );
};

export default WelcomeCard;