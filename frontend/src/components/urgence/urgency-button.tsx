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
        "flex items-center justify-center gap-2.5 rounded-md px-6 py-3.5 text-base font-semibold text-white transition-colors",
        active ? "bg-error-700" : "bg-error-600 hover:bg-error-700",
      ].join(" ")}
    >
      <Siren className="h-5 w-5" />
      URGENCE
    </button>
  );
}
