import { useBoutique } from '../context';
import { CheckCircle2, AlertCircle, Sparkles, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, dismissToast } = useBoutique();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-lg shadow-xl text-xs font-medium tracking-wide transition-all transform animate-in fade-in slide-in-from-bottom-2 duration-300 border ${
            toast.type === 'sale'
              ? 'bg-stone-900 text-amber-200 border-amber-600/40 shadow-amber-950/20'
              : toast.type === 'success'
              ? 'bg-stone-900 text-stone-100 border-stone-700 shadow-stone-900/30'
              : 'bg-white text-stone-800 border-stone-200 shadow-stone-900/10'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'sale' && <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-spin-slow" />}
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'info' && <AlertCircle className="w-4 h-4 text-stone-500 shrink-0" />}
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="ml-3 p-1 hover:opacity-75 transition-opacity text-stone-400 hover:text-stone-200"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
