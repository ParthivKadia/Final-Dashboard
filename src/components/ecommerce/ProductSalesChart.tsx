import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const unitData = [
  { month: "Sep", units: 950 },
  { month: "Oct", units: 1050 },
  { month: "Nov", units: 1100 },
  { month: "Dec", units: 1350 },
  { month: "Jan", units: 1250 },
  { month: "Feb", units: 1180 },
  { month: "Mar", units: 1380 },
];

const topCategories = [
  { name: "Electronics", units: 243, color: "bg-blue-500", width: "75%" },
  { name: "Clothing", units: 189, color: "bg-blue-400", width: "60%" },
  { name: "Home & Kitchen", units: 148, color: "bg-blue-300", width: "47%" },
];

const ProductSalesChart: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
      <div>
        <div className="flex items-center justify-between mb-1">
          <div>
            <h3 className="text-base font-semibold text-gray-800">Units Sold</h3>
            <p className="text-xs text-gray-400">Monthly trend · all categories</p>
          </div>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            +27.8% MoM
          </span>
        </div>

        <div style={{ height: 130 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={unitData}>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{ borderRadius: 8, fontSize: 12 }}
              formatter={(value) => [`${value} units`, "Units"]}
              />
              <Line
                type="monotone"
                dataKey="units"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: "#3b82f6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-blue-500 text-sm">🏆</span>
          <p className="text-sm font-semibold text-gray-700">Top Categories · March</p>
        </div>

        <div className="flex flex-col gap-3">
          {topCategories.map((cat) => (
            <div key={cat.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{cat.name}</span>
                <span className="text-gray-500 text-xs">{cat.units} units</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className={`${cat.color} h-1.5 rounded-full`}
                  style={{ width: cat.width }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSalesChart;
