// src/pages/Settings/LogoutPage.tsx

import { useState } from "react";
import { useNavigate } from "react-router";
import { logout } from "@/shared/services/authService";
import { tokenStorage } from "@/shared/utils/tokenStorage";
import { useAppStore } from "@/shared/stores/useAppStore";
import { useProductStore } from "@/shared/stores/useProductStore";
import { AlertCircle } from 'lucide-react'

export default function LogoutPage() {
  const navigate       = useNavigate();
  const clearApp       = useAppStore(s => s.clear);
  const invalidateAll  = useProductStore(s => s.invalidateAll);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const handleLogout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await logout();
    } catch {
      // best-effort — even if the API fails, clear local state
    } finally {
      tokenStorage.remove();
      clearApp();          // wipe user / stores from Zustand
      invalidateAll();     // wipe product cache
      navigate("/signin");
    }
  };

  return (
    <div className="site-page site-page-padding min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm p-6 text-center">
        <div className="flex justify-center items-center">
          <AlertCircle color="red" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Logout</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Are you sure you want to log out of your account?</p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            ⚠️ {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md mx-auto">
          <button
            onClick={() => navigate("/")}
            disabled={isLoading}
            className="site-btn site-btn-ghost site-btn-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="site-btn site-btn-danger site-btn-lg"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Logging out...
              </span>
            ) : (
              "Logout"
            )}
          </button>
        </div>

        {/* <p className="text-xs text-slate-400 dark:text-slate-500 mt-5">You'll be securely signed out from this device.</p> */}
      </div>
    </div>
  );
}