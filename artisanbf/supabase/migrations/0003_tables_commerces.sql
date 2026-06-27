-- Migration 0003: Table des commerces
-- Avec géolocalisation PostGIS (geography Point)

CREATE TABLE IF NOT EXISTS commerces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
  nom VARCHAR(255) NOT NULL,
  description TEXT,
  categorie_id UUID,
  telephone VARCHAR(20),
  localisation GEOGRAPHY(Point, 4326),
  adresse_texte VARCHAR(500),
  statut VARCHAR(20) NOT NULL DEFAULT 'brouillon' CHECK (statut IN ('brouillon', 'publie', 'depublie')),
  note_moyenne DECIMAL(3, 2) DEFAULT 0.00,
  nb_avis INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index GIST pour les requêtes de proximité spatiale
CREATE INDEX idx_commerces_localisation ON commerces USING GIST (localisation);

-- Index pour les recherches par utilisateur et statut
CREATE INDEX idx_commerces_user_id ON commerces(user_id);
CREATE INDEX idx_commerces_statut ON commerces(statut);
CREATE INDEX idx_commerces_categorie_id ON commerces(categorie_id);

-- Trigger updated_at
CREATE TRIGGER update_commerces_updated_at
  BEFORE UPDATE ON commerces
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
