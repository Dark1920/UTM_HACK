"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  showValue?: boolean;
  onChange?: (value: number) => void;
}

const sizeMap: Record<string, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

const textSizeMap: Record<string, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

function StarRating({
  value,
  max = 5,
  size = "md",
  interactive = false,
  showValue = false,
  onChange,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = hoverValue ?? value;

  const handleClick = (index: number) => {
    if (interactive && onChange) {
      onChange(index + 1);
    }
  };

  const getStarState = (index: number) => {
    if (displayValue >= index + 1) return "full";
    if (displayValue >= index + 0.5) return "half";
    return "empty";
  };

  return (
    <div className="inline-flex items-center gap-1">
      <div
        className="flex"
        onMouseLeave={() => interactive && setHoverValue(null)}
        role={interactive ? "radiogroup" : "img"}
        aria-label={`Rating: ${value} out of ${max}`}
      >
        {Array.from({ length: max }, (_, i) => {
          const state = getStarState(i);
          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => handleClick(i)}
              onMouseEnter={() => interactive && setHoverValue(i + 1)}
              className={[
                "transition-colors",
                interactive
                  ? "cursor-pointer hover:scale-110"
                  : "cursor-default",
                "disabled:cursor-default",
              ].join(" ")}
              aria-label={`${i + 1} star${i > 0 ? "s" : ""}`}
              tabIndex={interactive ? 0 : -1}
            >
              <Star
                className={[
                  sizeMap[size],
                  state === "full"
                    ? "fill-orange-400 text-orange-400"
                    : state === "half"
                      ? "fill-orange-400/50 text-orange-400"
                      : "fill-transparent text-slate-300",
                  "transition-colors",
                ].join(" ")}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className={["ml-1 font-medium text-slate-600", textSizeMap[size]].join(" ")}>
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export { StarRating, type StarRatingProps };
