"use client";

import { useState } from "react";
import { Search, Trash2, CheckCircle, XCircle, Store } from "lucide-react";
import { mockCommerces } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const commerces = mockCommerces;

export default function AdminCommercesPage() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState(commerces);

  const filtered = items.filter(
    (c) =>
      c.nom.toLowerCase().includes(search.toLowerCase()) ||
      c.ville.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setItems((prev) =>
      prev.map((c) => (c.id === id ? { ...c, estPublic: !c.estPublic } : c))
    );
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Gestion des commerces</h1>
          <p className="text-stone-500 text-sm mt-2">{items.length} commerces au total</p>
        </div>
      </div>

      <div className="relative max-w-md group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 group-focus-within:text-primary-500 transition-colors" />
        <input
          type="text"
          placeholder="Rechercher un commerce..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-stone-200 bg-white pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 transition-all duration-200 hover:border-stone-300"
        />
      </div>

      <div className="hidden md:block rounded-lg border border-stone-200 bg-white overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-stone-50/50 border-b border-stone-100">
            <tr>
              <th className="text-left px-5 py-3.5 font-semibold text-stone-600">Commerce</th>
              <th className="text-left px-5 py-3.5 font-semibold text-stone-600">Ville</th>
              <th className="text-left px-5 py-3.5 font-semibold text-stone-600">Catégorie</th>
              <th className="text-left px-5 py-3.5 font-semibold text-stone-600">Statut</th>
              <th className="text-left px-5 py-3.5 font-semibold text-stone-600">Vues</th>
              <th className="text-right px-5 py-3.5 font-semibold text-stone-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-5 py-4 font-semibold text-stone-900">{c.nom}</td>
                <td className="px-5 py-4 text-stone-600">{c.ville}</td>
                <td className="px-5 py-4">
                  <Badge variant="warm">{c.categorieId}</Badge>
                </td>
                <td className="px-5 py-4">
                  <Badge variant={c.estPublic ? "success" : "warning"}>
                    {c.estPublic ? "Publié" : "Brouillon"}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-stone-600">{c.nombreVues}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => toggleStatus(c.id)}>
                      {c.estPublic ? (
                        <XCircle className="h-4 w-4 text-primary-500" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-success-500" />
                      )}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(c.id)}>
                      <Trash2 className="h-4 w-4 text-error-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {filtered.map((c) => (
          <div key={c.id} className="rounded-lg border border-stone-200 bg-white p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-stone-900">{c.nom}</h3>
              <Badge variant={c.estPublic ? "success" : "warning"}>
                {c.estPublic ? "Publié" : "Brouillon"}
              </Badge>
            </div>
            <p className="text-sm text-stone-500">{c.ville}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => toggleStatus(c.id)}>
                {c.estPublic ? "Retirer" : "Publier"}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => remove(c.id)}>
                <Trash2 className="h-4 w-4 text-error-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="h-20 w-20 rounded-lg bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <Store className="h-10 w-10 text-stone-300" />
          </div>
          <p className="text-stone-500 font-medium">Aucun commerce trouvé</p>
        </div>
      )}
    </div>
  );
}
