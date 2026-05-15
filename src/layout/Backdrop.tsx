// src/layout/Backdrop.tsx

import { useSidebar } from "../context/SidebarContext";

const Backdrop: React.FC = () => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();

  if (!isMobileOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 lg:hidden"
      style={{ backgroundColor: "rgba(20, 25, 46, 0.7)" }}
      onClick={toggleMobileSidebar}
    />
  );
};

export default Backdrop;