import React from "react";

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const PERCENT = 84;
const DASH = (PERCENT / 100) * CIRCUMFERENCE;

const NewGoalsCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-5">
      {/* Monthly Target */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-4">Monthly Target</h3>
        <div className="flex flex-col items-center">
          <div className="relative w-36 h-36">
            <svg
              viewBox="0 0 130 130"
              className="w-full h-full -rotate-90"
            >
              <circle
                cx="65"
                cy="65"
                r={RADIUS}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="10"
              />
              <circle
                cx="65"
                cy="65"
                r={RADIUS}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="10"
                strokeDasharray={`${DASH} ${CIRCUMFERENCE}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-800">84%</span>
              <span className="text-xs text-gray-400">achieved</span>
            </div>
          </div>

          <div className="w-full mt-4">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-gray-500">Achieved</span>
              <span className="text-gray-500">Target</span>
            </div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span className="text-gray-700">₹4,18,240</span>
              <span className="text-gray-700">₹5,00,000</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: "84%" }} />
            </div>
            <p className="text-xs text-gray-400 text-center mt-1.5">₹81.8K remaining</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Monthly Revenue */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-gray-400 text-sm">₹</span>
          <h4 className="text-sm font-semibold text-gray-700">Monthly Revenue</h4>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-700">This Month</p>
              <p className="text-xs text-gray-400">84% of target</p>
            </div>
            <span className="text-blue-600 font-semibold">₹4.18L</span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-700">Last Month</p>
              <p className="text-xs text-gray-400">-7% vs target</p>
            </div>
            <span className="text-gray-600 font-semibold">₹3.90L</span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-700">Best Month</p>
              <p className="text-xs text-gray-400">Dec 2025</p>
            </div>
            <span className="text-emerald-600 font-semibold">₹5.24L</span>
          </div>
        </div>
        {/* Best Seller banner */}
        <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
          <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <span>↗</span> Best Seller · March
          </p>
          <p className="text-sm font-bold text-gray-800 mt-0.5">Wireless Earbuds Pro</p>
          <p className="text-xs text-gray-500 mt-0.5">143 units · ₹71,357 revenue</p>
        </div>
      </div>
    </div>
  );
};

export default NewGoalsCard;