"use client";

import { useState, useMemo } from "react";
import { Star, Calendar, Brain, ArrowUpDown } from "lucide-react";
import { Avatar, Badge, Skeleton } from "@/components/ui";
import { MessageSquareText } from "lucide-react";
import type { Commentaire } from "@/types";

interface ReviewListProps {
  reviews: Commentaire[];
  loading?: boolean;
}

type SortOption = "date" | "rating";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ReviewSkeleton() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <div className="flex items-start gap-3">
        <Skeleton variant="circle" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" height={16} className="w-1/3" />
          <Skeleton variant="text" height={14} className="w-1/4" />
          <Skeleton variant="text" height={14} className="w-full mt-2" />
          <Skeleton variant="text" height={14} className="w-3/4" />
        </div>
      </div>
    </div>
  );
}

export function ReviewList({ reviews, loading = false }: ReviewListProps) {
  const [sortBy, setSortBy] = useState<SortOption>("date");

  const sorted = useMemo(() => {
    const copy = [...reviews];
    if (sortBy === "date") {
      copy.sort(
        (a, b) =>
          new Date(b.dateCreation).getTime() -
          new Date(a.dateCreation).getTime()
      );
    } else {
      copy.sort((a, b) => b.note - a.note);
    }
    return copy;
  }, [reviews, sortBy]);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <ReviewSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-stone-100">
          <MessageSquareText className="h-10 w-10 text-stone-300" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-stone-900">
          Aucun avis
        </h3>
        <p className="text-sm text-stone-500">
          Soyez le premier à laisser un avis sur ce commerce.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-stone-700">
          {reviews.length} avis
        </h3>
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="h-3.5 w-3.5 text-stone-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="appearance-none rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-600 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 transition-all duration-200"
          >
            <option value="date">Plus récents</option>
            <option value="rating">Meilleure note</option>
          </select>
        </div>
      </div>

      {sorted.map((review) => (
        <div
          key={review.id}
          className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <Avatar
              src={review.auteur?.avatar}
              alt={review.auteur ? `${review.auteur.prenom} ${review.auteur.nom}` : "Utilisateur"}
              name={review.auteur ? `${review.auteur.prenom} ${review.auteur.nom}` : "U"}
              size="sm"
            />

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-stone-900">
                  {review.auteur
                    ? `${review.auteur.prenom} ${review.auteur.nom}`
                    : "Utilisateur"}
                </span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={[
                        "h-3.5 w-3.5",
                        i < review.note
                          ? "fill-primary-400 text-primary-400"
                          : "fill-transparent text-stone-300",
                      ].join(" ")}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1 text-xs text-stone-400">
                  <Calendar className="h-3 w-3" />
                  {formatDate(review.dateCreation)}
                </div>
              </div>

              <p className="mt-2.5 text-sm leading-relaxed text-stone-600">
                {review.texte}
              </p>

              {review.iaResume && (
                <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-info-50 px-4 py-3">
                  <Brain className="h-4 w-4 shrink-0 text-info-500 mt-0.5" />
                  <div>
                    <Badge variant="info" size="sm" className="mb-1.5">
                      Résumé IA
                    </Badge>
                    <p className="text-xs text-info-700 leading-relaxed">{review.iaResume}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
