"use client";

import { useState, useEffect } from "react";
import { Trash2, XCircle, CheckCircle, Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminService, type Signalement } from "@/services/admin.service";

export default function AdminSignalementsPage() {
  const [items, setItems] = useState<Signalement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getSignalements()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const resolve = async (id: string) => {
    try {
      await adminService.resolveSignalement(id);
      setItems((prev) =>
        prev.map((s) => (s.id === id ? { ...s, statut: "resolved" as const } : s))
      );
    } catch (err) {
      console.error("Erreur résolution signalement:", err);
    }
  };

  const dismiss = async (id: string) => {
    try {
      await adminService.dismissSignalement(id);
      setItems((prev) =>
        prev.map((s) => (s.id === id ? { ...s, statut: "dismissed" as const } : s))
      );
    } catch (err) {
      console.error("Erreur rejet signalement:", err);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer ce signalement ?")) return;
    try {
      await adminService.deleteSignalement(id);
      setItems((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Erreur suppression signalement:", err);
    }
  };

  const statutBadge = (statut: string) => {
    switch (statut) {
      case "pending":
        return <Badge variant="warning">En attente</Badge>;
      case "resolved":
        return <Badge variant="success">Résolu</Badge>;
      case "dismissed":
        return <Badge variant="default">Rejeté</Badge>;
      default:
        return null;
    }
  };

  const pendingCount = items.filter((s) => s.statut === "pending").length;

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Gestion des signalements</h1>
          <p className="text-stone-500 text-sm mt-2">Chargement...</p>
        </div>
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
                  <span className="font-semibold text-stone-900">{s.signaleur}</span>
                  {statutBadge(s.statut)}
                </div>
                <p className="text-sm text-stone-500 mb-1.5">
                  Commerce: <span className="font-medium text-stone-900">{s.commerce}</span>
                </p>
                {s.commentaireTexte && (
                  <p className="text-sm italic text-stone-600 mb-1.5 leading-relaxed">
                    &ldquo;{s.commentaireTexte}&rdquo;
                  </p>
                )}
                <p className="text-xs text-stone-400">
                  Raison: {s.raison} &middot; {new Date(s.date).toLocaleDateString("fr-FR")}
                </p>
              </div>
              {s.statut === "pending" && (
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => resolve(s.id)}>
                    <CheckCircle className="h-4 w-4 text-success-500" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => dismiss(s.id)}>
                    <XCircle className="h-4 w-4 text-stone-500" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => remove(s.id)}>
                    <Trash2 className="h-4 w-4 text-error-500" />
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
