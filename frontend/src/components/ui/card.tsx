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
        "rounded-xl border border-slate-200 bg-white shadow-sm",
        "transition-shadow duration-200",
        hover ? "hover:shadow-md cursor-pointer" : "",
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
      className={["border-b border-slate-200 px-6 py-4", className].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

function CardBody({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={["px-6 py-4", className].join(" ")} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={["border-t border-slate-200 px-6 py-4", className].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export { Card, CardHeader, CardBody, CardFooter, type CardProps };
