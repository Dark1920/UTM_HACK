"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { CATEGORIES } from "@/constants/categories";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export default function AdminCategoriesPage() {
  const [items, setItems] = useState(CATEGORIES);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ nom: "", slug: "", icone: "", description: "" });

  const openCreate = () => {
    setEditingId(null);
    setForm({ nom: "", slug: "", icone: "", description: "" });
    setShowModal(true);
  };

  const openEdit = (id: string) => {
    const cat = items.find((c) => c.id === id);
    if (!cat) return;
    setEditingId(id);
    setForm({ nom: cat.nom, slug: cat.slug, icone: cat.icone, description: cat.description || "" });
    setShowModal(true);
  };

  const save = () => {
    if (!form.nom || !form.slug) return;
    if (editingId) {
      setItems((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? { ...c, nom: form.nom, slug: form.slug, icone: form.icone, description: form.description }
            : c
        )
      );
    } else {
      setItems((prev) => [
        ...prev,
        {
          id: `cat-${Date.now()}`,
          nom: form.nom,
          slug: form.slug,
          icone: form.icone,
          description: form.description,
          nombreCommerces: 0,
        },
      ]);
    }
    setShowModal(false);
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Gestion des catégories</h1>
          <p className="text-stone-500 text-sm mt-2">{items.length} catégories</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((cat) => (
          <div key={cat.id} className="rounded-lg border border-stone-200 bg-white p-5 space-y-3 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-stone-900">{cat.nom}</h3>
              <Badge variant="warm">{cat.nombreCommerces}</Badge>
            </div>
            {cat.description && (
              <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed">{cat.description}</p>
            )}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => openEdit(cat.id)}>
                <Pencil className="h-3.5 w-3.5 mr-1" />
                Modifier
              </Button>
              <Button variant="ghost" size="sm" onClick={() => remove(cat.id)}>
                <Trash2 className="h-3.5 w-3.5 text-error-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? "Modifier la catégorie" : "Nouvelle catégorie"}
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Nom</label>
            <input
              type="text"
              value={form.nom}
              onChange={(e) => setForm((p) => ({ ...p, nom: e.target.value }))}
              className="w-full rounded-lg border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 transition-all duration-200"
              placeholder="Ex: Mécanicien"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              className="w-full rounded-lg border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 transition-all duration-200"
              placeholder="Ex: mecanicien"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="w-full rounded-lg border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 transition-all duration-200"
              placeholder="Description optionnelle"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button onClick={save}>{editingId ? "Modifier" : "Créer"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
