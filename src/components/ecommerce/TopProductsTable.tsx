import React from "react";

interface Product {
  rank: number;
  name: string;
  starred?: boolean;
  category: string;
  price: string;
  unitsSold: number;
  revenue: string;
  grossMargin: number;
  growth: number;
  stock: "In Stock" | "Low Stock" | "Out of Stock";
  stockLeft?: number;
}

const products: Product[] = [
  {
    rank: 1,
    name: "Wireless Earbuds Pro",
    starred: true,
    category: "Electronics",
    price: "₹4,999",
    unitsSold: 143,
    revenue: "₹7.15L",
    grossMargin: 60,
    growth: 34,
    stock: "In Stock",
    stockLeft: 28,
  },
  {
    rank: 2,
    name: "Cotton Kurta Set",
    category: "Clothing",
    price: "₹1,299",
    unitsSold: 298,
    revenue: "₹3.87L",
    grossMargin: 60,
    growth: 12,
    stock: "Low Stock",
    stockLeft: 7,
  },
  {
    rank: 3,
    name: "Steel Water Bottle 1L",
    starred: true,
    category: "Home & Kitchen",
    price: "₹649",
    unitsSold: 512,
    revenue: "₹3.32L",
    grossMargin: 70,
    growth: 28,
    stock: "In Stock",
    stockLeft: 84,
  },
  {
    rank: 4,
    name: "Yoga Mat Premium",
    category: "Sports",
    price: "₹2,199",
    unitsSold: 89,
    revenue: "₹1.96L",
    grossMargin: 60,
    growth: -8,
    stock: "Out of Stock",
  },
  {
    rank: 5,
    name: "Phone Stand Foldable",
    category: "Accessories",
    price: "₹399",
    unitsSold: 421,
    revenue: "₹1.68L",
    grossMargin: 70,
    growth: 5,
    stock: "Out of Stock",
  },
  {
    rank: 6,
    name: "Bamboo Cutting Board",
    category: "Home & Kitchen",
    price: "₹899",
    unitsSold: 167,
    revenue: "₹1.50L",
    grossMargin: 60,
    growth: 19,
    stock: "In Stock",
    stockLeft: 43,
  },
];

const stockBadge = (stock: Product["stock"], left?: number) => {
  switch (stock) {
    case "In Stock":
      return (
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
          In Stock{left ? ` · ${left} left` : ""}
        </span>
      );
    case "Low Stock":
      return (
        <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
          Low Stock{left ? ` · ${left} left` : ""}
        </span>
      );
    case "Out of Stock":
      return (
        <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-lg">
          Out of Stock
        </span>
      );
  }
};

const TopProductsTable: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="text-base font-semibold text-gray-800">Top Selling Products</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            March 2026 · 1,630 units sold · ₹19.48L revenue
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">6 products shown</span>
          <button className="text-blue-600 text-sm font-medium hover:underline">
            View all →
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400 font-medium">
              <th className="text-left py-2 pr-4">#</th>
              <th className="text-left py-2 pr-4">Product</th>
              <th className="text-left py-2 pr-4">Category</th>
              <th className="text-right py-2 pr-4">Price</th>
              <th className="text-right py-2 pr-4">Units Sold</th>
              <th className="text-right py-2 pr-4">Revenue</th>
              <th className="text-right py-2 pr-4">Gross Margin</th>
              <th className="text-right py-2 pr-4">Growth</th>
              <th className="text-right py-2">Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.rank}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <td className="py-3 pr-4 text-gray-400 font-medium">#{p.rank}</td>
                <td className="py-3 pr-4">
                  <span className="font-semibold text-gray-800">
                    {p.name}
                    {p.starred && (
                      <span className="text-amber-400 ml-1">★</span>
                    )}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                    {p.category}
                  </span>
                </td>
                <td className="py-3 pr-4 text-right text-gray-600">{p.price}</td>
                <td className="py-3 pr-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-12 bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-blue-400 h-1.5 rounded-full"
                        style={{
                          width: `${Math.min(100, (p.unitsSold / 520) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-gray-700 font-medium">{p.unitsSold}</span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-right font-semibold text-gray-700">
                  {p.revenue}
                </td>
                <td className="py-3 pr-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-12 bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-emerald-400 h-1.5 rounded-full"
                        style={{ width: `${p.grossMargin}%` }}
                      />
                    </div>
                    <span className="text-gray-700">{p.grossMargin}%</span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-right">
                  <span
                    className={`text-xs font-semibold ${
                      p.growth >= 0 ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {p.growth >= 0 ? "↗" : "↘"} {Math.abs(p.growth)}%
                  </span>
                </td>
                <td className="py-3 text-right">
                  {stockBadge(p.stock, p.stockLeft)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-100 bg-gray-50/50">
              <td colSpan={4} className="py-2.5 px-0 text-xs font-semibold text-gray-500">
                Totals
              </td>
              <td className="py-2.5 pr-4 text-right text-sm font-bold text-gray-700">
                1,630
              </td>
              <td className="py-2.5 pr-4 text-right text-sm font-bold text-gray-700">
                ₹19.48L
              </td>
              <td className="py-2.5 pr-4 text-right text-xs text-gray-500">
                Avg margin:{" "}
                <span className="font-semibold text-gray-700">63.3%</span>
              </td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default TopProductsTable;