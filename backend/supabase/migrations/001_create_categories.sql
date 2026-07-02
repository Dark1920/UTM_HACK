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

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories publiques en lecture"
  ON categories FOR SELECT
  USING (true);
