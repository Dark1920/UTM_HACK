"use client";

import { useState, type FormEvent } from "react";
import { Search, MapPin, ChevronDown } from "lucide-react";
import { useSearchStore } from "@/stores/search.store";
import { CATEGORIES } from "@/constants";
import { Button } from "@/components/ui";

const VILLES = [
  "Ouagadougou",
  "Bobo-Dioulasso",
  "Koudougou",
  "Ouahigouya",
] as const;

export function SearchBar() {
  const { query, categorieId, ville, setQuery, setCategorie, setVille } =
    useSearchStore();

  const [localQuery, setLocalQuery] = useState(query);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setQuery(localQuery);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Rechercher un artisan, un service..."
          className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="relative">
        <select
          value={categorieId ?? ""}
          onChange={(e) => setCategorie(e.target.value || null)}
          className="h-full appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pl-3 pr-10 text-sm text-slate-700 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Toutes catégories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nom}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>

      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <select
          value={ville ?? ""}
          onChange={(e) => setVille(e.target.value || null)}
          className="h-full appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-10 text-sm text-slate-700 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Toutes villes</option>
          {VILLES.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>

      <Button type="submit" size="lg">
        <Search className="h-4 w-4" />
        Rechercher
      </Button>
    </form>
  );
}
