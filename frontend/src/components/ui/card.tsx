"use client";

import { type HTMLAttributes, type ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  children: ReactNode;
}

function Card({ hover = false, className = "", children, ...props }: CardProps) {
  return (
    <div
      className={[
        "rounded-2xl border border-stone-200/60 bg-white shadow-sm",
        "transition-all duration-300",
        hover
          ? "hover:shadow-lg hover:-translate-y-0.5 cursor-pointer hover:border-primary-200"
          : "",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={["border-b border-stone-100 px-6 py-5", className].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

function CardBody({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={["px-6 py-5", className].join(" ")} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={["border-t border-stone-100 px-6 py-4", className].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export { Card, CardHeader, CardBody, CardFooter, type CardProps };
