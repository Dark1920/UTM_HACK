-- Migration : Enrichissement du seed
-- Utilisateurs de démo + association des commerces à des artisans
-- + commerces dans plusieurs villes + avis. Idempotent.

-- ─────────────────────────────────────────────────────────────
-- La FK utilisateurs.id -> auth.users(id) empêche de seeder des profils
-- de démo sans créer de vrais comptes d'auth (fragile via SQL). On la
-- relâche : les profils démo servent aux données/associations, pas au login.
-- Les inscriptions réelles continuent d'insérer id = auth.users.id.
-- ─────────────────────────────────────────────────────────────
DO $$
DECLARE cname text;
BEGIN
  SELECT conname INTO cname
  FROM pg_constraint
  WHERE conrelid = 'utilisateurs'::regclass
    AND contype = 'f'
    AND confrelid = 'auth.users'::regclass;
  IF cname IS NOT NULL THEN
    EXECUTE format('ALTER TABLE utilisateurs DROP CONSTRAINT %I', cname);
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────
-- Utilisateurs de démo (3 artisans + 2 citoyens)
-- ─────────────────────────────────────────────────────────────
INSERT INTO utilisateurs (id, nom, prenom, telephone, role) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Ouedraogo', 'Moussa',  '+226 70 00 00 01', 'artisan'),
  ('a2222222-2222-2222-2222-222222222222', 'Sawadogo',  'Awa',     '+226 70 00 00 02', 'artisan'),
  ('a3333333-3333-3333-3333-333333333333', 'Traore',    'Ibrahim', '+226 70 00 00 03', 'artisan'),
  ('c1111111-1111-1111-1111-111111111111', 'Kabore',    'Fatou',   '+226 70 00 00 04', 'citoyen'),
  ('c2222222-2222-2222-2222-222222222222', 'Zongo',     'Karim',   '+226 70 00 00 05', 'citoyen')
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- Associe les commerces existants (Ouaga, seed 005) à des artisans
-- (uniquement ceux encore sans propriétaire). Réparti par métier.
-- ─────────────────────────────────────────────────────────────
UPDATE commerces SET artisan_id = 'a1111111-1111-1111-1111-111111111111'
WHERE artisan_id IS NULL
  AND categorie_id IN (SELECT id FROM categories WHERE slug IN ('mecanicien', 'soudeur', 'electricien'));

UPDATE commerces SET artisan_id = 'a2222222-2222-2222-2222-222222222222'
WHERE artisan_id IS NULL
  AND categorie_id IN (SELECT id FROM categories WHERE slug IN ('couturier', 'coiffeur'));

UPDATE commerces SET artisan_id = 'a3333333-3333-3333-3333-333333333333'
WHERE artisan_id IS NULL
  AND categorie_id IN (SELECT id FROM categories WHERE slug IN ('menuisier', 'plombier', 'reparateur-telephones'));

-- ─────────────────────────────────────────────────────────────
-- Commerces dans d'autres villes (seed si aucun commerce hors Ouaga)
-- ─────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM commerces WHERE ville <> 'Ouagadougou') THEN
    INSERT INTO commerces
      (nom, description, categorie_id, artisan_id, adresse, ville, latitude, longitude, telephone, whatsapp, email, photos, note_moyenne, nombre_avis, nombre_vues, est_public)
    VALUES
      -- Bobo-Dioulasso
      ('Garage Sya Bobo', 'Réparation auto et moto, spécialiste diesel.',
       (SELECT id FROM categories WHERE slug = 'mecanicien'), 'a1111111-1111-1111-1111-111111111111',
       'Secteur 5, Accart-Ville', 'Bobo-Dioulasso', 11.1771, -4.2979,
       '+226 76 10 20 30', '+226 76 10 20 30', NULL, '{}', 4.5, 0, 130, true),
      ('Couture Kénédougou', 'Confection wax et costumes sur mesure.',
       (SELECT id FROM categories WHERE slug = 'couturier'), 'a2222222-2222-2222-2222-222222222222',
       'Avenue de la Révolution, Bobo', 'Bobo-Dioulasso', 11.1810, -4.2900,
       '+226 78 11 22 33', NULL, NULL, '{}', 4.7, 0, 95, true),
      -- Koudougou
      ('Électricité Koudougou Plus', 'Installation électrique et solaire.',
       (SELECT id FROM categories WHERE slug = 'electricien'), 'a1111111-1111-1111-1111-111111111111',
       'Quartier Burkina, secteur 2', 'Koudougou', 12.2530, -2.3620,
       '+226 70 44 55 66', '+226 70 44 55 66', NULL, '{}', 4.3, 0, 80, true),
      ('Salon Réo Coiffure', 'Coiffure homme et femme, tresses modernes.',
       (SELECT id FROM categories WHERE slug = 'coiffeur'), 'a2222222-2222-2222-2222-222222222222',
       'Marché central de Koudougou', 'Koudougou', 12.2490, -2.3700,
       '+226 76 55 66 77', '+226 76 55 66 77', NULL, '{}', 4.6, 0, 110, true),
      -- Banfora
      ('Menuiserie Cascades', 'Meubles et charpente bois massif.',
       (SELECT id FROM categories WHERE slug = 'menuisier'), 'a3333333-3333-3333-3333-333333333333',
       'Route de la Comoé', 'Banfora', 10.6376, -4.7526,
       '+226 71 22 33 44', NULL, NULL, '{}', 4.4, 0, 60, true),
      ('Plomberie Banfora Services', 'Installation sanitaire et dépannage.',
       (SELECT id FROM categories WHERE slug = 'plombier'), 'a3333333-3333-3333-3333-333333333333',
       'Secteur 3, Banfora', 'Banfora', 10.6410, -4.7480,
       '+226 78 33 44 55', '+226 78 33 44 55', NULL, '{}', 4.1, 0, 45, true),
      -- Ouahigouya
      ('Soudure du Yatenga', 'Portails, grilles et structures métalliques.',
       (SELECT id FROM categories WHERE slug = 'soudeur'), 'a1111111-1111-1111-1111-111111111111',
       'Quartier Sect. 6, Ouahigouya', 'Ouahigouya', 13.5828, -2.4216,
       '+226 70 66 77 88', '+226 70 66 77 88', NULL, '{}', 4.2, 0, 55, true),
      ('Réparation Phone Yatenga', 'Écrans, batteries et déblocage.',
       (SELECT id FROM categories WHERE slug = 'reparateur-telephones'), 'a3333333-3333-3333-3333-333333333333',
       'Grand marché, Ouahigouya', 'Ouahigouya', 13.5790, -2.4180,
       '+226 76 77 88 99', NULL, NULL, '{}', 4.5, 0, 90, true),
      -- Fada N'Gourma
      ('Garage Gourma Auto', 'Mécanique générale et vidange.',
       (SELECT id FROM categories WHERE slug = 'mecanicien'), 'a1111111-1111-1111-1111-111111111111',
       'Route de Niamey, Fada', 'Fada N''Gourma', 12.0616, 0.3580,
       '+226 70 88 99 00', '+226 70 88 99 00', NULL, '{}', 4.0, 0, 40, true),
      ('Atelier Couture Gulmu', 'Retouches et confection traditionnelle.',
       (SELECT id FROM categories WHERE slug = 'couturier'), 'a2222222-2222-2222-2222-222222222222',
       'Centre-ville, Fada', 'Fada N''Gourma', 12.0650, 0.3620,
       '+226 78 99 00 11', NULL, NULL, '{}', 4.6, 0, 50, true);
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────
-- Avis de démo (seed si aucun avis). Notes/sentiments variés.
-- score_sentiment = note/5 (convention du backend).
-- ─────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM avis) THEN
    INSERT INTO avis (commerce_id, user_id, note, commentaire, sentiment, score_sentiment, is_spam) VALUES
      ((SELECT id FROM commerces WHERE nom = 'Garage Wend-Kuni' LIMIT 1),        'c1111111-1111-1111-1111-111111111111', 5, 'Travail impeccable, mécanicien très professionnel et rapide. Je recommande vivement.', 'positif', 1.0, false),
      ((SELECT id FROM commerces WHERE nom = 'Garage Wend-Kuni' LIMIT 1),        'c2222222-2222-2222-2222-222222222222', 4, 'Bon accueil et prix corrects, ma moto roule bien maintenant.', 'positif', 0.8, false),
      ((SELECT id FROM commerces WHERE nom = 'Garage Wend-Kuni' LIMIT 1),        'c1111111-1111-1111-1111-111111111111', 3, 'Correct mais un peu d''attente le matin.', 'neutre', 0.6, false),

      ((SELECT id FROM commerces WHERE nom = 'Atelier Faso Couture' LIMIT 1),    'c2222222-2222-2222-2222-222222222222', 5, 'Finitions parfaites et couturière à l''écoute. Tenue livrée à temps.', 'positif', 1.0, false),
      ((SELECT id FROM commerces WHERE nom = 'Atelier Faso Couture' LIMIT 1),    'c1111111-1111-1111-1111-111111111111', 4, 'Très bon travail, quelques jours de délai en plus mais ça valait le coup.', 'positif', 0.8, false),

      ((SELECT id FROM commerces WHERE nom = 'Salon Beauté Nabonswende' LIMIT 1),'c1111111-1111-1111-1111-111111111111', 5, 'Meilleur salon du quartier, personnel aimable et propre.', 'positif', 1.0, false),
      ((SELECT id FROM commerces WHERE nom = 'Salon Beauté Nabonswende' LIMIT 1),'c2222222-2222-2222-2222-222222222222', 2, 'Trop d''attente et coupe pas conforme à ma demande, déçu.', 'negatif', 0.4, false),

      ((SELECT id FROM commerces WHERE nom = 'Plomberie Rapide Ouaga' LIMIT 1),  'c2222222-2222-2222-2222-222222222222', 2, 'Fuite mal réparée, obligé de rappeler. Délais non respectés.', 'negatif', 0.4, false),
      ((SELECT id FROM commerces WHERE nom = 'Plomberie Rapide Ouaga' LIMIT 1),  'c1111111-1111-1111-1111-111111111111', 3, 'Intervention correcte au final, mais prix un peu élevé.', 'neutre', 0.6, false),

      ((SELECT id FROM commerces WHERE nom = 'Électro Faso' LIMIT 1),            'c1111111-1111-1111-1111-111111111111', 5, 'Dépannage électrique rapide et sérieux, très satisfait.', 'positif', 1.0, false),
      ((SELECT id FROM commerces WHERE nom = 'Électro Faso' LIMIT 1),            'c2222222-2222-2222-2222-222222222222', 4, 'Bon professionnel, installation propre.', 'positif', 0.8, false),

      ((SELECT id FROM commerces WHERE nom = 'Garage Sya Bobo' LIMIT 1),         'c2222222-2222-2222-2222-222222222222', 4, 'Bon garage à Bobo, diagnostic honnête.', 'positif', 0.8, false),
      ((SELECT id FROM commerces WHERE nom = 'Garage Sya Bobo' LIMIT 1),         'c1111111-1111-1111-1111-111111111111', 5, 'Réparation diesel nickel, je reviendrai.', 'positif', 1.0, false),

      ((SELECT id FROM commerces WHERE nom = 'Salon Réo Coiffure' LIMIT 1),      'c1111111-1111-1111-1111-111111111111', 4, 'Belles tresses, ambiance agréable.', 'positif', 0.8, false),
      ((SELECT id FROM commerces WHERE nom = 'Menuiserie Cascades' LIMIT 1),     'c2222222-2222-2222-2222-222222222222', 3, 'Meuble solide mais livraison en retard.', 'neutre', 0.6, false);
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────
-- Recalcule les agrégats à partir des vraies données
-- ─────────────────────────────────────────────────────────────
UPDATE commerces c
SET note_moyenne = sub.moyenne,
    nombre_avis  = sub.cnt
FROM (
  SELECT commerce_id, ROUND(AVG(note)::numeric, 2) AS moyenne, COUNT(*) AS cnt
  FROM avis
  GROUP BY commerce_id
) sub
WHERE c.id = sub.commerce_id;

UPDATE categories cat
SET nombre_commerces = (SELECT COUNT(*) FROM commerces c WHERE c.categorie_id = cat.id);
