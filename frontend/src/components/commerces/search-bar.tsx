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
      <div className="relative flex-1 group">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 group-focus-within:text-primary-500 transition-colors" />
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Rechercher un artisan, un service..."
          className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-11 pr-4 text-sm text-stone-900 placeholder:text-stone-400 transition-all duration-200 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 hover:border-stone-300"
        />
      </div>

      <div className="relative">
        <select
          value={categorieId ?? ""}
          onChange={(e) => setCategorie(e.target.value || null)}
          className="h-full appearance-none rounded-xl border border-stone-200 bg-white py-3 pl-4 pr-10 text-sm text-stone-700 transition-all duration-200 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 hover:border-stone-300"
        >
          <option value="">Toutes catégories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nom}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
      </div>

      <div className="relative">
        <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <select
          value={ville ?? ""}
          onChange={(e) => setVille(e.target.value || null)}
          className="h-full appearance-none rounded-xl border border-stone-200 bg-white py-3 pl-9 pr-10 text-sm text-stone-700 transition-all duration-200 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 hover:border-stone-300"
        >
          <option value="">Toutes villes</option>
          {VILLES.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
      </div>

      <Button type="submit" size="lg">
        <Search className="h-4 w-4" />
        Rechercher
      </Button>
    </form>
  );
}
