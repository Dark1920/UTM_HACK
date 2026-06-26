'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { Star, MapPin, Phone, MessageCircle, Heart, ArrowLeft, Send, Share2 } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { getCommerceById, mockCommerces, mockCategories, mockCommentaires, mockCitoyens } from '@/lib/mock-data';
import type { Commentaire } from '@/types/commentaire';

function PhotoGallery({ photos, name }: { photos: string[]; name: string }) {
  const [selected, setSelected] = useState(0);
  return (
    <div className="space-y-3">
      <div className="relative h-64 sm:h-80 lg:h-96 bg-gray-100 rounded-xl overflow-hidden">
        <img
          src={photos[selected]}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      {photos.length > 1 && (
        <div className="flex gap-2">
          {photos.map((photo, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`h-16 w-24 rounded-lg overflow-hidden border-2 transition-colors ${
                selected === i ? 'border-amber-500' : 'border-transparent'
              }`}
            >
              <img src={photo} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommerceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const commerce = getCommerceById(id);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  if (!commerce) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Commerce introuvable</h1>
          <p className="text-gray-500 mb-6">Ce commerce n&apos;existe pas ou a été supprimé.</p>
          <Link href={ROUTES.ANNUAIRE} className="text-amber-600 hover:text-amber-700 font-medium">
            Retour à l&apos;annuaire
          </Link>
        </div>
      </div>
    );
  }

  const category = mockCategories.find((c) => c.id === commerce.categorieId);
  const commerceReviews = mockCommentaires.filter((c) => c.commerceId === commerce.id);
  const related = mockCommerces
    .filter((c) => c.categorieId === commerce.categorieId && c.id !== commerce.id)
    .slice(0, 3);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewText.trim() && reviewRating > 0) {
      setSubmitted(true);
      setReviewText('');
      setReviewRating(0);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24 lg:pb-8">
      {/* Back nav */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link
            href={ROUTES.ANNUAIRE}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-amber-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l&apos;annuaire
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <PhotoGallery photos={commerce.photos} name={commerce.nom} />

            {/* Info */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                    {category?.nom}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3">
                    {commerce.nom}
                  </h1>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-2 rounded-lg border transition-colors ${
                      isFavorite
                        ? 'bg-red-50 border-red-200 text-red-500'
                        : 'bg-white border-gray-200 text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-amber-600 transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-gray-900">{commerce.note}</span>
                <span className="text-sm text-gray-500">({commerce.nombreAvis} avis)</span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-gray-900">{commerce.adresse}</p>
                    <p className="text-gray-500">{commerce.ville}</p>
                  </div>
                </div>
                {commerce.telephone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="text-gray-900">{commerce.telephone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed">{commerce.description}</p>
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="h-64 bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <MapPin className="h-10 w-10 mx-auto mb-2" />
                  <p className="font-medium">Carte</p>
                  <p className="text-sm mt-1">Lat: {commerce.latitude}, Lng: {commerce.longitude}</p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">
                Avis ({commerceReviews.length})
              </h2>

              {/* Review form */}
              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-700 font-medium">Merci ! Votre avis a été soumis.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="mb-6 bg-gray-50 rounded-lg p-4">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Votre note</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-0.5"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= reviewRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-transparent text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Partagez votre expérience..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-100 focus:border-amber-300 outline-none resize-none"
                  />
                  <button
                    type="submit"
                    disabled={!reviewText.trim() || reviewRating === 0}
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="h-4 w-4" />
                    Envoyer
                  </button>
                </form>
              )}

              {/* Review list */}
              <div className="space-y-4">
                {commerceReviews.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">Aucun avis pour le moment.</p>
                ) : (
                  commerceReviews.map((review) => {
                    const author = mockCitoyens.find((c) => c.id === review.auteurId);
                    return (
                      <div key={review.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                            <span className="text-xs font-medium text-amber-700">
                              {author?.prenom?.[0]}{author?.nom?.[0]}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {author?.prenom} {author?.nom}
                            </p>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < review.note
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'fill-transparent text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-gray-400 ml-auto">
                            {new Date(review.dateCreation).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 ml-11">{review.texte}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact actions */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
              <h2 className="font-semibold text-gray-900 mb-4">Contacter</h2>
              <div className="space-y-3">
                {commerce.telephone && (
                  <a
                    href={`tel:${commerce.telephone}`}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <Phone className="h-5 w-5" />
                    Appeler
                  </a>
                )}
                {commerce.whatsapp && (
                  <a
                    href={`https://wa.me/${commerce.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                    WhatsApp
                  </a>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Statistiques</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Vues</span>
                    <span className="font-medium text-gray-900">{commerce.nombreVues}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Appels</span>
                    <span className="font-medium text-gray-900">{commerce.nombreAppels}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">WhatsApp</span>
                    <span className="font-medium text-gray-900">{commerce.nombreClicsWhatsApp}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Artisans similaires</h2>
                <div className="space-y-4">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      href={ROUTES.COMMERCE(r.id)}
                      className="flex items-center gap-3 group"
                    >
                      <img
                        src={r.photos[0]}
                        alt={r.nom}
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-amber-600 truncate transition-colors">
                          {r.nom}
                        </p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs text-gray-600">{r.note}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
