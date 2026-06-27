-- Migration 0006: Row Level Security (RLS) Policies
-- Sécurité stricte pour CHAQUE table

-- ============================================
-- 1. UTILISATEURS
-- ============================================
ALTER TABLE utilisateurs ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "utilisateurs_read_own"
  ON utilisateurs FOR SELECT
  USING (auth.uid() = id);

-- Les utilisateurs peuvent modifier leur propre profil
CREATE POLICY "utilisateurs_update_own"
  ON utilisateurs FOR UPDATE
  USING (auth.uid() = id);

-- Les admins peuvent tout voir
CREATE POLICY "utilisateurs_admin_all"
  ON utilisateurs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM utilisateurs
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- 2. COMMERCES
-- ============================================
ALTER TABLE commerces ENABLE ROW LEVEL SECURITY;

-- Lecture publique des commerces publiés
CREATE POLICY "commerces_read_public"
  ON commerces FOR SELECT
  USING (statut = 'publie');

-- Les artisans peuvent voir leurs propres commerces (y compris brouillons)
CREATE POLICY "commerces_read_own"
  ON commerces FOR SELECT
  USING (auth.uid() = user_id);

-- Les artisans peuvent créer des commerces
CREATE POLICY "commerces_insert_own"
  ON commerces FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Les artisans peuvent modifier leurs propres commerces
CREATE POLICY "commerces_update_own"
  ON commerces FOR UPDATE
  USING (auth.uid() = user_id);

-- Les artisans peuvent supprimer leurs propres commerces
CREATE POLICY "commerces_delete_own"
  ON commerces FOR DELETE
  USING (auth.uid() = user_id);

-- Les admins ont accès total
CREATE POLICY "commerces_admin_all"
  ON commerces FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM utilisateurs
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- 3. AVIS
-- ============================================
ALTER TABLE avis ENABLE ROW LEVEL SECURITY;

-- Lecture publique des avis non-spam
CREATE POLICY "avis_read_public"
  ON avis FOR SELECT
  USING (
    is_spam IS NULL OR is_spam = FALSE
  );

-- Les citoyens peuvent créer des avis
CREATE POLICY "avis_insert_own"
  ON avis FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent modifier leurs propres avis
CREATE POLICY "avis_update_own"
  ON avis FOR UPDATE
  USING (auth.uid() = user_id);

-- Les utilisateurs peuvent supprimer leurs propres avis
CREATE POLICY "avis_delete_own"
  ON avis FOR DELETE
  USING (auth.uid() = user_id);

-- Les admins peuvent tout gérer
CREATE POLICY "avis_admin_all"
  ON avis FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM utilisateurs
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- 4. CATEGORIES
-- ============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Lecture publique
CREATE POLICY "categories_read_public"
  ON categories FOR SELECT
  USING (true);

-- Seuls les admins peuvent modifier les catégories
CREATE POLICY "categories_admin_all"
  ON categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM utilisateurs
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- 5. SIGNALEMENTS
-- ============================================
ALTER TABLE signalements ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir leurs propres signalements
CREATE POLICY "signalements_read_own"
  ON signalements FOR SELECT
  USING (auth.uid() = user_id);

-- Les utilisateurs peuvent créer des signalements
CREATE POLICY "signalements_insert_own"
  ON signalements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Les admins peuvent tout voir et gérer
CREATE POLICY "signalements_admin_all"
  ON signalements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM utilisateurs
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- 6. STATISTIQUES_COMMERCES
-- ============================================
ALTER TABLE statistiques_commerces ENABLE ROW LEVEL SECURITY;

-- Les propriétaires de commerces peuvent voir leurs statistiques
CREATE POLICY "statistiques_read_own"
  ON statistiques_commerces FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM commerces
      WHERE commerces.id = statistiques_commerces.commerce_id
      AND commerces.user_id = auth.uid()
    )
  );

-- Insertion publique (pour le tracking des vues)
CREATE POLICY "statistiques_insert_public"
  ON statistiques_commerces FOR INSERT
  WITH CHECK (true);

-- Les admins peuvent tout voir
CREATE POLICY "statistiques_admin_all"
  ON statistiques_commerces FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM utilisateurs
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
