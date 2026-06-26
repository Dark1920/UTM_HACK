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
      className="group block rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-slate-100">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={commerce.nom}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100">
            <span className="text-4xl text-slate-300">
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
            "absolute right-3 top-3 rounded-full p-2 transition-all",
            favori
              ? "bg-red-500 text-white"
              : "bg-white/80 text-slate-500 hover:bg-white hover:text-red-500",
          ].join(" ")}
          aria-label={favori ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart
            className="h-4 w-4"
            fill={favori ? "currentColor" : "none"}
          />
        </button>

        {distance != null && distance > 0 && (
          <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {formaterDistance(distance)}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {commerce.nom}
          </h3>
          {commerce.categorie && (
            <Badge variant="info" size="sm">
              {commerce.categorie.nom}
            </Badge>
          )}
        </div>

        <div className="mb-3 flex items-center gap-1">
          <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
          <span className="text-sm font-medium text-slate-700">
            {commerce.note.toFixed(1)}
          </span>
          <span className="text-xs text-slate-400">
            ({commerce.nombreAvis})
          </span>
        </div>

        <div className="mb-4 flex items-center gap-1.5 text-sm text-slate-500">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="line-clamp-1">{commerce.adresse}</span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${commerce.telephone}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
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
            className="flex items-center gap-1.5 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-600"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>
        </div>
      </div>
    </Link>
  );
}
