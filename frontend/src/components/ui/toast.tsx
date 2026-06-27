"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (type: ToastType, message: string) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const icons: Record<ToastType, ReactNode> = {
  success: <CheckCircle2 className="h-4 w-4 text-success-500" />,
  error: <AlertCircle className="h-4 w-4 text-error-500" />,
  warning: <AlertTriangle className="h-4 w-4 text-primary-500" />,
  info: <Info className="h-4 w-4 text-info-500" />,
};

function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (type: ToastType, message: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 w-full max-w-sm"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            className="flex items-start gap-3 rounded-md border border-stone-200 bg-white p-3.5 animate-in fade-in duration-150"
          >
            {icons[t.type]}
            <p className="flex-1 text-sm text-stone-700">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="rounded p-0.5 text-stone-400 hover:text-stone-700"
              aria-label="Fermer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export { ToastProvider, useToast, type ToastType, type Toast };
