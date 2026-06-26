"use client";

import { Siren } from "lucide-react";

interface UrgencyButtonProps {
  onClick: () => void;
  active?: boolean;
}

export function UrgencyButton({ onClick, active = false }: UrgencyButtonProps) {
  return (
    <button
      onClick={onClick}
      className={[
        "group relative flex items-center justify-center gap-3 rounded-2xl px-8 py-5 text-lg font-bold text-white transition-all",
        active
          ? "bg-red-700 shadow-xl scale-105"
          : "bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl",
      ].join(" ")}
    >
      <span className="absolute inset-0 rounded-2xl bg-red-500 animate-ping opacity-20" />
      <span className="relative flex items-center gap-3">
        <Siren className="h-7 w-7" />
        URGENCE
      </span>
    </button>
  );
}
