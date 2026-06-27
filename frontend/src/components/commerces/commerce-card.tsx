"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MapPin, Phone, MessageCircle, Star } from "lucide-react";
import { Badge } from "@/components/ui";
import { useFavorites } from "@/hooks/useFavorites";
import { genererLienWhatsApp } from "@/utils/phone";
import { formaterDistance } from "@/utils/distance";
import { ROUTES } from "@/constants";
import type { Commerce } from "@/types";

interface CommerceCardProps {
  commerce: Commerce;
  distance?: number | null;
}

export function CommerceCard({ commerce, distance }: CommerceCardProps) {
  const [imgError, setImgError] = useState(false);
  const { isFavori, toggleFavori } = useFavorites();
  const favori = isFavori(commerce.id);

  const photoUrl =
    commerce.photos.length > 0 && !imgError ? commerce.photos[0] : null;

  return (
    <Link
      href={ROUTES.COMMERCE(commerce.id)}
      className="group block rounded-2xl border border-stone-200/60 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-stone-100">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={commerce.nom}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-stone-100">
            <span className="text-4xl font-bold text-stone-300">
              {commerce.nom.charAt(0)}
            </span>
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavori(commerce.id);
          }}
          className={[
            "absolute right-3 top-3 rounded-xl p-2.5 transition-all duration-200 active:scale-90",
            favori
              ? "bg-error-500 text-white shadow-lg shadow-error-200/50"
              : "bg-white/80 backdrop-blur-sm text-stone-500 hover:bg-white hover:text-error-500",
          ].join(" ")}
          aria-label={favori ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart
            className="h-4 w-4"
            fill={favori ? "currentColor" : "none"}
          />
        </button>

        {distance != null && distance > 0 && (
          <div className="absolute bottom-3 left-3 rounded-xl bg-stone-900/70 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-white">
            {formaterDistance(distance)}
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="mb-2.5 flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-stone-900 group-hover:text-primary-600 transition-colors line-clamp-1">
            {commerce.nom}
          </h3>
          {commerce.categorie && (
            <Badge variant="warm" size="sm">
              {commerce.categorie.nom}
            </Badge>
          )}
        </div>

        <div className="mb-3 flex items-center gap-1">
          <Star className="h-4 w-4 fill-primary-400 text-primary-400" />
          <span className="text-sm font-medium text-stone-700">
            {commerce.note.toFixed(1)}
          </span>
          <span className="text-xs text-stone-400">
            ({commerce.nombreAvis})
          </span>
        </div>

        <div className="mb-4 flex items-center gap-1.5 text-sm text-stone-500">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="line-clamp-1">{commerce.adresse}</span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${commerce.telephone}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 rounded-xl border border-stone-200 px-3.5 py-2 text-xs font-medium text-stone-700 transition-all duration-200 hover:bg-stone-50 hover:border-stone-300"
          >
            <Phone className="h-3.5 w-3.5" />
            Appeler
          </a>
          <a
            href={genererLienWhatsApp(
              commerce.whatsapp ?? commerce.telephone
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 rounded-xl bg-success-500 px-3.5 py-2 text-xs font-medium text-white transition-all duration-200 hover:bg-success-600 active:scale-[0.98]"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>
        </div>
      </div>
    </Link>
  );
}
