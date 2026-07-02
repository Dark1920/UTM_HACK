"use client";

import { useState, useEffect } from "react";
import { Trash2, XCircle, CheckCircle, Flag, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminService } from "@/services/admin.service";
import { commerceService } from "@/services/commerce.service";
import type { Commerce } from "@/types/commerce";

interface Signalement {
  id: string;
  commerce_id: string;
  user_id: string;
  motif: string;
  description: string | null;
  statut: "en_cours" | "traite" | "ignore";
  created_at: string;
  updated_at: string;
  // Enriched fields
  commerceNom?: string;
  userEmail?: string;
}

const MOTIF_LABELS: Record<string, string> = {
  spam: "Spam",
  inapproprie: "Contenu inapproprié",
  fausse_info: "Fausse information",
  arnaque: "Arnaque",
  autre: "Autre",
};

export default function AdminSignalementsPage() {
  const [items, setItems] = useState<Signalement[]>([]);
  const [commerces, setCommerces] = useState<Commerce[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [sigRes, comRes] = await Promise.all([
          adminService.getSignalements({ limit: 100 }),
          commerceService.getAll(),
        ]);
        setCommerces(comRes);
        const signalements = (sigRes.signalements || []) as unknown as Signalement[];
        setItems(signalements);
      } catch (error) {
        console.error("Failed to load signalements:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const getCommerceName = (commerceId: string) => {
    const c = commerces.find((x) => x.id === commerceId);
    return c?.nom || "Commerce inconnu";
  };

  const resolve = async (id: string) => {
    try {
      await adminService.updateSignalement(id, { statut: "traite" });
      setItems((prev) =>
        prev.map((s) => (s.id === id ? { ...s, statut: "traite" } : s))
      );
    } catch (error) {
      console.error("Failed to resolve:", error);
    }
  };

  const dismiss = async (id: string) => {
    try {
      await adminService.updateSignalement(id, { statut: "ignore" });
      setItems((prev) =>
        prev.map((s) => (s.id === id ? { ...s, statut: "ignore" } : s))
      );
    } catch (error) {
      console.error("Failed to dismiss:", error);
    }
  };

  const statutBadge = (statut: string) => {
    switch (statut) {
      case "en_cours":
        return <Badge variant="warning">En attente</Badge>;
      case "traite":
        return <Badge variant="success">Résolu</Badge>;
      case "ignore":
        return <Badge variant="default">Rejeté</Badge>;
      default:
        return null;
    }
  };

  const pendingCount = items.filter((s) => s.statut === "en_cours").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Gestion des signalements</h1>
        <p className="text-stone-500 text-sm mt-2">
          {pendingCount} signalement{pendingCount !== 1 ? "s" : ""} en attente
        </p>
      </div>

      <div className="space-y-3">
        {items.map((s) => (
          <div key={s.id} className="rounded-lg border border-stone-200 bg-white p-5 space-y-3 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Flag className="h-4 w-4 text-primary-500" />
                  <span className="font-semibold text-stone-900">{getCommerceName(s.commerce_id)}</span>
                  {statutBadge(s.statut)}
                </div>
                <p className="text-sm text-stone-500 mb-1.5">
                  Motif: <span className="font-medium text-stone-900">{MOTIF_LABELS[s.motif] || s.motif}</span>
                </p>
                {s.description && (
                  <p className="text-sm italic text-stone-600 mb-1.5 leading-relaxed">
                    &ldquo;{s.description}&rdquo;
                  </p>
                )}
                <p className="text-xs text-stone-400">
                  Signalé par: {s.user_id} &middot; {new Date(s.created_at).toLocaleDateString("fr-FR")}
                </p>
              </div>
              {s.statut === "en_cours" && (
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => resolve(s.id)}>
                    <CheckCircle className="h-4 w-4 text-success-500" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => dismiss(s.id)}>
                    <XCircle className="h-4 w-4 text-stone-500" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-16">
          <div className="h-20 w-20 rounded-lg bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <Flag className="h-10 w-10 text-stone-300" />
          </div>
          <p className="text-stone-500 font-medium">Aucun signalement</p>
        </div>
      )}
    </div>
  );
}

