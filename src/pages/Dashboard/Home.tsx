// src/pages/Dashboard/Home.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import WelcomeCard from "../../components/ecommerce/WelcomeCard";
import StatCards from "../../components/ecommerce/StatCards";
import ProfitExpensesChart from "../../components/ecommerce/ProfitExpensesChart";
import ProductSalesChart from "../../components/ecommerce/ProductSalesChart";
import NewGoalsCard from "../../components/ecommerce/NewGoalsCard";
import LowStockAlerts from "../../components/ecommerce/LowStockAlerts";
import RecentOrdersCard from "../../components/ecommerce/RecentOrdersCard";
import TopProductsTable from "../../components/ecommerce/TopProductsTable";
import { userDetails } from "../../services/userService";
import { tokenStorage } from "../../utils/tokenStorage";
import type { ApiResponse, User } from "../../types/store"; // ✅ import types

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyUserAndStore = async () => {

      // Step 1: No token → go to signin
      const token = tokenStorage.get();
      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        // Step 2: Call userDetails with Bearer token (requiresAuth: true in service)
        const response: ApiResponse<User> = await userDetails();
        console.log(response)

        // Step 3: Check stores array from typed response
        const stores = response?.data?.stores;

        if (!stores || stores.length === 0) {
          navigate("/store/create-store");
          return;
        }

        // Step 4: All good — render dashboard
        setIsVerifying(false);

      } catch (err: any) {
        if (err?.status === 401 || err?.message?.toLowerCase().includes("unauthorized")) {
          // Token invalid/expired — clear and redirect
          tokenStorage.remove();
          navigate("/signin");
        } else {
          // Network/server error — don't wipe token
          setIsVerifying(false);
        }
      }
    };

    verifyUserAndStore();
  }, [navigate]);

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 dark:text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

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