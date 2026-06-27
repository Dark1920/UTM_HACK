-- Migration 0004: Table des avis
-- Avec champs pour l'IA (remplis plus tard par Edge Function)

CREATE TABLE IF NOT EXISTS avis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  commerce_id UUID NOT NULL REFERENCES commerces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
  note INTEGER NOT NULL CHECK (note >= 1 AND note <= 5),
  commentaire TEXT,
  sentiment VARCHAR(20) CHECK (sentiment IN ('positif', 'neutre', 'negatif')),
  is_spam BOOLEAN DEFAULT NULL,
  resume_ia TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les recherches par commerce et utilisateur
CREATE INDEX idx_avis_commerce_id ON avis(commerce_id);
CREATE INDEX idx_avis_user_id ON avis(user_id);

-- Contrainte: un utilisateur ne peut donner qu'un seul avis par commerce
CREATE UNIQUE INDEX idx_avis_unique_user_commerce ON avis(commerce_id, user_id);
