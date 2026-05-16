// src/pages/Dashboard/Home.tsx
// All colours come from site-theme.css — no inline style={{ color/bg }} needed.

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
      <div className="site-page flex items-center justify-center h-screen">
        <p className="text-sm site-subtext">Loading…</p>
      </div>
    );
  }

  return (
    <div className="site-page flex flex-col gap-5 p-4">

      {/* Row 1 — Welcome + Stat Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-stretch rounded-2xl p-4 site-surface-how">
        <div className="xl:col-span-2">
          <WelcomeCard />
        </div>
        <div className="xl:col-span-1">
          <StatCards />
        </div>
      </div>

      {/* Row 2 — Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl p-1 site-surface-card">
          <ProfitExpensesChart />
        </div>
        <div className="lg:col-span-1 rounded-2xl p-1 site-surface-card">
          <ProductSalesChart />
        </div>
      </div>

      {/* Row 3 — Goals / Alerts / Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 rounded-2xl p-1 site-surface-card">
          <NewGoalsCard />
        </div>
        <div className="lg:col-span-1 rounded-2xl p-1 site-surface-card">
          <LowStockAlerts />
        </div>
        <div className="lg:col-span-1 rounded-2xl p-1 site-surface-card">
          <RecentOrdersCard />
        </div>
      </div>

      {/* Row 4 — Top Products Table */}
      <div className="rounded-2xl p-1 site-surface-card">
        <TopProductsTable />
      </div>
    </div>
  );
};

export default Home;