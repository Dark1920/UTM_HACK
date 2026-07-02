-- Migration : Création de la table commerces
-- Schéma aligné sur les routes /api/commerces et le mapping frontend (mapCommerce).
-- Dépend de utilisateurs (000) et categories (001).

CREATE TABLE IF NOT EXISTS commerces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  description TEXT,
  categorie_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  artisan_id UUID REFERENCES utilisateurs(id) ON DELETE CASCADE,
  adresse TEXT NOT NULL,
  ville TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  telephone TEXT,
  whatsapp TEXT,
  email TEXT,
  photos TEXT[] NOT NULL DEFAULT '{}',
  note_moyenne DECIMAL(4, 2) NOT NULL DEFAULT 0,
  nombre_avis INTEGER NOT NULL DEFAULT 0,
  nombre_vues INTEGER NOT NULL DEFAULT 0,
  nombre_appels INTEGER NOT NULL DEFAULT 0,
  nombre_clics_whatsapp INTEGER NOT NULL DEFAULT 0,
  est_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les filtres courants
CREATE INDEX IF NOT EXISTS idx_commerces_categorie ON commerces(categorie_id);
CREATE INDEX IF NOT EXISTS idx_commerces_artisan ON commerces(artisan_id);
CREATE INDEX IF NOT EXISTS idx_commerces_public ON commerces(est_public);

-- Trigger updated_at (fonction créée ici, réutilisée par les autres tables)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_commerces_updated_at ON commerces;

CREATE TRIGGER update_commerces_updated_at
  BEFORE UPDATE ON commerces
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE commerces ENABLE ROW LEVEL SECURITY;

-- Lecture publique des commerces publiés
CREATE POLICY "Commerces publics en lecture"
  ON commerces FOR SELECT
  USING (est_public = true);

-- Seuls les utilisateurs authentifiés peuvent créer un commerce
CREATE POLICY "Utilisateurs authentifiés peuvent créer"
  ON commerces FOR INSERT
  WITH CHECK (auth.uid() = artisan_id);

-- Les propriétaires peuvent modifier / supprimer leurs commerces
CREATE POLICY "Propriétaires peuvent modifier"
  ON commerces FOR UPDATE
  USING (auth.uid() = artisan_id);

CREATE POLICY "Propriétaires peuvent supprimer"
  ON commerces FOR DELETE
  USING (auth.uid() = artisan_id);
