"use client";

import { useState } from "react";
import { Star, Trash2, CheckCircle, AlertTriangle, MessageSquare } from "lucide-react";
import { mockCommentaires, mockCommerces } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Status = "all" | "approved" | "spam";

export default function AdminCommentairesPage() {
  const [filter, setFilter] = useState<Status>("all");
  const [items, setItems] = useState(mockCommentaires);

  const filtered = items.filter((c) => {
    if (filter === "approved") return !c.estSpam;
    if (filter === "spam") return c.estSpam;
    return true;
  });

  const approve = (id: string) => {
    setItems((prev) =>
      prev.map((c) => (c.id === id ? { ...c, estSpam: false } : c))
    );
  };

  const markSpam = (id: string) => {
    setItems((prev) =>
      prev.map((c) => (c.id === id ? { ...c, estSpam: true } : c))
    );
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((c) => c.id !== id));
  };

  const getCommerceName = (commerceId: string) => {
    return mockCommerces.find((c) => c.id === commerceId)?.nom || "Inconnu";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gestion des commentaires</h1>
        <p className="text-muted-foreground">{items.length} commentaires au total</p>
      </div>

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
            className="rounded-lg border bg-white p-4 space-y-2"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{c.auteurId}</span>
                  <span className="text-muted-foreground text-sm">
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
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < c.note
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {c.texte}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                {!c.estSpam && (
                  <Button variant="ghost" size="sm" onClick={() => markSpam(c.id)}>
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  </Button>
                )}
                {c.estSpam && (
                  <Button variant="ghost" size="sm" onClick={() => approve(c.id)}>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => remove(c.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucun commentaire trouvé</p>
        </div>
      )}
    </div>
  );
}
