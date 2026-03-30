import React from "react";
import { useNavigate } from "react-router-dom";

const WelcomeCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-blue-600 rounded-2xl p-6 text-white flex flex-col justify-between min-h-[160px]">
      <div>
        <p className="text-lg font-medium opacity-90">Good Evening 🌙</p>
        <h2 className="text-3xl font-bold mt-1">Seller</h2>
        <p className="text-sm opacity-75 mt-1">
          Here's what's happening in your store today.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white/15 rounded-xl p-3">
          <div className="flex items-center gap-1 text-xs opacity-75 mb-1">
            <span>📦</span>
            <span>Orders today</span>
          </div>
          <p className="text-2xl font-bold">24</p>
        </div>

        <div className="bg-white/15 rounded-xl p-3">
          <div className="flex items-center gap-1 text-xs opacity-75 mb-1">
            <span>💰</span>
            <span>Revenue today</span>
          </div>
          <p className="text-2xl font-bold">₹18,240</p>
        </div>

        <div className="bg-white/15 rounded-xl p-3">
          <div className="flex items-center gap-1 text-xs opacity-75 mb-1">
            <span>📈</span>
            <span>Avg. order value</span>
          </div>
          <p className="text-2xl font-bold">₹760</p>
        </div>
      </div>

      <button
        onClick={() => navigate("/products/inventory")}
        className="mt-4 bg-white/20 hover:bg-white/30 transition-colors text-white text-sm font-medium px-4 py-2 rounded-lg w-fit"
      >
        Manage Inventory →
      </button>
    </div>
  );
};

export default WelcomeCard;
