import React from "react";

interface StockItem {
  name: string;
  category: string;
  left: number | null;
  min: number;
  outOfStock?: boolean;
  barPercent: number;
}

const stockItems: StockItem[] = [
  {
    name: "Wireless Earbuds Pro",
    category: "Electronics",
    left: 3,
    min: 10,
    barPercent: 30,
  },
  {
    name: "Cotton Kurta — Blue XL",
    category: "Clothing",
    left: null,
    min: 15,
    outOfStock: true,
    barPercent: 0,
  },
  {
    name: "Steel Bottle 1L",
    category: "Home & Kitchen",
    left: 7,
    min: 20,
    barPercent: 35,
  },
  {
    name: "Yoga Mat Premium",
    category: "Sports",
    left: 2,
    min: 10,
    barPercent: 20,
  },
  {
    name: "Phone Stand Foldable",
    category: "Accessories",
    left: null,
    min: 25,
    outOfStock: true,
    barPercent: 0,
  },
];

const LowStockAlerts: React.FC = () => {
  const outCount = stockItems.filter((i) => i.outOfStock).length;
  const lowCount = stockItems.filter((i) => !i.outOfStock && i.left !== null).length;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-amber-500">⚠️</span>
          <h3 className="text-base font-semibold text-gray-800">Low Stock Alerts</h3>
          <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
            {outCount} out
          </span>
          <span className="text-xs bg-amber-100 text-amber-600 font-semibold px-2 py-0.5 rounded-full">
            {lowCount} low
          </span>
        </div>
        <button className="text-blue-600 text-sm font-medium hover:underline">
          Manage →
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {stockItems.map((item) => (
          <div key={item.name}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    item.outOfStock ? "bg-red-500" : "bg-amber-400"
                  }`}
                />
                <div>
                  <p className="text-sm font-medium text-gray-700">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.category}</p>
                </div>
              </div>
              {item.outOfStock ? (
                <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                  Out of stock
                </span>
              ) : (
                <span className="text-xs font-semibold text-amber-600">
                  {item.left} left
                </span>
              )}
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${
                  item.outOfStock ? "bg-red-400" : "bg-amber-400"
                }`}
                style={{ width: `${item.barPercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 text-right mt-0.5">min {item.min}</p>
          </div>
        ))}
      </div>

      <button className="mt-5 w-full bg-amber-500 hover:bg-amber-600 transition-colors text-white text-sm font-semibold py-2.5 rounded-xl">
        Restock All Low Items →
      </button>
    </div>
  );
};

export default LowStockAlerts;