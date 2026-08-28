// src/layout/AppLayout.tsx

import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider, useSidebar } from "@/shared/context/SidebarContext";
import { useAppStore } from "@/shared/stores/useAppStore";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const navigate = useNavigate();
  const { authStatus, bootstrap } = useAppStore();

  console.log('[AppLayout] mounted, authStatus:', authStatus);

  // Runs exactly once per full page load, regardless of which route the
  // user lands on (deep link, hard refresh, etc). This is the single
  // place userDetails() gets called — every page below just reads the
  // result from useAppStore instead of triggering its own fetch.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      console.log('[AppLayout] bootstrap starting...');
      const result = await bootstrap();
      console.log('[AppLayout] bootstrap result:', result);
      if (cancelled) return;

      if (result === "no-token" || result === "unauthorized") {
        navigate("/signin", { replace: true });
      } else if (result === "no-store") {
        navigate("/store/create-store", { replace: true });
      }
      // 'ok' or 'error' → stay put, render children
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Block ALL child routes until user + store data is confirmed fresh.
  // This is what removes the "visit / first" workaround — no page ever
  // mounts with a stale, unverified `activeStore` from persisted storage.
  if (authStatus === "idle" || authStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center site-page">
        <p className="text-sm site-subtext">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen xl:flex">
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
        <div>
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