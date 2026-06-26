'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { mockCommerces } from '@/lib/mock-data';
import { Plus, Edit2, Trash2, Eye, Star, X } from 'lucide-react';
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
          <h1 className="text-2xl font-bold text-gray-900">Mes commerces</h1>
          <p className="text-gray-500 text-sm mt-1">{commerces.length} commerce(s)</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg text-sm transition-colors"
        >
          <Plus className="h-4 w-4" />
          Ajouter
        </button>
      </div>

      {commerces.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Store className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun commerce</h3>
          <p className="text-gray-500 text-sm mb-4">
            Vous n&apos;avez pas encore ajouté de commerce.
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg text-sm transition-colors"
          >
            <Plus className="h-4 w-4" />
            Ajouter un commerce
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Commerce</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Catégorie</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Vues</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Note</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {commerces.map((commerce) => {
                  const categorie = CATEGORIES.find((c) => c.id === commerce.categorieId);
                  return (
                    <tr key={commerce.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">{commerce.nom}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{commerce.ville}</p>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="text-sm text-gray-600">{categorie?.nom || '-'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => togglePublic(commerce.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            commerce.estPublic ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              commerce.estPublic ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Eye className="h-4 w-4" />
                          {commerce.nombreVues}
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          {commerce.note.toFixed(1)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(commerce)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(commerce.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative z-10 w-full max-w-lg mx-4 bg-white rounded-xl shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingCommerce ? 'Modifier le commerce' : 'Nouveau commerce'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData((p) => ({ ...p, nom: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  placeholder="Nom du commerce"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none"
                  placeholder="Description du commerce"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  value={formData.categorieId}
                  onChange={(e) => setFormData((p) => ({ ...p, categorieId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <input
                  type="text"
                  value={formData.adresse}
                  onChange={(e) => setFormData((p) => ({ ...p, adresse: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  placeholder="Adresse"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  <input
                    type="text"
                    value={formData.ville}
                    onChange={(e) => setFormData((p) => ({ ...p, ville: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                    placeholder="Ville"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData((p) => ({ ...p, telephone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                    placeholder="+226 XX XX XX XX"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"
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

function Store(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
      <path d="M22 7v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7" />
    </svg>
  );
}
