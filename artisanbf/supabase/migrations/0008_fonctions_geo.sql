-- Migration 0008: Fonctions SQL pour la géolocalisation (PostGIS)
-- Fonctions utilitaires pour les requêtes de proximité

-- ============================================
-- Fonction: Trouver les commerces proches
-- Utilise ST_DIndex pour une recherche efficace
-- ============================================

CREATE OR REPLACE FUNCTION get_commerces_proches(
  p_latitude DOUBLE PRECISION,
  p_longitude DOUBLE PRECISION,
  p_radius_meters INTEGER DEFAULT 5000,
  p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  nom VARCHAR,
  description TEXT,
  telephone VARCHAR,
  adresse_texte VARCHAR,
  note_moyenne DECIMAL,
  nb_avis INTEGER,
  distance_meters DOUBLE PRECISION,
  localisation GEOGRAPHY(Point, 4326)
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.nom,
    c.description,
    c.telephone,
    c.adresse_texte,
    c.note_moyenne,
    c.nb_avis,
    ST_Distance(
      c.localisation,
      ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)::geography
    ) AS distance_meters,
    c.localisation
  FROM commerces c
  WHERE c.statut = 'publie'
    AND ST_DWithin(
      c.localisation,
      ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)::geography,
      p_radius_meters
    )
  ORDER BY distance_meters ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- Fonction: Rechercher des commerces par texte
-- Recherche full-text sur nom, description, adresse
-- ============================================

CREATE OR REPLACE FUNCTION search_commerces(
  p_search_text TEXT,
  p_latitude DOUBLE PRECISION DEFAULT NULL,
  p_longitude DOUBLE PRECISION DEFAULT NULL,
  p_radius_meters INTEGER DEFAULT 10000,
  p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  nom VARCHAR,
  description TEXT,
  telephone VARCHAR,
  adresse_texte VARCHAR,
  note_moyenne DECIMAL,
  nb_avis INTEGER,
  distance_meters DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.nom,
    c.description,
    c.telephone,
    c.adresse_texte,
    c.note_moyenne,
    c.nb_avis,
    CASE
      WHEN p_latitude IS NOT NULL AND p_longitude IS NOT NULL THEN
        ST_Distance(
          c.localisation,
          ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)::geography
        )
      ELSE NULL
    END AS distance_meters
  FROM commerces c
  WHERE c.statut = 'publie'
    AND (
      to_tsvector('french', c.nom || ' ' || COALESCE(c.description, '') || ' ' || COALESCE(c.adresse_texte, ''))
      @@ to_tsquery('french', p_search_text)
      OR c.nom ILIKE '%' || p_search_text || '%'
      OR c.description ILIKE '%' || p_search_text || '%'
      OR c.adresse_texte ILIKE '%' || p_search_text || '%'
    )
    AND (
      p_latitude IS NULL
      OR p_longitude IS NULL
      OR ST_DWithin(
        c.localisation,
        ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)::geography,
        p_radius_meters
      )
    )
  ORDER BY
    CASE WHEN distance_meters IS NOT NULL THEN distance_meters ELSE 999999 END ASC,
    c.note_moyenne DESC,
    c.nb_avis DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- Index GIN pour la recherche full-text
CREATE INDEX IF NOT EXISTS idx_commerces_search ON commerces
  USING GIN (to_tsvector('french', nom || ' ' || COALESCE(description, '') || ' ' || COALESCE(adresse_texte, '')));
