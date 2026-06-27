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
        "rounded-lg border border-stone-200 bg-white",
        "transition-colors duration-150",
        hover ? "hover:border-stone-400 cursor-pointer" : "",
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
    <div className={["border-b border-stone-200 px-5 py-4", className].join(" ")} {...props}>
      {children}
    </div>
  );
}

function CardBody({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={["px-5 py-4", className].join(" ")} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={["border-t border-stone-200 px-5 py-3.5", className].join(" ")} {...props}>
      {children}
    </div>
  );
}

export { Card, CardHeader, CardBody, CardFooter, type CardProps };
