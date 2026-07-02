"use client";

import { useState, useEffect } from "react";
import { Star, Trash2, CheckCircle, AlertTriangle, MessageSquare, Loader2 } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { commerceService } from "@/services/commerce.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Commentaire } from "@/types/commentaire";
import type { Commerce } from "@/types/commerce";

type Status = "all" | "approved" | "spam";

export default function AdminCommentairesPage() {
  const [filter, setFilter] = useState<Status>("all");
  const [items, setItems] = useState<Commentaire[]>([]);
  const [commerces, setCommerces] = useState<Commerce[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminService.getAvis(),
      commerceService.getAll(),
    ])
      .then(([avisRes, commercesData]) => {
        setItems(avisRes.avis);
        setCommerces(commercesData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((c) => {
    if (filter === "approved") return !c.estSpam;
    if (filter === "spam") return c.estSpam;
    return true;
  });

  const approve = async (id: string) => {
    try {
      // Mark as not spam by deleting the spam flag - backend may need a specific endpoint
      // For now, we optimistically update
      setItems((prev) =>
        prev.map((c) => (c.id === id ? { ...c, estSpam: false } : c))
      );
    } catch (error) {
      console.error("Failed to approve:", error);
    }
  };

  const markSpam = async (id: string) => {
    try {
      // Mark as spam - backend may need a specific endpoint
      setItems((prev) =>
        prev.map((c) => (c.id === id ? { ...c, estSpam: true } : c))
      );
    } catch (error) {
      console.error("Failed to mark spam:", error);
    }
  };

  const remove = async (id: string) => {
    try {
      await adminService.deleteAvis(id);
      setItems((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Failed to delete avis:", error);
    }
  };

  const getCommerceName = (commerceId: string) => {
    return commerces.find((c) => c.id === commerceId)?.nom || "Inconnu";
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Gestion des commentaires</h1>
        <p className="text-stone-500 text-sm mt-2">{items.length} commentaires au total</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
        </div>
      ) : (
      <>
      <div className="flex gap-2">
        {(["all", "approved", "spam"] as Status[]).map((s) => (
          <Button
            key={s}
            variant={filter === s ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilter(s)}
          >
            {s === "all" ? "Tous" : s === "approved" ? "Approuvés" : "Spam"}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="rounded-lg border border-stone-200 bg-white p-5 space-y-2 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-stone-900">{c.auteurId}</span>
                  <span className="text-stone-500 text-sm">
                    sur {getCommerceName(c.commerceId)}
                  </span>
                  {c.estSpam && (
                    <Badge variant="error">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Spam
                    </Badge>
                  )}
                  {c.iaScore !== undefined && (
                    <Badge variant="info">IA: {c.iaScore.toFixed(1)}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < c.note
                          ? "fill-primary-400 text-primary-400"
                          : "text-stone-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-stone-600 leading-relaxed line-clamp-2">
                  {c.texte}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                {!c.estSpam && (
                  <Button variant="ghost" size="sm" onClick={() => markSpam(c.id)}>
                    <AlertTriangle className="h-4 w-4 text-primary-500" />
                  </Button>
                )}
                {c.estSpam && (
                  <Button variant="ghost" size="sm" onClick={() => approve(c.id)}>
                    <CheckCircle className="h-4 w-4 text-success-500" />
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => remove(c.id)}>
                  <Trash2 className="h-4 w-4 text-error-500" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="h-20 w-20 rounded-lg bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-10 w-10 text-stone-300" />
          </div>
          <p className="text-stone-500 font-medium">Aucun commentaire trouvé</p>
        </div>
      )}
      </>
      )}
    </div>
  );
}
