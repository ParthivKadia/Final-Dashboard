// src/utils/cloudinaryUpload.ts

import { api } from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";
import type { ApiResponse, CloudiaryResponseBody } from "../types/store";

// ─── Signature fetch ──────────────────────────────────────────────────────────
// We intentionally do NOT cache the signature between uploads.
//
// Why: Cloudinary signatures are single-use for the Upload Widget and
// time-bound (60 min window). Caching caused "Invalid Signature" errors
// when the user spent time filling in the form between clicks.
//
// The signature endpoint is cheap (~100ms), so fetching fresh on every
// upload click is the correct tradeoff.

const fetchSignature = async (): Promise<CloudiaryResponseBody> => {
    const res = await api<ApiResponse<CloudiaryResponseBody>>(
        ENDPOINTS.CLOUDINARY_SIGNATURE(),
        { method: "POST", requiresAuth: true }
    );

    // Handle both { data: { apiKey, ... } } and flat { apiKey, ... }
    const payload: CloudiaryResponseBody =
        res?.data?.apiKey
            ? res.data
            : (res as unknown as CloudiaryResponseBody);

    if (!payload?.apiKey || !payload?.cloudName || !payload?.signature) {
        console.error("[Cloudinary] Unexpected signature response shape:", res);
        throw new Error("Invalid signature response from server. Check the browser console for details.");
    }

    return payload;
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Optional: call on page mount to pre-warm the signature in the background.
 * Only used to make the *very first* click feel faster — result is discarded,
 * actual uploads always fetch a fresh signature.
 */
export const prefetchCloudinarySignature = (): void => {
    fetchSignature().catch(() => {}); // fire-and-forget, errors are safe to ignore
};

/**
 * Upload a file directly to Cloudinary using a fresh server-signed credential.
 * Fetches a new signature on every call — avoids stale/expired signature errors.
 *
 * @returns The CDN URL (secure_url) of the uploaded image.
 */
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
    // Always fetch a fresh signature — never reuse a cached one
    const { apiKey, cloudName, folder, signature, timestamp } = await fetchSignature();
    // console.log(apiKey, cloudName, folder, signature, timestamp)

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signature);
    if (folder) formData.append("folder", folder);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
    );

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(
            (err as any)?.error?.message ?? `Cloudinary upload failed (${response.status})`
        );
    }

    const data = await response.json();
    return data.secure_url as string;
};