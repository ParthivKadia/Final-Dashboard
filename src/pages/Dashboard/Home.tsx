// src/pages/Dashboard/Home.tsx

import React from "react";
import WelcomeCard from "../../components/ecommerce/WelcomeCard";
import StatCards from "../../components/ecommerce/StatCards";
import ProfitExpensesChart from "../../components/ecommerce/ProfitExpensesChart";
import ProductSalesChart from "../../components/ecommerce/ProductSalesChart";
import NewGoalsCard from "../../components/ecommerce/NewGoalsCard";
import LowStockAlerts from "../../components/ecommerce/LowStockAlerts";
import RecentOrdersCard from "../../components/ecommerce/RecentOrdersCard";
import TopProductsTable from "../../components/ecommerce/TopProductsTable";
import { useAuth } from "../../hooks/useAuth";

const Home: React.FC = () => {
  const { isVerifying } = useAuth();

  if (isVerifying) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ backgroundColor: "var(--features-bg)" }}
      >
        <p
          className="text-sm"
          style={{ color: "var(--navbar-subtext)" }}
        >
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-5 p-4 min-h-screen"
      style={{ backgroundColor: "var(--features-bg)" }}
    >
      {/* Row 1 — Welcome + Stat Cards (Hero-tinted header row) */}
      <div
        className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-stretch rounded-2xl p-4"
        style={{ backgroundColor: "var(--how-bg)" }}
      >
        <div className="xl:col-span-2">
          <WelcomeCard />
        </div>
        <div className="xl:col-span-1">
          <StatCards />
        </div>
      </div>

      {/* Row 2 — Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div
          className="lg:col-span-2 rounded-2xl p-1"
          style={{ backgroundColor: "var(--features-card-bg)" }}
        >
          <ProfitExpensesChart />
        </div>
        <div
          className="lg:col-span-1 rounded-2xl p-1"
          style={{ backgroundColor: "var(--features-card-bg)" }}
        >
          <ProductSalesChart />
        </div>
      </div>

      {/* Row 3 — Goals / Alerts / Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div
          className="lg:col-span-1 rounded-2xl p-1"
          style={{ backgroundColor: "var(--features-card-bg)" }}
        >
          <NewGoalsCard />
        </div>
        <div
          className="lg:col-span-1 rounded-2xl p-1"
          style={{ backgroundColor: "var(--features-card-bg)" }}
        >
          <LowStockAlerts />
        </div>
        <div
          className="lg:col-span-1 rounded-2xl p-1"
          style={{ backgroundColor: "var(--features-card-bg)" }}
        >
          <RecentOrdersCard />
        </div>
      </div>

      {/* Row 4 — Top Products Table */}
      <div
        className="rounded-2xl p-1"
        style={{ backgroundColor: "var(--features-card-bg)" }}
      >
        <TopProductsTable />
      </div>
    </div>
  );
};

export default Home;