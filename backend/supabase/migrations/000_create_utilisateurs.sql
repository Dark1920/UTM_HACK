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

-- Réconciliation : garantit TOUTES les colonnes si la table préexiste.
-- (NOT NULL seulement avec DEFAULT, pour ne pas échouer sur des lignes existantes.)
ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS nom        TEXT;
ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS prenom     TEXT DEFAULT '';
ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS telephone  TEXT;
ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS role       TEXT NOT NULL DEFAULT 'citoyen';
ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE utilisateurs ENABLE ROW LEVEL SECURITY;

-- Les profils sont lisibles publiquement (jointures commerces/avis)
DROP POLICY IF EXISTS "Profils publics en lecture" ON utilisateurs;
CREATE POLICY "Profils publics en lecture"
  ON utilisateurs FOR SELECT
  USING (true);

-- Un utilisateur ne peut modifier que son propre profil
DROP POLICY IF EXISTS "Utilisateur modifie son profil" ON utilisateurs;
CREATE POLICY "Utilisateur modifie son profil"
  ON utilisateurs FOR UPDATE
  USING (auth.uid() = id);
