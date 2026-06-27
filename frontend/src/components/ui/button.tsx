"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "dark" | "outline" | "ghost" | "danger" | "link";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800",
  dark: "bg-stone-900 text-white hover:bg-stone-800 active:bg-stone-700",
  outline: "border border-stone-300 text-stone-800 hover:border-stone-900 hover:bg-stone-50",
  ghost: "text-stone-600 hover:bg-stone-100",
  danger: "bg-error-600 text-white hover:bg-error-700 active:bg-error-800",
  link: "text-primary-700 hover:text-primary-800 underline-offset-4 hover:underline px-0",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[13px] rounded-md gap-1.5",
  md: "h-10 px-4 text-sm rounded-md gap-2",
  lg: "h-12 px-6 text-[15px] rounded-md gap-2.5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={[
          "inline-flex items-center justify-center font-medium leading-none transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-40",
          variant !== "link" ? sizeStyles[size] : "",
          variantStyles[variant],
          className,
        ].join(" ")}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize };
