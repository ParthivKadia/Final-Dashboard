import React from "react";
import WelcomeCard from "../../components/ecommerce/WelcomeCard";
import StatCards from "../../components/ecommerce/StatCards";
import ProfitExpensesChart from "../../components/ecommerce/ProfitExpensesChart";
import ProductSalesChart from "../../components/ecommerce/ProductSalesChart";
import NewGoalsCard from "../../components/ecommerce/NewGoalsCard";
import LowStockAlerts from "../../components/ecommerce/LowStockAlerts";
import RecentOrdersCard from "../../components/ecommerce/RecentOrdersCard";
import TopProductsTable from "../../components/ecommerce/TopProductsTable";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col gap-5">
      {/* Row 1: Welcome + Stat Cards */}
     <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-stretch">
  <div className="xl:col-span-2">
    <WelcomeCard />
  </div>

  <div className="xl:col-span-1">
    <StatCards />
  </div>
</div>


      {/* Row 2: P&L Chart + Units Sold / Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ProfitExpensesChart />
        </div>
        <div className="lg:col-span-1">
          <ProductSalesChart />
        </div>
      </div>

      {/* Row 3: Monthly Goals + Low Stock + Order History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <NewGoalsCard />
        </div>
        <div className="lg:col-span-1">
          <LowStockAlerts />
        </div>
        <div className="lg:col-span-1">
          <RecentOrdersCard />
        </div>
      </div>

      {/* Row 4: Top Selling Products Table (full width) */}
      <TopProductsTable />
    </div>
  );
};

export default Home;