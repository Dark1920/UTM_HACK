"use client";

import Link from "next/link";
import { Pencil, Trash2, Eye, Star } from "lucide-react";
import { Badge, Skeleton, Button } from "@/components/ui";
import { ROUTES } from "@/constants";
import type { Commerce } from "@/types";

interface CommerceTableProps {
  commerces: Commerce[];
  loading?: boolean;
  onDelete?: (id: string) => void;
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4">
          <Skeleton variant="circle" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" height={16} className="w-1/3" />
            <Skeleton variant="text" height={14} className="w-1/4" />
          </div>
          <Skeleton variant="rectangle" width={80} height={28} />
          <Skeleton variant="rectangle" width={60} height={28} />
          <div className="flex gap-2">
            <Skeleton variant="rectangle" width={32} height={32} />
            <Skeleton variant="rectangle" width={32} height={32} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CommerceTable({ commerces, loading = false, onDelete }: CommerceTableProps) {
  if (loading) {
    return <TableSkeleton />;
  }

  if (commerces.length === 0) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
        <p className="text-sm text-stone-500">
          Vous n&apos;avez pas encore de commerce.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-stone-200 bg-white md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-100 bg-stone-50/50">
            <tr>
              <th className="px-5 py-3.5 font-semibold text-stone-600">Nom</th>
              <th className="px-5 py-3.5 font-semibold text-stone-600">Catégorie</th>
              <th className="px-5 py-3.5 font-semibold text-stone-600">Statut</th>
              <th className="px-5 py-3.5 font-semibold text-stone-600 text-right">Vues</th>
              <th className="px-5 py-3.5 font-semibold text-stone-600 text-right">Note</th>
              <th className="px-5 py-3.5 font-semibold text-stone-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {commerces.map((commerce) => (
              <tr key={commerce.id} className="transition-colors hover:bg-stone-50/50">
                <td className="px-5 py-4">
                  <Link
                    href={ROUTES.COMMERCE(commerce.id)}
                    className="font-semibold text-stone-900 hover:text-primary-600 transition-colors"
                  >
                    {commerce.nom}
                  </Link>
                </td>
                <td className="px-5 py-4 text-stone-600">
                  {commerce.categorie?.nom ?? "—"}
                </td>
                <td className="px-5 py-4">
                  <Badge
                    variant={commerce.estPublic ? "success" : "warning"}
                    size="sm"
                    dot
                  >
                    {commerce.estPublic ? "Publié" : "Brouillon"}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-right text-stone-600">
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5 text-stone-400" />
                    {commerce.nombreVues}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="inline-flex items-center gap-1 text-stone-600">
                    <Star className="h-3.5 w-3.5 fill-primary-400 text-primary-400" />
                    {commerce.note.toFixed(1)}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={ROUTES.COMMERCE(commerce.id)}
                      className="rounded-xl p-2 text-stone-400 transition-all duration-200 hover:bg-stone-100 hover:text-stone-600"
                      aria-label="Voir"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/dashboard/commerces/${commerce.id}/modifier`}
                      className="rounded-xl p-2 text-stone-400 transition-all duration-200 hover:bg-stone-100 hover:text-primary-600"
                      aria-label="Modifier"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => onDelete?.(commerce.id)}
                      className="rounded-xl p-2 text-stone-400 transition-all duration-200 hover:bg-error-50 hover:text-error-600"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {commerces.map((commerce) => (
          <div
            key={commerce.id}
            className="rounded-2xl border border-stone-200 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <Link
                  href={ROUTES.COMMERCE(commerce.id)}
                  className="text-sm font-semibold text-stone-900 hover:text-primary-600 transition-colors"
                >
                  {commerce.nom}
                </Link>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  {commerce.categorie && (
                    <Badge variant="warm" size="sm">
                      {commerce.categorie.nom}
                    </Badge>
                  )}
                  <Badge
                    variant={commerce.estPublic ? "success" : "warning"}
                    size="sm"
                    dot
                  >
                    {commerce.estPublic ? "Publié" : "Brouillon"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {commerce.nombreVues}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-primary-400 text-primary-400" />
                  {commerce.note.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 border-t border-stone-100 pt-3">
              <Link
                href={ROUTES.COMMERCE(commerce.id)}
                className="flex-1"
              >
                <Button variant="ghost" size="sm" className="w-full">
                  <Eye className="h-4 w-4" />
                  Voir
                </Button>
              </Link>
              <Link
                href={`/dashboard/commerces/${commerce.id}/modifier`}
                className="flex-1"
              >
                <Button variant="outline" size="sm" className="w-full">
                  <Pencil className="h-4 w-4" />
                  Modifier
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete?.(commerce.id)}
                className="text-error-500 hover:bg-error-50 hover:text-error-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
