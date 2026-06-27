'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { mockCommerces } from '@/lib/mock-data';
import { Plus, Edit2, Trash2, Eye, Star, X, Store } from 'lucide-react';
import type { Commerce } from '@/types/commerce';
import { CATEGORIES } from '@/constants/categories';

export default function CommercesPage() {
  const { user } = useAuthStore();
  const [commerces, setCommerces] = useState<Commerce[]>(
    mockCommerces.filter((c) => c.artisanId === user?.id)
  );
  const [showModal, setShowModal] = useState(false);
  const [editingCommerce, setEditingCommerce] = useState<Commerce | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    categorieId: '',
    adresse: '',
    ville: '',
    telephone: '',
  });

  const handleOpenModal = (commerce?: Commerce) => {
    if (commerce) {
      setEditingCommerce(commerce);
      setFormData({
        nom: commerce.nom,
        description: commerce.description,
        categorieId: commerce.categorieId,
        adresse: commerce.adresse,
        ville: commerce.ville,
        telephone: commerce.telephone,
      });
    } else {
      setEditingCommerce(null);
      setFormData({ nom: '', description: '', categorieId: '', adresse: '', ville: '', telephone: '' });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingCommerce) {
      setCommerces((prev) =>
        prev.map((c) =>
          c.id === editingCommerce.id
            ? { ...c, ...formData, dateModification: new Date().toISOString() }
            : c
        )
      );
    } else {
      const newCommerce: Commerce = {
        id: `com-${Date.now()}`,
        ...formData,
        artisanId: user?.id || '',
        latitude: 12.3714,
        longitude: -1.5197,
        photos: [],
        note: 0,
        nombreAvis: 0,
        nombreVues: 0,
        nombreAppels: 0,
        nombreClicsWhatsApp: 0,
        estPublic: true,
        dateCreation: new Date().toISOString(),
        dateModification: new Date().toISOString(),
      };
      setCommerces((prev) => [...prev, newCommerce]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setCommerces((prev) => prev.filter((c) => c.id !== id));
  };

  const togglePublic = (id: string) => {
    setCommerces((prev) =>
      prev.map((c) => (c.id === id ? { ...c, estPublic: !c.estPublic } : c))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">Mes commerces</h1>
          <p className="text-stone-500 text-sm mt-1">{commerces.length} commerce(s)</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 h-9 px-4 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-md text-sm transition-colors"
        >
          <Plus className="h-4 w-4" />
          Ajouter
        </button>
      </div>

      {commerces.length === 0 ? (
        <div className="rounded-lg border border-dashed border-stone-300 p-12 text-center">
          <Store className="h-10 w-10 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-medium text-stone-900 mb-1">Aucun commerce</h3>
          <p className="text-stone-500 text-sm mb-4">
            Vous n&apos;avez pas encore ajouté de commerce.
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 h-9 px-4 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-md text-sm transition-colors"
          >
            <Plus className="h-4 w-4" />
            Ajouter un commerce
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase">Commerce</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase hidden sm:table-cell">Catégorie</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase">Statut</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase hidden md:table-cell">Vues</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase hidden md:table-cell">Note</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-stone-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {commerces.map((commerce) => {
                  const categorie = CATEGORIES.find((c) => c.id === commerce.categorieId);
                  return (
                    <tr key={commerce.id} className="hover:bg-stone-50">
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-medium text-stone-900">{commerce.nom}</p>
                        <p className="text-xs text-stone-500 truncate max-w-[200px]">{commerce.ville}</p>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        <span className="text-sm text-stone-600">{categorie?.nom || '-'}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => togglePublic(commerce.id)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            commerce.estPublic ? 'bg-success-600' : 'bg-stone-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                              commerce.estPublic ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <div className="flex items-center gap-1 text-sm text-stone-600">
                          <Eye className="h-4 w-4" />
                          {commerce.nombreVues}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <div className="flex items-center gap-1 text-sm text-stone-600">
                          <Star className="h-4 w-4 fill-primary-600 text-primary-600" />
                          {commerce.note.toFixed(1)}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenModal(commerce)}
                            className="p-2 text-stone-400 hover:text-info-600 hover:bg-info-50 rounded-md transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(commerce.id)}
                            className="p-2 text-stone-400 hover:text-error-600 hover:bg-error-50 rounded-md transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-stone-900/50" onClick={() => setShowModal(false)} />
          <div className="relative z-10 w-full max-w-lg mx-4 bg-white rounded-lg border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
              <h2 className="text-base font-semibold text-stone-900">
                {editingCommerce ? 'Modifier le commerce' : 'Nouveau commerce'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-800 mb-1.5">Nom</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData((p) => ({ ...p, nom: e.target.value }))}
                  className="w-full h-10 px-3 border border-stone-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900"
                  placeholder="Nom du commerce"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-800 mb-1.5">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 resize-none"
                  placeholder="Description du commerce"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-800 mb-1.5">Catégorie</label>
                <select
                  value={formData.categorieId}
                  onChange={(e) => setFormData((p) => ({ ...p, categorieId: e.target.value }))}
                  className="w-full h-10 px-3 border border-stone-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-800 mb-1.5">Adresse</label>
                <input
                  type="text"
                  value={formData.adresse}
                  onChange={(e) => setFormData((p) => ({ ...p, adresse: e.target.value }))}
                  className="w-full h-10 px-3 border border-stone-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900"
                  placeholder="Adresse"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-stone-800 mb-1.5">Ville</label>
                  <input
                    type="text"
                    value={formData.ville}
                    onChange={(e) => setFormData((p) => ({ ...p, ville: e.target.value }))}
                    className="w-full h-10 px-3 border border-stone-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900"
                    placeholder="Ville"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-800 mb-1.5">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData((p) => ({ ...p, telephone: e.target.value }))}
                    className="w-full h-10 px-3 border border-stone-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900"
                    placeholder="+226 XX XX XX XX"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2.5 border-t border-stone-200 px-5 py-4">
              <button
                onClick={() => setShowModal(false)}
                className="h-9 px-4 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-md transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="h-9 px-4 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors"
              >
                {editingCommerce ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
