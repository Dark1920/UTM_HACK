"use client";

import { MapPin, Phone, MessageCircle, Loader2, Star } from "lucide-react";
import { Badge, Skeleton } from "@/components/ui";
import { genererLienWhatsApp } from "@/utils/phone";
import { formaterDistance } from "@/utils/distance";
import type { Commerce } from "@/types";

interface NearbyArtisansProps {
  artisans: (Commerce & { distance?: number })[];
  loading?: boolean;
}

function ArtisanSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-stone-200 bg-white p-4">
      <Skeleton variant="circle" width={48} height={48} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" height={16} className="w-1/2" />
        <Skeleton variant="text" height={14} className="w-1/3" />
      </div>
      <div className="flex gap-2">
        <Skeleton variant="rectangle" width={64} height={32} />
        <Skeleton variant="rectangle" width={64} height={32} />
      </div>
    </div>
  );
}

export function NearbyArtisans({ artisans, loading = false }: NearbyArtisansProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-stone-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Recherche des artisans à proximité...
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <ArtisanSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (artisans.length === 0) {
    return (
      <div className="py-8 text-center">
        <MapPin className="mx-auto mb-3 h-8 w-8 text-stone-300" />
        <p className="text-sm text-stone-500">Aucun artisan trouvé à proximité.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {artisans.map((artisan) => (
        <div
          key={artisan.id}
          className="flex items-center gap-4 rounded-lg border border-stone-200 bg-white p-4 transition-colors hover:border-stone-400"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-stone-900 text-white font-semibold">
            {artisan.nom.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-stone-900 truncate">{artisan.nom}</h4>
              {artisan.categorie && (
                <Badge variant="default" size="sm">
                  {artisan.categorie.nom}
                </Badge>
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-3 text-xs text-stone-500">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-primary-600 text-primary-600" />
                {artisan.note.toFixed(1)}
              </span>
              {artisan.distance != null && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {formaterDistance(artisan.distance)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href={`tel:${artisan.telephone}`}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-stone-300 text-stone-600 transition-colors hover:border-stone-900"
              aria-label="Appeler"
            >
              <Phone className="h-4 w-4" />
            </a>
            <a
              href={genererLienWhatsApp(artisan.whatsapp ?? artisan.telephone)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-md bg-success-600 text-white transition-colors hover:bg-success-700"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
