-- Migration : Création de la table avis
-- Schéma aligné sur les routes /api/avis (commentaire, note, sentiment, score_sentiment, is_spam).
-- Dépend de commerces (002) et utilisateurs (000).

CREATE TABLE IF NOT EXISTS avis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commerce_id UUID NOT NULL REFERENCES commerces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
  note INTEGER NOT NULL CHECK (note BETWEEN 1 AND 5),
  commentaire TEXT,
  sentiment TEXT DEFAULT 'neutre' CHECK (sentiment IN ('positif', 'neutre', 'negatif')),
  score_sentiment DECIMAL(4, 3) NOT NULL DEFAULT 0,
  is_spam BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_avis_commerce ON avis(commerce_id);
CREATE INDEX IF NOT EXISTS idx_avis_user ON avis(user_id);

CREATE TRIGGER update_avis_updated_at
  BEFORE UPDATE ON avis
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE avis ENABLE ROW LEVEL SECURITY;

-- Lecture publique des avis (non spam)
CREATE POLICY "Avis publics en lecture"
  ON avis FOR SELECT
  USING (is_spam = false);

-- Un utilisateur authentifié peut publier un avis en son nom
CREATE POLICY "Utilisateurs authentifiés peuvent publier un avis"
  ON avis FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- L'auteur peut supprimer son propre avis
CREATE POLICY "Auteur peut supprimer son avis"
  ON avis FOR DELETE
  USING (auth.uid() = user_id);
