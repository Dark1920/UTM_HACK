"use client";

import { useState } from "react";
import { Search, Eye, Trash2, CheckCircle, XCircle, Store } from "lucide-react";
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestion des commerces</h1>
          <p className="text-muted-foreground">{items.length} commerces au total</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher un commerce..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="hidden md:block rounded-lg border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Commerce</th>
              <th className="text-left px-4 py-3 font-medium">Ville</th>
              <th className="text-left px-4 py-3 font-medium">Catégorie</th>
              <th className="text-left px-4 py-3 font-medium">Statut</th>
              <th className="text-left px-4 py-3 font-medium">Vues</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{c.nom}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.ville}</td>
                <td className="px-4 py-3">
                  <Badge variant="default">{c.categorieId}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={c.estPublic ? "success" : "warning"}>
                    {c.estPublic ? "Publié" : "Brouillon"}
                  </Badge>
                </td>
                <td className="px-4 py-3">{c.nombreVues}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => toggleStatus(c.id)}>
                      {c.estPublic ? (
                        <XCircle className="h-4 w-4 text-orange-500" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(c.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
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
          <div key={c.id} className="rounded-lg border bg-white p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{c.nom}</h3>
              <Badge variant={c.estPublic ? "success" : "warning"}>
                {c.estPublic ? "Publié" : "Brouillon"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{c.ville}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => toggleStatus(c.id)}>
                {c.estPublic ? "Retirer" : "Publier"}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => remove(c.id)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Store className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucun commerce trouvé</p>
        </div>
      )}
    </div>
  );
}
