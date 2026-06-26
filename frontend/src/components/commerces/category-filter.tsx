"use client";

import { useRef } from "react";
import {
  Wrench,
  Scissors,
  Hammer,
  Flame,
  Zap,
  Droplets,
  Smartphone,
  Snowflake,
  PaintBucket,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { CATEGORIES } from "@/constants";
import { useSearchStore } from "@/stores/search.store";
import type { Categorie } from "@/types";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench,
  Scissors,
  Hammer,
  Flame,
  Zap,
  Droplets,
  Smartphone,
  Snowflake,
  PaintBucket,
};

function getCategoryIcon(iconName: string) {
  return ICON_MAP[iconName] ?? Wrench;
}

export function CategoryFilter() {
  const { categorieId, setCategorie } = useSearchStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 200;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const handleSelect = (cat: Categorie) => {
    setCategorie(categorieId === cat.id ? null : cat.id);
  };

  return (
    <div className="relative">
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-1.5 shadow-md border border-slate-200 hover:bg-slate-50 transition-colors"
        aria-label="Défiler à gauche"
      >
        <ChevronLeft className="h-4 w-4 text-slate-600" />
      </button>

      <div
        ref={scrollRef}
        className="no-scrollbar flex gap-2 overflow-x-auto px-8 py-2"
      >
        <button
          onClick={() => setCategorie(null)}
          className={[
            "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
            categorieId === null
              ? "border-blue-600 bg-blue-600 text-white shadow-sm"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
          ].join(" ")}
        >
          Tous
        </button>

        {CATEGORIES.map((cat) => {
          const Icon = getCategoryIcon(cat.icone);
          const isActive = categorieId === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat)}
              className={[
                "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                isActive
                  ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              {cat.nom}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-1.5 shadow-md border border-slate-200 hover:bg-slate-50 transition-colors"
        aria-label="Défiler à droite"
      >
        <ChevronRight className="h-4 w-4 text-slate-600" />
      </button>
    </div>
  );
}
