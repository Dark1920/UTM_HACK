"use client";

import { type HTMLAttributes, type ReactNode } from "react";
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from "lucide-react";

type AlertVariant = "info" | "success" | "warning" | "error";

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  closeable?: boolean;
  onClose?: () => void;
  icon?: ReactNode;
  children: ReactNode;
}

const variantStyles: Record<AlertVariant, string> = {
  info: "bg-info-50 border-info-200 text-info-800",
  success: "bg-success-50 border-success-200 text-success-800",
  warning: "bg-primary-50 border-primary-200 text-primary-800",
  error: "bg-error-50 border-error-200 text-error-800",
};

const defaultIcons: Record<AlertVariant, ReactNode> = {
  info: <Info className="h-5 w-5 text-info-500" />,
  success: <CheckCircle2 className="h-5 w-5 text-success-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-primary-500" />,
  error: <AlertCircle className="h-5 w-5 text-error-500" />,
};

function Alert({
  variant = "info",
  closeable = false,
  onClose,
  icon,
  children,
  className = "",
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      className={[
        "flex items-start gap-3.5 rounded-2xl border p-4",
        variantStyles[variant],
        className,
      ].join(" ")}
      {...props}
    >
      <span className="shrink-0 mt-0.5">{icon ?? defaultIcons[variant]}</span>
      <div className="flex-1 text-sm leading-relaxed">{children}</div>
      {closeable && (
        <button
          onClick={onClose}
          className="shrink-0 rounded-lg p-1 opacity-60 hover:opacity-100 hover:bg-white/50 transition-all"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export { Alert, type AlertProps, type AlertVariant };
