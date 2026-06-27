"use client";

import { type HTMLAttributes } from "react";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "warm";
type BadgeSize = "sm" | "md";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-stone-100 text-stone-600",
  success: "bg-success-100 text-success-700",
  warning: "bg-primary-100 text-primary-700",
  error: "bg-error-100 text-error-700",
  info: "bg-info-100 text-info-700",
  warm: "bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700",
};

const dotStyles: Record<BadgeVariant, string> = {
  default: "bg-stone-500",
  success: "bg-success-500",
  warning: "bg-primary-500",
  error: "bg-error-500",
  info: "bg-info-500",
  warm: "bg-primary-500",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2.5 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
};

function Badge({
  variant = "default",
  size = "md",
  dot = false,
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(" ")}
      {...props}
    >
      {dot && (
        <span
          className={["h-1.5 w-1.5 rounded-full", dotStyles[variant]].join(" ")}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

export { Badge, type BadgeProps, type BadgeVariant, type BadgeSize };
