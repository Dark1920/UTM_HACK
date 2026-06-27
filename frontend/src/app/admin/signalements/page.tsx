"use client";

import { useState } from "react";
import { Trash2, XCircle, CheckCircle, Flag } from "lucide-react";
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
                <p className="text-sm italic text-stone-600 mb-1.5 leading-relaxed">
                  &ldquo;{s.commentaireTexte}&rdquo;
                </p>
                <p className="text-xs text-stone-400">
                  Raison: {s.raison} &middot; {s.date}
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
