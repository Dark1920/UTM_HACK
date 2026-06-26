"use client";

import { useState } from "react";
import { AlertTriangle, Trash2, XCircle, CheckCircle, Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Signalement {
  id: string;
  signaleur: string;
  commentaireTexte: string;
  commerce: string;
  raison: string;
  date: string;
  statut: "pending" | "resolved" | "dismissed";
}

const MOCK_SIGNALEMENTS: Signalement[] = [
  {
    id: "sr-1",
    signaleur: "Amadou Ouédraogo",
    commentaireTexte: "Ce commerce est vraiment excellent, je recommande!",
    commerce: "Atelier de Soudure Merveille",
    raison: "Contenu publicitaire",
    date: "2026-06-20",
    statut: "pending",
  },
  {
    id: "sr-2",
    signaleur: "Fatimata Sawadogo",
    commentaireTexte: "Service horrible, ne vais jamais y retourner!!!",
    commerce: "Plomberie Sanitaire Plus",
    raison: "Langage injurieux",
    date: "2026-06-22",
    statut: "pending",
  },
  {
    id: "sr-3",
    signaleur: "Ibrahim Compaoré",
    commentaireTexte: "Venez acheter nos produits, promo exceptionnelle!",
    commerce: "Menuiserie Bois d'Or",
    raison: "Spam / publicité",
    date: "2026-06-24",
    statut: "pending",
  },
  {
    id: "sr-4",
    signaleur: "Rasmata Zongo",
    commentaireTexte: "Très bon travail, merci beaucoup!",
    commerce: "Coiffure Élégance",
    raison: "Faux avis",
    date: "2026-06-18",
    statut: "resolved",
  },
];

export default function AdminSignalementsPage() {
  const [items, setItems] = useState(MOCK_SIGNALEMENTS);

  const resolve = (id: string) => {
    setItems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, statut: "resolved" as const } : s))
    );
  };

  const dismiss = (id: string) => {
    setItems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, statut: "dismissed" as const } : s))
    );
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((s) => s.id !== id));
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gestion des signalements</h1>
        <p className="text-muted-foreground">
          {pendingCount} signalement{pendingCount !== 1 ? "s" : ""} en attente
        </p>
      </div>

      <div className="space-y-3">
        {items.map((s) => (
          <div key={s.id} className="rounded-lg border bg-white p-4 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Flag className="h-4 w-4 text-orange-500" />
                  <span className="font-medium">{s.signaleur}</span>
                  {statutBadge(s.statut)}
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  Commerce: <span className="font-medium text-foreground">{s.commerce}</span>
                </p>
                <p className="text-sm italic text-muted-foreground mb-1">
                  &ldquo;{s.commentaireTexte}&rdquo;
                </p>
                <p className="text-xs text-muted-foreground">
                  Raison: {s.raison} &middot; {s.date}
                </p>
              </div>
              {s.statut === "pending" && (
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => resolve(s.id)}>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => dismiss(s.id)}>
                    <XCircle className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => remove(s.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucun signalement</p>
        </div>
      )}
    </div>
  );
}
