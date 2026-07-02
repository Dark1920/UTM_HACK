-- Migration : Ajout colonnes admin + policies admin
-- Date : 2026-07-01

-- Ajout de la colonne est_actif sur utilisateurs
ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS est_actif BOOLEAN DEFAULT TRUE;

-- ─── Policies Admin ──────────────────────────────────────────────────────────

-- Admin full access sur commerces
CREATE POLICY "Admin full access commerces"
  ON commerces FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM utilisateurs
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin full access sur avis
CREATE POLICY "Admin full access avis"
  ON avis FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM utilisateurs
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin full access sur signalements
CREATE POLICY "Admin full access signalements"
  ON signalements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM utilisateurs
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin full access sur categories
CREATE POLICY "Admin full access categories"
  ON categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM utilisateurs
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin full access sur utilisateurs
CREATE POLICY "Admin full access utilisateurs"
  ON utilisateurs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM utilisateurs u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );
