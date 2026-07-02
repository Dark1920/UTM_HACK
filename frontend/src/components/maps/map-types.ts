export interface MapMarker {
  id: string;
  position: [number, number];
  /** Texte simple (rétrocompat). Ignoré si `nom` est fourni. */
  popup?: string;
  nom?: string;
  categorie?: string;
  note?: number;
  adresse?: string;
  /** Distance en km (recherche géolocalisée). */
  distanceKm?: number;
  /** Couleur du pin (défaut : accent sombre). */
  color?: string;
}