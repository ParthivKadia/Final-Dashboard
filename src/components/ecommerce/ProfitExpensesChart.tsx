import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Aug", revenue: 210000, expenses: 110000, netProfit: 100000 },
  { month: "Sep", revenue: 230000, expenses: 130000, netProfit: 100000 },
  { month: "Oct", revenue: 200000, expenses: 120000, netProfit: 80000 },
  { month: "Nov", revenue: 260000, expenses: 140000, netProfit: 120000 },
  { month: "Dec", revenue: 320000, expenses: 160000, netProfit: 160000 },
  { month: "Jan", revenue: 270000, expenses: 150000, netProfit: 120000 },
  { month: "Feb", revenue: 240000, expenses: 130000, netProfit: 110000 },
  { month: "Mar", revenue: 288000, expenses: 144000, netProfit: 101000 },
];

const plTable = [
  {
    item: "Revenue",
    total: "₹19.37L",
    mar: "₹2.88L",
    mom: "+23.1%",
    momPositive: true,
  },
  {
    item: "Cost of Goods",
    total: "₹9.69L",
    mar: "₹1.44L",
    mom: "—",
    momPositive: null,
  },
  {
    item: "Gross Profit",
    total: "₹9.69L",
    mar: "₹1.44L",
    mom: "—",
    momPositive: null,
    highlight: true,
  },
  {
    item: "Operating Exp",
    total: "₹2.91L",
    mar: "₹43.2K",
    mom: "—",
    momPositive: null,
  },
  {
    item: "Net Profit",
    total: "₹6.78L",
    mar: "₹1.01L",
    mom: "+23.1%",
    momPositive: true,
    highlight: true,
  },
];

const formatYAxis = (value: number | string) => {
  const num = typeof value === "number" ? value : Number(value);

  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
  return `₹${num}`;
};

const ProfitExpensesChart: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="text-base font-semibold text-gray-800">Profit & Loss</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Aug 2025 - Mar 2026 · Revenue vs Total Expenses
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
            Revenue
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
            Expenses
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            Net Profit
          </span>
        </div>
      </div>

      <div className="mt-4" style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={10} barGap={2}>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
            />
            <YAxis
              tickFormatter={formatYAxis}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              width={55}
            />
            <Tooltip
            formatter={(value: any) => formatYAxis(value)}
              contentStyle={{ borderRadius: 8, fontSize: 12 }}
            />
            <Bar dataKey="revenue" fill="#3b82f6" radius={[3, 3, 0, 0]} />
            <Bar dataKey="expenses" fill="#f87171" radius={[3, 3, 0, 0]} />
            <Bar dataKey="netProfit" fill="#10b981" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs">
              <th className="text-left px-4 py-2.5 font-medium">P&amp;L Item</th>
              <th className="text-right px-4 py-2.5 font-medium">8-Month Total</th>
              <th className="text-right px-4 py-2.5 font-medium">Mar (Current)</th>
              <th className="text-right px-4 py-2.5 font-medium">MoM</th>
            </tr>
          </thead>
          <tbody>
            {plTable.map((row) => (
              <tr
                key={row.item}
                className={`border-t border-gray-50 ${row.highlight ? "font-semibold" : ""}`}
              >
                <td className="px-4 py-2.5 text-gray-700">{row.item}</td>
                <td className="px-4 py-2.5 text-right text-gray-600">{row.total}</td>
                <td
                  className={`px-4 py-2.5 text-right ${
                    row.highlight ? "text-blue-600" : "text-gray-600"
                  }`}
                >
                  {row.mar}
                </td>
                <td className="px-4 py-2.5 text-right">
                  {row.mom === "—" ? (
                    <span className="text-gray-400">—</span>
                  ) : (
                    <span
                      className={`text-xs font-semibold ${
                        row.momPositive ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {row.momPositive ? "↗ " : "↘ "}
                      {row.mom}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>
            Gross Margin: <span className="text-blue-600 font-semibold">50.0%</span> · Net
            Margin: <span className="text-emerald-600 font-semibold">35.0%</span>
          </span>
          <button className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfitExpensesChart;
