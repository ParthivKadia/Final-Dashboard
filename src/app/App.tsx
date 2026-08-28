// App.tsx
import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/shared/components/layout/AppLayout";
import { ScrollToTop } from "@/shared/components/ui/ScrollToTop";
import { SidebarProvider } from "@/shared/context/SidebarContext";
import { ProtectedRoute } from "@/shared/components/auth/ProtectedRoute";

// Eager load auth pages (small, needed immediately)
import SignIn from "@/features/auth/pages/SignIn";
import Register from "@/features/auth/pages/Register";
import CreateStore from "@/features/stores/pages/CreateStore";
import StoreProfile from "@/features/stores/pages/StoreProfile";
import Workflow from "@/features/onboarding/pages/Workflow";
import CreateStorePolicy from "@/features/stores/pages/CreateStorePolicy";

// Lazy load everything else
const Home = lazy(() => import("@/features/dashboard/pages/Home"));

const AllProducts = lazy(() => import("@/features/products/pages/AllProducts"));
const AddProduct = lazy(() => import("@/features/products/pages/AddProducts"));
const Inventory = lazy(() => import("@/features/products/pages/Inventory"));
const LowStock = lazy(() => import("@/features/products/pages/LowStock"));
const Categories = lazy(() => import("@/features/products/pages/Categories"));

const AllOrders = lazy(() => import("@/features/orders/pages/AllOrders"));
const PendingOrders = lazy(() => import("@/features/orders/pages/PendingOrders"));
const ProcessingOrders = lazy(() => import("@/features/orders/pages/ProcessingOrders"));
const ShippedOrders = lazy(() => import("@/features/orders/pages/ShippedOrders"));
const DeliveredOrders = lazy(() => import("@/features/orders/pages/DeliveredOrders"));
const CancelledOrders = lazy(() => import("@/features/orders/pages/CancelledOrders"));
const ReturnedOrders = lazy(() => import("@/features/orders/pages/ReturnedOrders"));

// const AllCustomers = lazy(() => import("@/features/customers/pages/AllCustomers"));
// const CustomerReviews = lazy(() => import("@/features/customers/pages/CustomerReviews"));
// const Messages = lazy(() => import("@/features/customers/pages/Messages"));

// const SalesAnalytics = lazy(() => import("@/features/analytics/pages/SalesAnalytics"));
// const TopProducts = lazy(() => import("@/features/analytics/pages/TopProducts"));
// const RevenueReport = lazy(() => import("@/features/analytics/pages/RevenueReport"));

// const Coupons = lazy(() => import("@/features/marketing/pages/Coupons"));
// const Campaigns = lazy(() => import("@/features/marketing/pages/Campaigns"));
// const Discount = lazy(() => import("@/features/marketing/pages/Discount"));
// const EmailMarketing = lazy(() => import("@/features/marketing/pages/EmailMarketing"));

// const StoreProfile = lazy(() => import("@/features/stores/pages/StoreProfile"));
const UserProfiles = lazy(() => import("@/features/stores/pages/UserProfiles"));
// const Shipping = lazy(() => import("@/features/stores/pages/Shipping"));
// const Payments = lazy(() => import("@/features/stores/pages/Payments"));
// const CreateStore = lazy(() => import("@/features/stores/pages/CreateStore"));

// const AccountSettings = lazy(() => import("@/features/settings/pages/AccountSettings"));
// const Notifications = lazy(() => import("@/features/settings/pages/Notifications"));
// const Security = lazy(() => import("@/features/settings/pages/Security"));
const LogoutPage = lazy(() => import("@/features/settings/pages/LogoutPage"));

export default function App() {
  return (
    <SidebarProvider>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
        <Routes>
          {/* Public routes (no auth required) */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/workflow" element={<Workflow />} />

          {/* Protected routes - require authentication */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />

              {/* Products */}
              <Route path="/products" element={<AllProducts />} />
              <Route path="/products/add" element={<AddProduct />} />
              <Route path="/products/categories" element={<Categories />} />
              <Route path="/products/inventory" element={<Inventory />} />
              <Route path="/products/low-stock" element={<LowStock />} />

              {/* Categories */}
              <Route path="/categories" element={<Categories />} />

              {/* Policy */}
              <Route path="/policy" element={<CreateStorePolicy />} />

              {/* Orders */}
              <Route path="/orders" element={<AllOrders />} />
              <Route path="/orders/pending" element={<PendingOrders />} />
              <Route path="/orders/processing" element={<ProcessingOrders />} />
              <Route path="/orders/shipped" element={<ShippedOrders />} />
              <Route path="/orders/delivered" element={<DeliveredOrders />} />
              <Route path="/orders/cancelled" element={<CancelledOrders />} />
              <Route path="/orders/returned" element={<ReturnedOrders />} />

              {/* Customers */}
              {/* <Route path="/customers" element={<AllCustomers />} />
              <Route path="/customers/review" element={<CustomerReviews />} />
              <Route path="/customers/messages" element={<Messages />} /> */}

              {/* Analytics */}
              {/* <Route path="/analytics/sales-analytics" element={<SalesAnalytics />} />
              <Route path="/analytics/top-products" element={<TopProducts />} />
              <Route path="/analytics/revenue" element={<RevenueReport />} /> */}

              {/* Marketing */}
              {/* <Route path="/marketing/coupons" element={<Coupons />} />
              <Route path="/marketing/campaigns" element={<Campaigns />} />
              <Route path="/marketing/discounts" element={<Discount />} />
              <Route path="/marketing/email" element={<EmailMarketing />} /> */}

              {/* Store */}
              <Route path="/store" element={<UserProfiles />} />
              <Route path="/store/create-store" element={<CreateStore />} />
              <Route path="/store/store-profile" element={<StoreProfile />} />
              {/* <Route path="/store/create-store" element={<CreateStore />} />
              <Route path="/store/store-profile" element={<StoreProfile />} />
              <Route path="/store/shipping" element={<Shipping />} />
              <Route path="/store/payments" element={<Payments />} />
              <Route path="/store/user-profile" element={<UserProfiles />} /> */}

              {/* Settings */}
              <Route path="/settings" element={<LogoutPage />} />
              {/* <Route path="/settings/account" element={<AccountSettings />} />
              <Route path="/settings/notifications" element={<Notifications />} />
              <Route path="/settings/security" element={<Security />} />
              <Route path="/settings/logout" element={<LogoutPage />} /> */}
            </Route>
          </Route>

          {/* Catch-all - redirect to signin if not authenticated, home if authenticated */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </Router>
    </SidebarProvider>
  );
}