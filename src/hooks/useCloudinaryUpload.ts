// src/hooks/useCloudinaryUpload.ts

import { useState, useCallback } from "react";
import { uploadToCloudinary } from "../services/imageService";

export type UploadState = {
    uploading: boolean;
    error:     string | null;
    /** Cleared automatically when a new upload starts */
    preview:   string | null;
};

export type UseCloudinaryUpload = UploadState & {
    /**
     * Call this with a File (e.g. from an <input type="file"> change event).
     * Resolves to the CDN URL string on success, or null on failure.
     */
    upload: (file: File) => Promise<string | null>;
    /** Manually clear the error banner */
    clearError: () => void;
};

/**
 * Reusable hook for uploading a single image to Cloudinary via your signed
 * backend endpoint.
 *
 * @param onSuccess  Optional callback fired with the CDN URL after a
 *                   successful upload — useful for updating parent state.
 *
 * Example:
 * ```tsx
 * const { upload, uploading, error } = useCloudinaryUpload(url => setImageUrl(url));
 *
 * <input type="file" accept="image/*"
 *   onChange={e => e.target.files?.[0] && upload(e.target.files[0])} />
 * ```
 */
export function useCloudinaryUpload(
    onSuccess?: (url: string) => void
): UseCloudinaryUpload {
    const [uploading, setUploading] = useState(false);
    const [error,     setError]     = useState<string | null>(null);
    const [preview,   setPreview]   = useState<string | null>(null);

    const upload = useCallback(async (file: File): Promise<string | null> => {
        setUploading(true);
        setError(null);
        setPreview(null);

        try {
            const result = await uploadToCloudinary(file);
            setPreview(result.url);
            onSuccess?.(result.url);
            return result.url;
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Image upload failed. Please try again.";
            setError(message);
            return null;
        } finally {
            setUploading(false);
        }
    }, [onSuccess]);

    const clearError = useCallback(() => setError(null), []);

    return { uploading, error, preview, upload, clearError };
}