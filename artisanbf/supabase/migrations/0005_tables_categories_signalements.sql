-- Migration 0005: Tables categories et signalements

-- Table des catégories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom VARCHAR(100) NOT NULL UNIQUE,
  icone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX idx_categories_nom ON categories(nom);

-- Table des signalements
CREATE TABLE IF NOT EXISTS signalements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type_cible VARCHAR(20) NOT NULL CHECK (type_cible IN ('commerce', 'avis')),
  cible_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
  raison TEXT NOT NULL,
  statut VARCHAR(20) NOT NULL DEFAULT 'en_cours' CHECK (statut IN ('en_cours', 'resolu', 'rejete')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les recherches par cible et statut
CREATE INDEX idx_signalements_type_cible ON signalements(type_cible);
CREATE INDEX idx_signalements_cible_id ON signalements(cible_id);
CREATE INDEX idx_signalements_statut ON signalements(statut);
CREATE INDEX idx_signalements_user_id ON signalements(user_id);

-- Trigger updated_at
CREATE TRIGGER update_signalements_updated_at
  BEFORE UPDATE ON signalements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Table des statistiques_commerces (tracking vues/appels/clics)
CREATE TABLE IF NOT EXISTS statistiques_commerces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  commerce_id UUID NOT NULL REFERENCES commerces(id) ON DELETE CASCADE,
  vues INTEGER DEFAULT 0,
  appels INTEGER DEFAULT 0,
  clics_whatsapp INTEGER DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les agrégations par commerce et date
CREATE INDEX idx_statistiques_commerce_id ON statistiques_commerces(commerce_id);
CREATE INDEX idx_statistiques_date ON statistiques_commerces(date);

-- Contrainte: une seule entrée par commerce et par jour
CREATE UNIQUE INDEX idx_statistiques_unique_commerce_date ON statistiques_commerces(commerce_id, date);
