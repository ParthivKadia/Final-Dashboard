// src/store/useAppStore.ts
//
// Central store for user identity, stores list, and active store.
// Any page that needs user/store data reads from here instead of calling userDetails() again.
//
//
// Usage:
//   const { user, stores, activeStore, setActiveStore } = useAppStore();

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userDetails } from '../services/userService';
import { tokenStorage } from '../utils/tokenStorage';
import type { User, Store } from '../types/store';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AppState {
    // ── Data ───────────────────────────────────────────────────────────────────
    user:         User | null;
    stores:       Store[];
    activeStore:  Store | null;

    // ── Status ─────────────────────────────────────────────────────────────────
    authStatus:   AuthStatus;
    authError:    string | null;

    // ── Actions ────────────────────────────────────────────────────────────────

    /**
     * Boot the app: verify token + load user/stores.
     * Safe to call from multiple pages — if already authenticated, is a no-op.
     */
    bootstrap: () => Promise<'ok' | 'no-token' | 'no-store' | 'unauthorized' | 'error'>;

    /** Switch the active store (resets per-store caches in other stores). */
    setActiveStore: (store: Store) => void;

    /** Update a single store inside the list (after edit/save). */
    updateStoreInList: (updated: Store) => void;

    /** Clear everything on logout. */
    clear: () => void;
}

export const useAppStore = create<AppState>()(
    // persist keeps authStatus + activeStore across page refreshes
    persist(
        (set, get) => ({
        user:        null,
        stores:      [],
        activeStore: null,
        authStatus:  'idle',
        authError:   null,

        // ── bootstrap ──────────────────────────────────────────────────────────
        bootstrap: async () => {
            // Already verified this session → skip the network call
            if (get().authStatus === 'authenticated') return 'ok';

            const token = tokenStorage.get();
            if (!token) {
                console.log('[bootstrap] no token in storage');
                set({ authStatus: 'unauthenticated', user: null, stores: [], activeStore: null });
                return 'no-token';
            }

            console.log('[bootstrap] token found, calling userDetails...');
            set({ authStatus: 'loading', authError: null });

            try {
                // Add timeout to prevent hanging on network issues
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

                const response = await userDetails();
                clearTimeout(timeoutId);

                console.log('[bootstrap] userDetails response:', response);

                const user   = response?.data;
                const stores = user?.stores ?? [];

                console.log('[bootstrap] user:', user, 'stores:', stores);

                if (!stores.length) {
                    console.log('[bootstrap] no stores found, returning no-store (but keeping authenticated)');
                    // User is authenticated but has no stores - set authenticated with empty stores
                    // Don't set unauthenticated! That causes ProtectedRoute to redirect to signin
                    set({ authStatus: 'authenticated', user, stores: [], activeStore: null, authError: null });
                    return 'no-store';
                }

                // Keep existing activeStore if it's still in the list; otherwise default to first
                const current = get().activeStore;
                const activeStore =
                    (current && stores.find(s => s.id === current.id)) ?? stores[0];

                console.log('[bootstrap] setting authenticated, activeStore:', activeStore);
                set({ authStatus: 'authenticated', user, stores, activeStore, authError: null });
                return 'ok';
            } catch (err: any) {
                console.error('[bootstrap] error:', err);
                const isAbort = err?.name === 'AbortError';
                const is401 =
                    err?.status === 401 ||
                    err?.message?.toLowerCase().includes('unauthorized');

                if (isAbort) {
                    set({ authStatus: 'unauthenticated', user: null, stores: [], activeStore: null, authError: 'Session verification timed out. Please sign in again.' });
                    tokenStorage.remove();
                    return 'unauthorized';
                }

                if (is401) {
                    tokenStorage.remove();
                    set({ authStatus: 'unauthenticated', user: null, stores: [], activeStore: null });
                    return 'unauthorized';
                }

                // Network/server error — clear auth state so user can retry
                set({ authStatus: 'unauthenticated', user: null, stores: [], activeStore: null, authError: err?.message || 'Failed to verify session. Please sign in again.' });
                tokenStorage.remove();
                return 'error';
            }
        },

        // ── setActiveStore ─────────────────────────────────────────────────────
        setActiveStore: (store) => set({ activeStore: store }),

        // ── updateStoreInList ──────────────────────────────────────────────────
        updateStoreInList: (updated) =>
            set(state => ({
                stores: state.stores.map(s => s.id === updated.id ? updated : s),
                activeStore:
                    state.activeStore?.id === updated.id ? updated : state.activeStore,
            })),

        // ── clear ──────────────────────────────────────────────────────────────
        clear: () =>
            set({
                user:        null,
                stores:      [],
                activeStore: null,
                authStatus:  'unauthenticated',
                authError:   null,
            }),
        }),
        {
            name: 'app-store',
            // Only persist lightweight identity — never raw tokens
            partialize: (state) => ({
                user:        state.user,
                stores:      state.stores,
                activeStore: state.activeStore,
                // Don't persist authStatus so we always re-verify on hard reload
            }),
        }
    )
);