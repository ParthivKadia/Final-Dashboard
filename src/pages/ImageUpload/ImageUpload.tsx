// src/components/ImageUpload/ImageUpload.tsx

import { useRef } from "react";
import { useCloudinaryUpload } from "../../hooks/useCloudinaryUpload";

interface ImageUploadButtonProps {
    onUpload:   (url: string) => void;
    label?:     string;
    disabled?:  boolean;
    className?: string;
}

export default function ImageUploadButton({
    onUpload,
    label     = "Upload Image",
    disabled  = false,
    className = "",
}: ImageUploadButtonProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const { upload, uploading, error, clearError } = useCloudinaryUpload(onUpload);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await upload(file);
        e.target.value = "";
    };

    return (
        <div className={`inline-flex flex-col gap-1 ${className}`}>
            {/* Hidden native file input */}
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
                disabled={disabled || uploading}
            />

            {/* Upload zone button — matches the dashed zone style from the original widget */}
            <button
                type="button"
                disabled={disabled || uploading}
                onClick={() => inputRef.current?.click()}
                className={[
                    "flex flex-col items-center justify-center gap-2",
                    "w-24 h-24 rounded-xl",
                    "border-2 border-dashed transition-all",
                    disabled
                        ? "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed opacity-50"
                        : uploading
                            ? "border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 cursor-wait"
                            : "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 hover:border-blue-400 hover:bg-blue-50 dark:hover:border-blue-500 dark:hover:bg-blue-900/20 cursor-pointer",
                ].join(" ")}
            >
                {uploading ? (
                    <>
                        <span className="w-5 h-5 border-2 border-blue-300 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
                        <span className="text-[10px] font-medium text-blue-500 dark:text-blue-400 leading-tight text-center">
                            Uploading…
                        </span>
                    </>
                ) : (
                    <>
                        {/* <span className="text-2xl leading-none">📁</span> */}
                        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-tight text-center px-1">
                            {label}
                        </span>
                    </>
                )}
            </button>

            {/* Inline error */}
            {error && (
                <p className="text-[11px] text-red-500 dark:text-red-400 flex items-center gap-1 max-w-[96px]">
                    ⚠️ {error}
                    <button
                        type="button"
                        onClick={clearError}
                        className="ml-0.5 text-red-400 hover:text-red-600 text-sm leading-none shrink-0"
                    >
                        ×
                    </button>
                </p>
            )}
        </div>
    );
}