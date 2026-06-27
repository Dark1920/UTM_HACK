"use client";

import { useState, type ImgHTMLAttributes } from "react";

type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "size" | "src"> {
  src?: string | null;
  alt: string;
  name?: string;
  size?: AvatarSize;
  online?: boolean;
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

const onlineSizeStyles: Record<AvatarSize, string> = {
  sm: "h-2.5 w-2.5 border",
  md: "h-3 w-3 border-2",
  lg: "h-4 w-4 border-2",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Avatar({
  src,
  alt,
  name = "",
  size = "md",
  online,
  className = "",
  onError,
  ...props
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  const showImage = src && !imgError;

  return (
    <div className={["relative inline-flex shrink-0", className].join(" ")}>
      {showImage ? (
        <img
          src={src}
          alt={alt}
          className={["rounded-md object-cover", sizeStyles[size]].join(" ")}
          onError={(e) => {
            setImgError(true);
            onError?.(e);
          }}
          {...props}
        />
      ) : (
        <div
          className={[
            "flex items-center justify-center rounded-md font-semibold text-white bg-stone-900",
            sizeStyles[size],
          ].join(" ")}
          aria-label={name || alt}
        >
          {name ? getInitials(name) : alt.charAt(0).toUpperCase()}
        </div>
      )}
      {online !== undefined && (
        <span
          className={[
            "absolute bottom-0 right-0 rounded-full border-white",
            online ? "bg-success-500" : "bg-stone-400",
            onlineSizeStyles[size],
          ].join(" ")}
          aria-label={online ? "En ligne" : "Hors ligne"}
        />
      )}
    </div>
  );
}

export { Avatar, type AvatarProps, type AvatarSize };
