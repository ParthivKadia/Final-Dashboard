import React from "react";

interface Order {
  id: string;
  product: string;
  amount: string;
  status: "Delivered" | "Shipped" | "Processing" | "Cancelled";
}

const orders: Order[] = [
  { id: "#ORD-8831", product: "Wireless Earbuds Pro", amount: "₹4,999", status: "Delivered" },
  { id: "#ORD-8829", product: "Cotton Kurta Set x 2", amount: "₹2,598", status: "Shipped" },
  { id: "#ORD-8827", product: "Bamboo Cutting Board", amount: "₹899", status: "Delivered" },
  { id: "#ORD-8824", product: "Steel Water Bottle 1L x 3", amount: "₹1,947", status: "Processing" },
  { id: "#ORD-8821", product: "Yoga Mat Premium", amount: "₹2,199", status: "Cancelled" },
  { id: "#ORD-8818", product: "Phone Stand Foldable", amount: "₹399", status: "Delivered" },
  { id: "#ORD-8815", product: "Yoga Mat Premium x 2", amount: "₹4,398", status: "Cancelled" },
];

const statusConfig: Record<Order["status"], { dot: string; text: string; label: string }> = {
  Delivered: { dot: "bg-emerald-500", text: "text-emerald-600", label: "Delivered" },
  Shipped: { dot: "bg-blue-500", text: "text-blue-600", label: "Shipped" },
  Processing: { dot: "bg-amber-500", text: "text-amber-600", label: "Processing" },
  Cancelled: { dot: "bg-red-500", text: "text-red-500", label: "Cancelled" },
};

const RecentOrdersCard: React.FC = () => {
  const delivered = orders.filter((o) => o.status === "Delivered").length;
  const inTransit = orders.filter((o) => o.status === "Shipped" || o.status === "Processing").length;
  const cancelled = orders.filter((o) => o.status === "Cancelled").length;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-blue-500">📋</span>
          <h3 className="text-base font-semibold text-gray-800">Order History</h3>
        </div>
        <button className="text-blue-600 text-sm font-medium hover:underline">
          View all →
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-4">
        {["All 7", "Delivered 3", "Shipped 1", "Cancelled 2"].map((tab, i) => (
          <button
            key={tab}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
              i === 0
                ? "bg-blue-50 text-blue-600"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div className="flex flex-col gap-0">
        {orders.map((order) => {
          const cfg = statusConfig[order.status];
          return (
            <div
              key={order.id}
              className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                <div>
                  <p className="text-sm font-medium text-gray-700 leading-tight">
                    {order.product}
                  </p>
                  <p className="text-xs text-gray-400">{order.id}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-700">{order.amount}</p>
                <p className={`text-xs font-medium ${cfg.text}`}>{cfg.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary footer */}
      <div className="mt-3 flex justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
        <span>
          <span className="font-semibold text-gray-700">{delivered}</span> delivered
        </span>
        <span>
          <span className="font-semibold text-gray-700">{inTransit}</span> in transit
        </span>
        <span>
          <span className="font-semibold text-gray-700">{cancelled}</span> cancelled
        </span>
      </div>
    </div>
  );
};

export default RecentOrdersCard;