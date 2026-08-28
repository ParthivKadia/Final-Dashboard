// src/services/storeService.ts

import { api } from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";
import type { ApiResponse, Store, CreateStoreBody } from "../types/store";

export const getStore = (username: string) =>
    api(ENDPOINTS.GET_STORE(username), {
        method: "GET",
    });

export const createStore = (data: CreateStoreBody): Promise<ApiResponse<Store>> =>
    api(ENDPOINTS.CREATE_STORE, {
        method: "POST",
        requiresAuth: true,
        body: data,
    });

export const updateStore = (
    username: string,
    data: Partial<CreateStoreBody>   
): Promise<ApiResponse<Store>> =>
    api(ENDPOINTS.UPDATE_STORE(username), {
        method: "PUT",
        requiresAuth: true,
        body: data,
    });

export const deleteStore = (username: string): Promise<ApiResponse<void>> =>
    api(ENDPOINTS.DELETE_STORE(username), {
        method: "DELETE",
        requiresAuth: true,
    });
