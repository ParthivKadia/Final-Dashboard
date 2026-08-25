import { Navigate, Outlet } from "react-router-dom";
import { useAppStore } from "@/shared/stores/useAppStore";

export function ProtectedRoute() {
  const { authStatus } = useAppStore();

  console.log('[ProtectedRoute] authStatus:', authStatus);

  // Allow AppLayout to handle bootstrap + loading state
  // Only redirect if explicitly unauthenticated (no token or 401)
  if (authStatus === "unauthenticated") {
    console.log('[ProtectedRoute] redirecting to /signin');
    return <Navigate to="/signin" replace />;
  }

  // For 'idle', 'loading', 'authenticated', 'error' -> render AppLayout
  // AppLayout will handle bootstrap and show its own loading/error UI
  return <Outlet />;
}