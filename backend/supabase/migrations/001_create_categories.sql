-- Migration : Création de la table categories
-- Doit s'exécuter avant commerces (clé étrangère categorie_id).
-- Schéma aligné sur GET /api/categories (id, nom, slug, description, icone, couleur).

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icone TEXT,
  couleur TEXT,
  nombre_commerces INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Réconciliation : garantit TOUTES les colonnes si la table préexiste.
ALTER TABLE categories ADD COLUMN IF NOT EXISTS nom               TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS slug              TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS description       TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS icone             TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS couleur           TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS nombre_commerces  INTEGER NOT NULL DEFAULT 0;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE UNIQUE INDEX IF NOT EXISTS uq_categories_slug ON categories(slug);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Categories publiques en lecture" ON categories;
CREATE POLICY "Categories publiques en lecture"
  ON categories FOR SELECT
  USING (true);
