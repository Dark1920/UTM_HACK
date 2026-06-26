"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { StarRating, Button } from "@/components/ui";

interface ReviewFormProps {
  commerceId: string;
  onSubmit: (data: { texte: string; note: number }) => Promise<void>;
}

const MAX_CHARS = 500;

export function ReviewForm({ commerceId, onSubmit }: ReviewFormProps) {
  const [note, setNote] = useState(0);
  const [texte, setTexte] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (note === 0) {
      setError("Veuillez sélectionner une note.");
      return;
    }
    if (texte.trim().length < 10) {
      setError("Votre avis doit contenir au moins 10 caractères.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ texte: texte.trim(), note });
      setNote(0);
      setTexte("");
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-base font-semibold text-slate-900">
        Laisser un avis
      </h3>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Votre note
        </label>
        <StarRating
          value={note}
          size="lg"
          interactive
          onChange={setNote}
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor={`review-text-${commerceId}`}
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Votre avis
        </label>
        <textarea
          id={`review-text-${commerceId}`}
          value={texte}
          onChange={(e) => setTexte(e.target.value.slice(0, MAX_CHARS))}
          rows={4}
          placeholder="Décrivez votre expérience..."
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <div className="mt-1 flex items-center justify-between">
          <span
            className={[
              "text-xs",
              texte.length > MAX_CHARS * 0.9
                ? "text-orange-500"
                : "text-slate-400",
            ].join(" ")}
          >
            {texte.length}/{MAX_CHARS}
          </span>
          {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
      </div>

      <Button type="submit" loading={loading} disabled={note === 0}>
        <Send className="h-4 w-4" />
        Publier l&apos;avis
      </Button>
    </form>
  );
}
