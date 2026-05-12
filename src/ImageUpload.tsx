// src/ImageUpload.tsx

import { useRef, useState, useEffect } from 'react';
import { prefetchCloudinarySignature, uploadImageToCloudinary } from './utils/cloudinaryUpload';

type Props = {
  onUpload:   (url: string) => void;
  uwConfig?:  Record<string, unknown>; // kept for call-site compatibility, not used
};

export default function CloudinaryUploadWidget({ onUpload }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const inputRef              = useRef<HTMLInputElement>(null);
  const onUploadRef           = useRef(onUpload);
  onUploadRef.current         = onUpload;

  // Warm the signature on mount so the first click has a head start
  useEffect(() => { prefetchCloudinarySignature(); }, []);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ''; // reset so same file can be re-picked after removal

    setLoading(true);
    setError(null);
    try {
      const url = await uploadImageToCloudinary(file);
      onUploadRef.current(url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-flex flex-col gap-1">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
        disabled={loading}
      />
      <button
        type="button"
        onClick={() => { setError(null); inputRef.current?.click(); }}
        disabled={loading}
        className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading
          ? <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 dark:border-t-slate-300 rounded-full animate-spin inline-block" />
              Uploading…
            </span>
          : '📤 Upload Image'
        }
      </button>
      {error && (
        <p className="text-[11px] text-red-500 dark:text-red-400 flex items-center gap-1">
          ⚠️ {error}
          <button type="button" onClick={() => setError(null)}
            className="ml-0.5 text-red-400 hover:text-red-600 text-sm leading-none">×</button>
        </p>
      )}
    </div>
  );
}