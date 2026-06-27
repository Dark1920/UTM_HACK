"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  success: <CheckCircle2 className="h-5 w-5 text-success-500" />,
  error: <AlertCircle className="h-5 w-5 text-error-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-primary-500" />,
  info: <Info className="h-5 w-5 text-info-500" />,
};

const borderColors: Record<ToastType, string> = {
  success: "border-l-success-500",
  error: "border-l-error-500",
  warning: "border-l-primary-500",
  info: "border-l-info-500",
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
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            className={[
              "flex items-start gap-3.5 rounded-2xl border border-stone-100 bg-white p-4 shadow-xl",
              "border-l-4 animate-in slide-in-from-right-full fade-in duration-300",
              borderColors[t.type],
            ].join(" ")}
          >
            {icons[t.type]}
            <p className="flex-1 text-sm text-stone-700 leading-relaxed">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="rounded-lg p-1 text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-all"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
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
