// src/layout/AppLayout.tsx

import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div
      className="min-h-screen xl:flex"
      style={{ backgroundColor: "var(--features-bg)" }}
    >
      {/* Sidebar — navy dark bg handled inside AppSidebar */}
      <div>
        <AppSidebar />
        <Backdrop />
      </div>

      {/* Main content area */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        {/* Header — navy dark bg handled inside AppHeader */}
        <AppHeader />

        {/* Page content */}
        <div style={{ backgroundColor: "var(--features-bg)" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;