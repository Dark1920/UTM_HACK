-- Migration : Données de démonstration (seed)
-- Catégories + commerces géolocalisés à Ouagadougou.
-- Idempotent : catégories via ON CONFLICT ; commerces uniquement si table vide.

-- ─────────────────────────────────────────────────────────────
-- Réconciliation défensive : garantit les colonnes utilisées par le seed
-- même si les tables préexistent avec un schéma plus ancien.
-- (Redondant avec 001/002 mais permet d'exécuter 005 seul sans erreur.)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE categories ADD COLUMN IF NOT EXISTS description      TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS icone            TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS couleur          TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS nombre_commerces INTEGER NOT NULL DEFAULT 0;
-- Requis par le ON CONFLICT (slug) plus bas :
CREATE UNIQUE INDEX IF NOT EXISTS uq_categories_slug ON categories(slug);
ALTER TABLE commerces  ADD COLUMN IF NOT EXISTS categorie_id UUID REFERENCES categories(id) ON DELETE SET NULL;
ALTER TABLE commerces  ADD COLUMN IF NOT EXISTS ville        TEXT;
ALTER TABLE commerces  ADD COLUMN IF NOT EXISTS latitude     DECIMAL(10, 8);
ALTER TABLE commerces  ADD COLUMN IF NOT EXISTS longitude    DECIMAL(11, 8);
ALTER TABLE commerces  ADD COLUMN IF NOT EXISTS whatsapp     TEXT;
ALTER TABLE commerces  ADD COLUMN IF NOT EXISTS email        TEXT;
ALTER TABLE commerces  ADD COLUMN IF NOT EXISTS photos       TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE commerces  ADD COLUMN IF NOT EXISTS note_moyenne DECIMAL(4, 2) NOT NULL DEFAULT 0;
ALTER TABLE commerces  ADD COLUMN IF NOT EXISTS nombre_avis  INTEGER NOT NULL DEFAULT 0;
ALTER TABLE commerces  ADD COLUMN IF NOT EXISTS nombre_vues  INTEGER NOT NULL DEFAULT 0;
ALTER TABLE commerces  ADD COLUMN IF NOT EXISTS est_public   BOOLEAN NOT NULL DEFAULT true;

-- ─────────────────────────────────────────────────────────────
-- Catégories (slugs alignés sur frontend/src/constants/categories.ts)
-- ─────────────────────────────────────────────────────────────
INSERT INTO categories (nom, slug, description, icone, couleur, nombre_commerces) VALUES
  ('Mécanicien',            'mecanicien',            'Réparation de motos et véhicules',        'Wrench',     '#ef4444', 2),
  ('Couturier',             'couturier',             'Confection et retouche de vêtements',     'Scissors',   '#ec4899', 2),
  ('Menuisier',             'menuisier',             'Travail du bois et menuiserie',           'Hammer',     '#a16207', 1),
  ('Soudeur',               'soudeur',               'Soudure et métallerie',                   'Flame',      '#f97316', 1),
  ('Électricien',           'electricien',           'Installation et réparation électrique',   'Zap',        '#eab308', 2),
  ('Plombier',              'plombier',              'Installation et réparation de plomberie', 'Droplets',   '#3b82f6', 1),
  ('Coiffeur',              'coiffeur',              'Coiffure et soins capillaires',           'Scissors',   '#8b5cf6', 2),
  ('Réparateur téléphones', 'reparateur-telephones', 'Réparation de téléphones et tablettes',   'Smartphone', '#06b6d4', 1)
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- Commerces (seed uniquement si aucun commerce n'existe)
-- ─────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM commerces) THEN
    INSERT INTO commerces
      (nom, description, categorie_id, adresse, ville, latitude, longitude, telephone, whatsapp, email, photos, note_moyenne, nombre_avis, nombre_vues, est_public)
    VALUES
      ('Garage Wend-Kuni',
       'Réparation moto et auto, vidange et diagnostic électronique. Ouvert 7j/7.',
       (SELECT id FROM categories WHERE slug = 'mecanicien'),
       'Avenue Kwame Nkrumah, Gounghin', 'Ouagadougou', 12.3600, -1.5400,
       '+226 70 11 22 33', '+226 70 11 22 33', 'garage.wendkuni@example.bf',
       '{}',
       4.6, 18, 240, true),

      ('Moto Services Ouaga 2000',
       'Spécialiste deux-roues, pièces d''origine et main d''œuvre garantie.',
       (SELECT id FROM categories WHERE slug = 'mecanicien'),
       'Boulevard des Tensoba, Ouaga 2000', 'Ouagadougou', 12.3200, -1.4900,
       '+226 76 44 55 66', '+226 76 44 55 66', NULL,
       '{}',
       4.2, 9, 120, true),

      ('Atelier Faso Couture',
       'Confection sur mesure, tenues traditionnelles et retouches rapides.',
       (SELECT id FROM categories WHERE slug = 'couturier'),
       'Rue de la Chance, Zogona', 'Ouagadougou', 12.3700, -1.5000,
       '+226 78 22 33 44', '+226 78 22 33 44', 'fasocouture@example.bf',
       '{}',
       4.8, 27, 310, true),

      ('Élégance Wax',
       'Couture moderne et wax, prêt-à-porter féminin et masculin.',
       (SELECT id FROM categories WHERE slug = 'couturier'),
       'Secteur 30, Dassasgho', 'Ouagadougou', 12.3800, -1.4800,
       '+226 71 88 99 00', NULL, NULL,
       '{}',
       4.4, 14, 160, true),

      ('Menuiserie Bois Sacré',
       'Meubles sur commande, portes, fenêtres et charpente.',
       (SELECT id FROM categories WHERE slug = 'menuisier'),
       'Zone industrielle, Kossodo', 'Ouagadougou', 12.4100, -1.4700,
       '+226 70 55 66 77', '+226 70 55 66 77', NULL,
       '{}',
       4.5, 11, 95, true),

      ('Soudure Métal Plus',
       'Portails, grilles de sécurité et structures métalliques.',
       (SELECT id FROM categories WHERE slug = 'soudeur'),
       'Route de Pô, Cissin', 'Ouagadougou', 12.3400, -1.5500,
       '+226 75 33 22 11', '+226 75 33 22 11', NULL,
       '{}',
       4.1, 7, 70, true),

      ('Électro Faso',
       'Installation électrique domestique et dépannage d''urgence.',
       (SELECT id FROM categories WHERE slug = 'electricien'),
       'Avenue Bassawarga, Tanghin', 'Ouagadougou', 12.3900, -1.5100,
       '+226 76 12 34 56', '+226 76 12 34 56', 'electrofaso@example.bf',
       '{}',
       4.7, 22, 205, true),

      ('Lumière Services',
       'Câblage, tableaux électriques et éclairage solaire.',
       (SELECT id FROM categories WHERE slug = 'electricien'),
       'Patte d''Oie, secteur 15', 'Ouagadougou', 12.3300, -1.5300,
       '+226 70 99 88 77', NULL, NULL,
       '{}',
       4.0, 6, 60, true),

      ('Plomberie Rapide Ouaga',
       'Fuites, installation sanitaire et débouchage.',
       (SELECT id FROM categories WHERE slug = 'plombier'),
       'Gounghin sud, rue 12.34', 'Ouagadougou', 12.3580, -1.5420,
       '+226 78 45 67 89', '+226 78 45 67 89', NULL,
       '{}',
       4.3, 13, 140, true),

      ('Salon Beauté Nabonswende',
       'Coiffure femme et homme, tresses, coupe et soins.',
       (SELECT id FROM categories WHERE slug = 'coiffeur'),
       'Zone du Bois, secteur 13', 'Ouagadougou', 12.3720, -1.5050,
       '+226 76 78 90 12', '+226 76 78 90 12', NULL,
       '{}',
       4.9, 41, 520, true),

      ('Coupe Nette',
       'Barber shop moderne, dégradés et entretien de barbe.',
       (SELECT id FROM categories WHERE slug = 'coiffeur'),
       'Ouaga 2000, avenue Mouammar Kadhafi', 'Ouagadougou', 12.3180, -1.4880,
       '+226 71 23 45 67', '+226 71 23 45 67', NULL,
       '{}',
       4.6, 19, 230, true),

      ('Phone Repair Center',
       'Réparation écrans, batteries et déblocage de téléphones.',
       (SELECT id FROM categories WHERE slug = 'reparateur-telephones'),
       'Marché central, avenue de la Nation', 'Ouagadougou', 12.3690, -1.5230,
       '+226 70 34 56 78', '+226 70 34 56 78', 'phonerepair@example.bf',
       '{}',
       4.4, 16, 180, true);
  END IF;
END $$;
