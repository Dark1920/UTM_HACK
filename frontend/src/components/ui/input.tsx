"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-stone-800">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">{icon}</div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={[
              "w-full h-10 rounded-md border bg-white px-3 text-sm text-stone-900",
              "placeholder:text-stone-400",
              "transition-colors duration-150",
              "focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900",
              "disabled:cursor-not-allowed disabled:opacity-40 disabled:bg-stone-50",
              error
                ? "border-error-400 focus:ring-error-500 focus:border-error-500"
                : "border-stone-300 hover:border-stone-400",
              icon ? "pl-9" : "",
              className,
            ].join(" ")}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-error-600">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-xs text-stone-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, type InputProps };
