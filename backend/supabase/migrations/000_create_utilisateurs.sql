-- Migration : Création de la table utilisateurs (profils)
-- Doit s'exécuter avant commerces et avis (clés étrangères).
-- Schéma aligné sur les routes /api/auth/* et les jointures utilisateurs(id, nom, prenom).

CREATE TABLE IF NOT EXISTS utilisateurs (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  prenom TEXT DEFAULT '',
  telephone TEXT,
  role TEXT NOT NULL DEFAULT 'citoyen' CHECK (role IN ('citoyen', 'artisan', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE utilisateurs ENABLE ROW LEVEL SECURITY;

-- Les profils sont lisibles publiquement (jointures commerces/avis)
CREATE POLICY "Profils publics en lecture"
  ON utilisateurs FOR SELECT
  USING (true);

-- Un utilisateur ne peut modifier que son propre profil
CREATE POLICY "Utilisateur modifie son profil"
  ON utilisateurs FOR UPDATE
  USING (auth.uid() = id);
