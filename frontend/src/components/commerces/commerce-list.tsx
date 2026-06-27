"use client";

import { CommerceCard } from "./commerce-card";
import { Skeleton } from "@/components/ui";
import { SearchX } from "lucide-react";
import type { Commerce } from "@/types";

interface CommerceListProps {
  commerces: Commerce[];
  distances?: Record<string, number>;
  loading?: boolean;
  totalResults?: number;
}

function CardSkeleton() {
  return (
    <div className="rounded-lg border border-stone-200 bg-white overflow-hidden">
      <Skeleton variant="rectangle" height={192} />
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Skeleton variant="text" height={20} className="w-2/3" />
          <Skeleton variant="text" height={20} className="w-16" />
        </div>
        <Skeleton variant="text" height={16} className="w-1/3" />
        <Skeleton variant="text" height={16} className="w-3/4" />
        <div className="flex gap-2">
          <Skeleton variant="text" height={32} className="w-20" />
          <Skeleton variant="text" height={32} className="w-24" />
        </div>
      </div>
    </div>
  );
}

export function CommerceList({
  commerces,
  distances = {},
  loading = false,
  totalResults,
}: CommerceListProps) {
  if (loading) {
    return (
      <div>
        <div className="mb-4">
          <Skeleton variant="text" height={16} className="w-32" />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (commerces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-stone-300 rounded-lg">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-stone-200 text-stone-400">
          <SearchX className="h-6 w-6" />
        </div>
        <h3 className="mb-1.5 text-base font-semibold text-stone-900">
          Aucun résultat trouvé
        </h3>
        <p className="max-w-sm text-sm text-stone-500 leading-relaxed">
          Essayez de modifier vos filtres ou votre recherche pour trouver
          l&apos;artisan que vous cherchez.
        </p>
      </div>
    );
  }

  return (
    <div>
      {totalResults != null && (
        <p className="mb-5 text-sm text-stone-500">
          <span className="font-medium text-stone-900">{totalResults}</span>{" "}
          résultat{totalResults > 1 ? "s" : ""}
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {commerces.map((commerce) => (
          <CommerceCard
            key={commerce.id}
            commerce={commerce}
            distance={distances[commerce.id]}
          />
        ))}
      </div>
    </div>
  );
}
