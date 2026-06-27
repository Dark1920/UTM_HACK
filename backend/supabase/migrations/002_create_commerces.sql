-- Migration : Création de la table commerces
-- Date : 2026-06-27

CREATE TABLE IF NOT EXISTS commerces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  categorie TEXT NOT NULL,
  adresse TEXT NOT NULL,
  telephone TEXT,
  description TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour la recherche par catégorie
CREATE INDEX IF NOT EXISTS idx_commerces_categorie ON commerces(categorie);

-- Index pour la recherche textuelle
CREATE INDEX IF NOT EXISTS idx_commerces_nom ON commerces USING gin(nom gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_commerces_description ON commerces USING gin(description gin_trgm_ops);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_commerces_updated_at
  BEFORE UPDATE ON commerces
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Politique RLS (Row Level Security)
ALTER TABLE commerces ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut lire les commerces
CREATE POLICY "Les commerces sont publics"
  ON commerces FOR SELECT
  USING (true);

-- Seuls les utilisateurs authentifiés peuvent créer des commerces
CREATE POLICY "Utilisateurs authentifiés peuvent créer"
  ON commerces FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Les utilisateurs peuvent modifier/supprimer leurs propres commerces
CREATE POLICY "Propriétaires peuvent modifier"
  ON commerces FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Propriétaires peuvent supprimer"
  ON commerces FOR DELETE
  USING (auth.uid() = user_id);
