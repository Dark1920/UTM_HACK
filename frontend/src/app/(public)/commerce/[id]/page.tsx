'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { Star, MapPin, Phone, MessageCircle, Heart, ArrowLeft, Send, Share2 } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { getCommerceById, mockCommerces, mockCategories, mockCommentaires, mockCitoyens } from '@/lib/mock-data';
import { usePexelsPhotos } from '@/hooks/usePexelsPhotos';
import { CATEGORY_PEXELS_QUERY } from '@/constants/pexels';
import { CommercePhoto } from '@/components/commerces/commerce-photo';
import MapLeaflet from '@/components/maps/map-leaflet';

function PhotoGallery({ photos: fallbackPhotos, name, categorieId }: { photos: string[]; name: string; categorieId: string }) {
  const [selected, setSelected] = useState(0);
  const { photos: pexelsPhotos } = usePexelsPhotos(CATEGORY_PEXELS_QUERY[categorieId] ?? null, 4);
  const photos = pexelsPhotos.length > 0 ? pexelsPhotos : fallbackPhotos;

  return (
    <div className="space-y-2.5">
      <div className="relative h-64 sm:h-80 lg:h-96 bg-stone-100 rounded-lg overflow-hidden">
        <img src={photos[selected] ?? photos[0]} alt={name} className="w-full h-full object-cover" />
      </div>
      {photos.length > 1 && (
        <div className="flex gap-2">
          {photos.map((photo, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`h-16 w-24 rounded-md overflow-hidden border-2 transition-colors ${
                selected === i ? 'border-stone-900' : 'border-transparent'
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
          <h1 className="text-xl font-semibold text-stone-900 mb-2">Commerce introuvable</h1>
          <p className="text-stone-500 mb-6">Ce commerce n&apos;existe pas ou a été supprimé.</p>
          <Link href={ROUTES.ANNUAIRE} className="text-stone-900 font-medium hover:underline">
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
    <div className="min-h-screen pb-24 lg:pb-8">
      <div className="border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link
            href={ROUTES.ANNUAIRE}
            className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l&apos;annuaire
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            <PhotoGallery photos={commerce.photos} name={commerce.nom} categorieId={commerce.categorieId} />

            <div className="rounded-lg border border-stone-200 p-6">
              <div className="flex items-start justify-between mb-4 gap-3">
                <div>
                  <span className="text-xs font-medium uppercase tracking-wide text-stone-400">
                    {category?.nom}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 mt-1.5 tracking-tight">
                    {commerce.nom}
                  </h1>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-2 rounded-md border transition-colors ${
                      isFavorite
                        ? 'bg-error-50 border-error-200 text-error-500'
                        : 'border-stone-300 text-stone-400 hover:text-error-500'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 rounded-md border border-stone-300 text-stone-400 hover:text-stone-900 transition-colors">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Star className="h-4 w-4 fill-primary-600 text-primary-600" />
                <span className="font-medium text-stone-900">{commerce.note}</span>
                <span className="text-sm text-stone-500">({commerce.nombreAvis} avis)</span>
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-stone-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-stone-900">{commerce.adresse}</p>
                    <p className="text-stone-500">{commerce.ville}</p>
                  </div>
                </div>
                {commerce.telephone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-stone-400 shrink-0" />
                    <span className="text-stone-900">{commerce.telephone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-stone-200 p-6">
              <h2 className="font-semibold text-stone-900 mb-3">Description</h2>
              <p className="text-stone-600 leading-relaxed">{commerce.description}</p>
            </div>

            <div className="rounded-lg border border-stone-200 overflow-hidden">
              <MapLeaflet
                className="h-64 w-full"
                center={[commerce.latitude, commerce.longitude]}
                zoom={15}
                markers={[{ id: commerce.id, position: [commerce.latitude, commerce.longitude], popup: commerce.nom }]}
              />
            </div>

            <div className="rounded-lg border border-stone-200 p-6">
              <h2 className="font-semibold text-stone-900 mb-4">Avis ({commerceReviews.length})</h2>

              {submitted ? (
                <div className="bg-success-50 border border-success-200 rounded-md p-3.5 mb-6">
                  <p className="text-success-700 text-sm font-medium">Merci ! Votre avis a été soumis.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="mb-6 border border-stone-200 rounded-md p-4">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-stone-800 mb-1.5">Votre note</label>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setReviewRating(star)} className="p-0.5">
                          <Star
                            className={`h-5 w-5 ${
                              star <= reviewRating ? 'fill-primary-600 text-primary-600' : 'fill-transparent text-stone-300'
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
                    className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 resize-none"
                  />
                  <button
                    type="submit"
                    disabled={!reviewText.trim() || reviewRating === 0}
                    className="mt-2.5 inline-flex items-center gap-2 h-9 px-4 bg-stone-900 text-white text-sm font-medium rounded-md hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Envoyer
                  </button>
                </form>
              )}

              <div className="space-y-4">
                {commerceReviews.length === 0 ? (
                  <p className="text-stone-400 text-sm text-center py-8">Aucun avis pour le moment.</p>
                ) : (
                  commerceReviews.map((review) => {
                    const author = mockCitoyens.find((c) => c.id === review.auteurId);
                    return (
                      <div key={review.id} className="border-b border-stone-200 last:border-0 pb-4 last:pb-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-md bg-stone-900 flex items-center justify-center">
                            <span className="text-xs font-medium text-white">
                              {author?.prenom?.[0]}{author?.nom?.[0]}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-stone-900">
                              {author?.prenom} {author?.nom}
                            </p>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < review.note ? 'fill-primary-600 text-primary-600' : 'fill-transparent text-stone-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-stone-400 ml-auto">
                            {new Date(review.dateCreation).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <p className="text-sm text-stone-600 ml-11">{review.texte}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="rounded-lg border border-stone-200 p-6 lg:sticky lg:top-20">
              <h2 className="font-semibold text-stone-900 mb-4">Contacter</h2>
              <div className="space-y-2.5">
                {commerce.telephone && (
                  <a
                    href={`tel:${commerce.telephone}`}
                    className="flex items-center justify-center gap-2 w-full h-11 bg-info-600 text-white font-medium rounded-md hover:bg-info-700 transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    Appeler
                  </a>
                )}
                {commerce.whatsapp && (
                  <a
                    href={`https://wa.me/${commerce.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full h-11 bg-success-600 text-white font-medium rounded-md hover:bg-success-700 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-stone-200">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-3">Statistiques</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Vues</span>
                    <span className="font-medium text-stone-900">{commerce.nombreVues}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Appels</span>
                    <span className="font-medium text-stone-900">{commerce.nombreAppels}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">WhatsApp</span>
                    <span className="font-medium text-stone-900">{commerce.nombreClicsWhatsApp}</span>
                  </div>
                </div>
              </div>
            </div>

            {related.length > 0 && (
              <div className="rounded-lg border border-stone-200 p-6">
                <h2 className="font-semibold text-stone-900 mb-4">Artisans similaires</h2>
                <div className="space-y-3.5">
                  {related.map((r) => (
                    <Link key={r.id} href={ROUTES.COMMERCE(r.id)} className="flex items-center gap-3 group">
                      <CommercePhoto
                        categorieId={r.categorieId}
                        fallbackSrc={r.photos[0]}
                        alt={r.nom}
                        className="w-12 h-12 rounded-md object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-stone-900 group-hover:underline truncate">{r.nom}</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-primary-600 text-primary-600" />
                          <span className="text-xs text-stone-600">{r.note}</span>
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
