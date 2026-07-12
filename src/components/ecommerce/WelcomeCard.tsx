import React from "react";
import { useNavigate } from "react-router-dom";

const getGreeting = (): { text: string; icon: string } => {
  const hour = new Date().getHours();
  if (hour < 5)  return { text: "Good Night", icon: "🌙" };
  if (hour < 12) return { text: "Good Morning", icon: "☀️" };
  if (hour < 17) return { text: "Good Afternoon", icon: "🌤️" };
  if (hour < 21) return { text: "Good Evening", icon: "🌇" };
  return { text: "Good Night", icon: "🌙" };
};

const WelcomeCard: React.FC = () => {
  const navigate = useNavigate();
  const { text: greetingText, icon: greetingIcon } = getGreeting();

  return (
    <div
      className="rounded-2xl p-4 sm:p-6 flex flex-col justify-between min-h-[150px] sm:min-h-[160px]"
      style={{ backgroundColor: "var(--brand-700)" }}
    >
      <div>
        <p className="text-sm sm:text-lg font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>
          {greetingText} {greetingIcon}
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold mt-1" style={{ color: "#ffffff" }}>
          Seller
        </h2>
        <p className="text-xs sm:text-sm mt-1" style={{ color: "rgba(255,255,255,0.70)" }}>
          Here's what's happening in your store today.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-1.5 sm:gap-4 mt-4 sm:mt-6">
        {[
          { icon: "📦", label: "Orders today",     value: "24" },
          { icon: "💰", label: "Revenue today",    value: "₹18,240" },
          { icon: "📈", label: "Avg. order value", value: "₹760" },
        ].map(({ icon, label, value }) => (
          <div
            key={label}
            className="rounded-xl p-2 sm:p-3 min-w-0"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            <div
              className="flex items-center gap-1 text-[9px] sm:text-xs mb-1 leading-tight"
              style={{ color: "rgba(255,255,255,0.75)" }}
              title={label}
            >
              <span className="shrink-0">{icon}</span>
              <span className="truncate">{label}</span>
            </div>
            <p
              className="text-base sm:text-2xl font-bold leading-none truncate"
              style={{ color: "#ffffff" }}
              title={value}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/products")}
        className="mt-4 text-sm font-medium px-4 py-2.5 sm:py-2 rounded-lg w-full sm:w-fit transition-colors"
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