"use client";

import { type HTMLAttributes } from "react";

type SkeletonVariant = "text" | "circle" | "rectangle";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
}

const variantStyles: Record<SkeletonVariant, string> = {
  text: "rounded-lg",
  circle: "rounded-full",
  rectangle: "rounded-xl",
};

function Skeleton({
  variant = "text",
  width,
  height,
  className = "",
  ...props
}: SkeletonProps) {
  const defaultHeight = variant === "text" ? "1em" : variant === "circle" ? "40px" : "200px";

  return (
    <div
      className={["animate-pulse bg-stone-200", variantStyles[variant], className].join(" ")}
      style={{
        width: width ?? (variant === "circle" ? height : "100%"),
        height: height ?? defaultHeight,
      }}
      aria-hidden="true"
      {...props}
    />
  );
}

export { Skeleton, type SkeletonProps, type SkeletonVariant };
