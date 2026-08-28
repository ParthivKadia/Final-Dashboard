// src/hooks/useAuth.ts
//
// Thin read-only selector over auth state. The actual bootstrap() call and
// redirect logic now live in AppLayout (runs once, centrally, before any
// child route mounts) — this hook just exposes the resolved state so pages
// can show a loading fallback if they render before AppLayout has settled.
//
// Usage (unchanged for every existing page):
//
//   const { isVerifying } = useAuth();
//   if (isVerifying) return <Spinner />;

import { useAppStore } from '@/shared/stores/useAppStore';

export function useAuth() {
    const { authStatus } = useAppStore();

    return {
        /** True while the app-level auth check is in flight */
        isVerifying: authStatus === 'idle' || authStatus === 'loading',
        isAuthenticated: authStatus === 'authenticated',
        authStatus,
    };
}