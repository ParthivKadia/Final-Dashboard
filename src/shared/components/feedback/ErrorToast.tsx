import { useEffect, useState } from "react";
import { XCircle, X } from "lucide-react";

interface Props {
  error: string | null;
  onDismiss: () => void;
  duration?: number;
}

export default function ErrorToast({ error, onDismiss, duration = 5000 }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setVisible(true);
      if (duration > 0) {
        const t = setTimeout(() => {
          setVisible(false);
          setTimeout(onDismiss, 300);
        }, duration);
        return () => clearTimeout(t);
      }
    } else {
      setVisible(false);
    }
  }, [error]);

  if (!error) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:right-5 sm:w-[380px] z-[99999] transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 shadow-xl shadow-red-100/40 dark:shadow-black/30">
        <XCircle className="text-lg shrink-0 mt-0.5 text-red-500" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">Something went wrong</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{error}</p>
        </div>
        <button
          onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }}
          className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-base transition-colors mt-0.5"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}