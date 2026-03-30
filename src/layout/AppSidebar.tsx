import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BoxCubeIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  PieChartIcon,
  PlugInIcon,
  UserCircleIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";

type SubItem = {
  name: string;
  path: string;
};

type MenuItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: SubItem[];
};

const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    icon: <GridIcon />,
    path: "/",
  },
  {
    name: "Products",
    icon: <BoxCubeIcon />,
    subItems: [
      { name: "All Products", path: "/products" },
      { name: "Add Product", path: "/products/add" },
      { name: "Categories", path: "/products/categories" },
      { name: "Inventory", path: "/products/inventory" },
      { name: "Low Stock", path: "/products/low-stock" },
    ],
  },
  {
    name: "Orders",
    icon: <PieChartIcon />,
    subItems: [
      { name: "All Orders", path: "/orders" },
      { name: "Pending Orders", path: "/orders/pending" },
      { name: "Processing Orders", path: "/orders/processing" },
      { name: "Shipped Orders", path: "/orders/shipped" },
      { name: "Delivered Orders", path: "/orders/delivered" },
      { name: "Cancelled Orders", path: "/orders/cancelled" },
      { name: "Returned Orders", path: "/orders/returned" },
    ],
  },
  {
    name: "Customers",
    icon: <UserCircleIcon />,
    subItems: [
      { name: "All Customers", path: "/customers" },
      { name: "Customer Review", path: "/customers/review" },
      { name: "Messages", path: "/customers/messages" },
    ],
  },
  {
    name: "Analytics",
    icon: <PieChartIcon />,
    subItems: [
      { name: "Sales Analytics", path: "/analytics/sales-analytics" },
      { name: "Top Products", path: "/analytics/top-products" },
      { name: "Revenue Report", path: "/analytics/revenue" },
    ],
  },
  {
    name: "Marketing",
    icon: <PlugInIcon />,
    subItems: [
      { name: "Coupons", path: "/marketing/coupons" },
      { name: "Campaigns", path: "/marketing/campaigns" },
      { name: "Discount", path: "/marketing/discounts" },
      { name: "Email Marketing", path: "/marketing/email" },
    ],
  },
  {
    name: "Store",
    icon: <PlugInIcon />,
    subItems: [
      { name: "User Profile", path: "/store/user-profile" },
      { name: "Store Profile", path: "/store/store-profile" },
      { name: "Shipping", path: "/store/shipping" },
      { name: "Payments", path: "/store/payments" },
    ],
  },
  {
    name: "Settings",
    icon: <PlugInIcon />,
    subItems: [
      { name: "Account Settings", path: "/settings/account" },
      { name: "Notifications", path: "/settings/notifications" },
      { name: "Security", path: "/settings/security" },
      { name: "Logout", path: "/settings/logout" },
    ],
  },
];

const dashboardItem = menuItems.find((item) => item.name === "Dashboard");
const otherMenuItems = menuItems.filter((item) => item.name !== "Dashboard");

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const isSidebarOpen = isExpanded || isHovered || isMobileOpen;
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const activeParent = menuItems.find((item) =>
      item.subItems?.some((sub) => isActive(sub.path))
    );

    if (activeParent) {
      setOpenMenu(activeParent.name);
    }
  }, [location.pathname]);

  const renderMenuItem = (item: MenuItem) => (
    <li key={item.name}>
      {item.subItems ? (
        <>
          <button
            onClick={() => setOpenMenu(openMenu === item.name ? null : item.name)}
            className={`menu-item group w-full cursor-pointer ${
              openMenu === item.name ? "menu-item-active" : "menu-item-inactive"
            } ${!isSidebarOpen ? "lg:justify-center" : "lg:justify-start"}`}
          >
            <span
              className={`menu-item-icon-size ${
                openMenu === item.name
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
              }`}
            >
              {item.icon}
            </span>

            {isSidebarOpen && (
              <>
                <span className="menu-item-text">{item.name}</span>
                <ChevronDownIcon
                  className={`ml-auto h-5 w-5 transition-transform duration-200 ${
                    openMenu === item.name ? "rotate-180 text-brand-500" : ""
                  }`}
                />
              </>
            )}
          </button>

          {isSidebarOpen && openMenu === item.name && (
            <ul className="ml-9 mt-2 space-y-1">
              {item.subItems.map((subItem) => (
                <li key={subItem.name}>
                  <Link
                    to={subItem.path}
                    className={`menu-dropdown-item flex items-center gap-3 ${
                      isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isActive(subItem.path) ? "bg-brand-500" : "bg-gray-300"
                      }`}
                    />
                    <span>{subItem.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        item.path && (
          <Link
            to={item.path}
            className={`menu-item group ${
              isActive(item.path) ? "menu-item-active" : "menu-item-inactive"
            } ${!isSidebarOpen ? "lg:justify-center" : "lg:justify-start"}`}
          >
            <span
              className={`menu-item-icon-size ${
                isActive(item.path)
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
              }`}
            >
              {item.icon}
            </span>

            {isSidebarOpen && <span className="menu-item-text">{item.name}</span>}
          </Link>
        )
      )}
    </li>
  );

  return (
    <aside
      className={`fixed left-0 top-0 z-50 mt-16 flex h-screen flex-col border-r border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out lg:mt-0
        ${isSidebarOpen ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex py-8 ${
          !isSidebarOpen ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/" className="flex items-center gap-3">
          <img src="/images/logo/logo-icon.svg" alt="Logo" width={32} height={32} />
          {isSidebarOpen && (
            <span className="text-2xl font-semibold text-slate-900">
              Seller Hub
            </span>
          )}
        </Link>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto pb-10">
        <nav className="mb-6">
          {dashboardItem && (
            <div className="mb-6">
              <h2
                className={`mb-3 flex text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 ${
                  !isSidebarOpen ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isSidebarOpen ? "Home" : <HorizontaLDots className="size-5" />}
              </h2>

              <ul className="flex flex-col gap-2">{renderMenuItem(dashboardItem)}</ul>
            </div>
          )}

          <div>
            <h2
              className={`mb-3 flex text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 ${
                !isSidebarOpen ? "lg:justify-center" : "justify-start"
              }`}
            >
              {isSidebarOpen ? "Menu" : <HorizontaLDots className="size-5" />}
            </h2>

            <ul className="flex flex-col gap-2">
              {otherMenuItems.map((item) => renderMenuItem(item))}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
