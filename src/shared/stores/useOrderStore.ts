// src/store/useOrderStore.ts
//
// Per-store order cache. Orders are keyed by storeUsername + filters so switching
// stores immediately shows cached data if available, and only refetches when
// the cache is empty or explicitly invalidated.

import { create } from 'zustand';
import { getOrders } from '../services/orderService';
import type { Order, GetOrdersParams } from '../types/store';

interface OrdersKey extends GetOrdersParams {
    username: string;
}

interface OrdersData {
    orders:    Order[];
    total:     number;
    hasMore:   boolean;
    fetchedAt: number;
}

const CACHE_TTL_MS = 60_000;

function ordersCacheKey({ username, page, pageSize, status, paymentStatus, search }: OrdersKey): string {
    return `${username}::${page}::${pageSize}::${status ?? ''}::${paymentStatus ?? ''}::${search ?? ''}`;
}

interface OrdersState {
    cache:    Record<string, OrdersData>;
    loading:  Record<string, boolean>;
    errors:   Record<string, string | null>;
    inflight: Record<string, Promise<OrdersData | null>>;

    fetchOrders: (key: OrdersKey, force?: boolean) => Promise<OrdersData | null>;
    getOrders:   (key: OrdersKey) => OrdersData | null;
    invalidate:  (username: string) => void;
    invalidateAll: () => void;
}

export const useOrderStore = create<OrdersState>((set, get) => ({
    cache:    {},
    loading:  {},
    errors:   {},
    inflight: {},

    fetchOrders: async (key, force = false) => {
        const k        = ordersCacheKey(key);
        const existing = get().cache[k];
        const now      = Date.now();

        if (!force && existing && now - existing.fetchedAt < CACHE_TTL_MS) {
            return existing;
        }

        const inflight = get().inflight[k];
        if (inflight) return inflight;

        set(state => ({
            loading: { ...state.loading, [k]: true },
            errors:  { ...state.errors,  [k]: null },
        }));

        const promise = (async (): Promise<OrdersData | null> => {
            try {
                const res = await getOrders(key.username, {
                    page:          key.page,
                    pageSize:      key.pageSize,
                    status:        key.status,
                    paymentStatus: key.paymentStatus,
                    search:        key.search,
                });

                const payload = res?.data ?? (res as any);
                const data: OrdersData = {
                    orders:    payload?.orders ?? [],
                    total:     payload?.meta?.total   ?? 0,
                    hasMore:   payload?.meta?.hasMore ?? false,
                    fetchedAt: Date.now(),
                };

                set(state => {
                    const { [k]: _drop, ...restInflight } = state.inflight;
                    return {
                        cache:    { ...state.cache,   [k]: data },
                        loading:  { ...state.loading, [k]: false },
                        inflight: restInflight,
                    };
                });

                return data;
            } catch (err: any) {
                set(state => {
                    const { [k]: _drop, ...restInflight } = state.inflight;
                    return {
                        loading:  { ...state.loading, [k]: false },
                        errors:   { ...state.errors,  [k]: err?.message || 'Failed to fetch orders.' },
                        inflight: restInflight,
                    };
                });
                return null;
            }
        })();

        set(state => ({ inflight: { ...state.inflight, [k]: promise } }));

        return promise;
    },

    getOrders: (key) => get().cache[ordersCacheKey(key)] ?? null,

    invalidate: (username) =>
        set(state => {
            const prefix   = `${username}::`;
            const cache    = Object.fromEntries(Object.entries(state.cache).filter(([k]) => !k.startsWith(prefix)));
            const loading  = Object.fromEntries(Object.entries(state.loading).filter(([k]) => !k.startsWith(prefix)));
            const errors   = Object.fromEntries(Object.entries(state.errors).filter(([k]) => !k.startsWith(prefix)));
            const inflight = Object.fromEntries(Object.entries(state.inflight).filter(([k]) => !k.startsWith(prefix)));
            return { cache, loading, errors, inflight };
        }),

    invalidateAll: () => set({ cache: {}, loading: {}, errors: {}, inflight: {} }),
}));