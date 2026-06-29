import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { SidebarProvider } from "./context/SidebarContext";

// Eager load auth pages (small, needed immediately)
import SignIn from "./pages/AuthPages/SignIn";
import Register from "./pages/AuthPages/Register";

// Lazy load everything else
const Home = lazy(() => import("./pages/Dashboard/Home"));

const AllProducts = lazy(() => import("./pages/Products/AllProducts"));
const AddProduct = lazy(() => import("./pages/Products/AddProducts"));
const Inventory = lazy(() => import("./pages/Products/Inventory"));
const LowStock = lazy(() => import("./pages/Products/LowStock"));
const Categories = lazy(() => import("./pages/Products/Categories"));

const AllOrders = lazy(() => import("./pages/Orders/AllOrders"));
const PendingOrders = lazy(() => import("./pages/Orders/PendingOrders"));
const ProcessingOrders = lazy(() => import("./pages/Orders/ProcessingOrders"));
const ShippedOrders = lazy(() => import("./pages/Orders/ShippedOrders"));
const DeliveredOrders = lazy(() => import("./pages/Orders/DeliveredOrders"));
const CancelledOrders = lazy(() => import("./pages/Orders/CancelledOrders"));
const ReturnedOrders = lazy(() => import("./pages/Orders/ReturnedOrders"));

const AllCustomers = lazy(() => import("./pages/Customers/AllCustomers"));
const CustomerReviews = lazy(() => import("./pages/Customers/CustomerReviews"));
const Messages = lazy(() => import("./pages/Customers/Messages"));

const SalesAnalytics = lazy(() => import("./pages/Analytics/SalesAnalytics"));
const TopProducts = lazy(() => import("./pages/Analytics/TopProducts"));
const RevenueReport = lazy(() => import("./pages/Analytics/RevenueReport"));

const Coupons = lazy(() => import("./pages/Marketing/Coupons"));
const Campaigns = lazy(() => import("./pages/Marketing/Campaigns"));
const Discount = lazy(() => import("./pages/Marketing/Discount"));
const EmailMarketing = lazy(() => import("./pages/Marketing/EmailMarketing"));

const StoreProfile = lazy(() => import("./pages/Store/StoreProfile"));
const UserProfiles = lazy(() => import("./pages/Store/UserProfiles"));
const Shipping = lazy(() => import("./pages/Store/Shipping"));
const Payments = lazy(() => import("./pages/Store/Payments"));
const CreateStore = lazy(() => import("./pages/Store/CreateStore"));

const AccountSettings = lazy(() => import("./pages/Settings/AccountSettings"));
const Notifications = lazy(() => import("./pages/Settings/Notifications"));
const Security = lazy(() => import("./pages/Settings/Security"));
const LogoutPage = lazy(() => import("./pages/Settings/LogoutPage"));

export default function App() {
  return (
    <SidebarProvider>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
        <Routes>
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

            {/* Orders */}
            <Route path="/orders" element={<AllOrders />} />
            <Route path="/orders/pending" element={<PendingOrders />} />
            <Route path="/orders/processing" element={<ProcessingOrders />} />
            <Route path="/orders/shipped" element={<ShippedOrders />} />
            <Route path="/orders/delivered" element={<DeliveredOrders />} />
            <Route path="/orders/cancelled" element={<CancelledOrders />} />
            <Route path="/orders/returned" element={<ReturnedOrders />} />

            {/* Customers */}
            <Route path="/customers" element={<AllCustomers />} />
            <Route path="/customers/review" element={<CustomerReviews />} />
            <Route path="/customers/messages" element={<Messages />} />

            {/* Analytics */}
            <Route path="/analytics/sales-analytics" element={<SalesAnalytics />} />
            <Route path="/analytics/top-products" element={<TopProducts />} />
            <Route path="/analytics/revenue" element={<RevenueReport />} />

            {/* Marketing */}
            <Route path="/marketing/coupons" element={<Coupons />} />
            <Route path="/marketing/campaigns" element={<Campaigns />} />
            <Route path="/marketing/discounts" element={<Discount />} />
            <Route path="/marketing/email" element={<EmailMarketing />} />

            {/* Store */}
            <Route path="/store" element={<UserProfiles />} />
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

          {/* Auth */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        </Suspense>
      </Router>
    </SidebarProvider>
  );
}
