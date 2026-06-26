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
  info: "bg-blue-50 border-blue-200 text-blue-800",
  success: "bg-green-50 border-green-200 text-green-800",
  warning: "bg-orange-50 border-orange-200 text-orange-800",
  error: "bg-red-50 border-red-200 text-red-800",
};

const defaultIcons: Record<AlertVariant, ReactNode> = {
  info: <Info className="h-5 w-5 text-blue-500" />,
  success: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-orange-500" />,
  error: <AlertCircle className="h-5 w-5 text-red-500" />,
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
        "flex items-start gap-3 rounded-lg border p-4",
        variantStyles[variant],
        className,
      ].join(" ")}
      {...props}
    >
      <span className="shrink-0 mt-0.5">{icon ?? defaultIcons[variant]}</span>
      <div className="flex-1 text-sm">{children}</div>
      {closeable && (
        <button
          onClick={onClose}
          className="shrink-0 rounded p-0.5 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export { Alert, type AlertProps, type AlertVariant };
