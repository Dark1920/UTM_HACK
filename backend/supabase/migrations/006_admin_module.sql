-- Migration 006 : Module Admin
-- Ajoute les colonnes et tables necessaires pour l'administration.

-- ─────────────────────────────────────────────────────────────
-- 1. Colonne est_actif sur utilisateurs
-- ─────────────────────────────────────────────────────────────
ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS est_actif BOOLEAN DEFAULT TRUE;

-- ─────────────────────────────────────────────────────────────
-- 2. Colonne approuve sur avis (moderation)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE avis ADD COLUMN IF NOT EXISTS approuve BOOLEAN DEFAULT TRUE;

-- ─────────────────────────────────────────────────────────────
-- 3. Table signalements
-- ─────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS signalements;

CREATE TABLE IF NOT EXISTS signalements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signaleur_id UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
  commerce_id UUID REFERENCES commerces(id) ON DELETE CASCADE,
  avis_id UUID REFERENCES avis(id) ON DELETE CASCADE,
  raison TEXT NOT NULL,
  description TEXT,
  statut TEXT NOT NULL DEFAULT 'pending' CHECK (statut IN ('pending', 'resolved', 'dismissed')),
  note_moderateur TEXT,
  resolu_par UUID REFERENCES utilisateurs(id),
  resolu_le TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Réconciliation : garantit TOUTES les colonnes si la table préexiste.
ALTER TABLE signalements ADD COLUMN IF NOT EXISTS signaleur_id    UUID REFERENCES utilisateurs(id) ON DELETE CASCADE;
ALTER TABLE signalements ADD COLUMN IF NOT EXISTS commerce_id     UUID REFERENCES commerces(id) ON DELETE CASCADE;
ALTER TABLE signalements ADD COLUMN IF NOT EXISTS avis_id         UUID REFERENCES avis(id) ON DELETE CASCADE;
ALTER TABLE signalements ADD COLUMN IF NOT EXISTS raison          TEXT;
ALTER TABLE signalements ADD COLUMN IF NOT EXISTS description     TEXT;
ALTER TABLE signalements ADD COLUMN IF NOT EXISTS statut          TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE signalements ADD COLUMN IF NOT EXISTS note_moderateur TEXT;
ALTER TABLE signalements ADD COLUMN IF NOT EXISTS resolu_par      UUID REFERENCES utilisateurs(id);
ALTER TABLE signalements ADD COLUMN IF NOT EXISTS resolu_le       TIMESTAMP WITH TIME ZONE;
ALTER TABLE signalements ADD COLUMN IF NOT EXISTS created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- ─────────────────────────────────────────────────────────────
-- 4. Index pour les requetes admin frequentes
-- ─────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_utilisateurs_role ON utilisateurs(role);
CREATE INDEX IF NOT EXISTS idx_utilisateurs_est_actif ON utilisateurs(est_actif);
CREATE INDEX IF NOT EXISTS idx_avis_is_spam ON avis(is_spam);
CREATE INDEX IF NOT EXISTS idx_avis_approuve ON avis(approuve);
CREATE INDEX IF NOT EXISTS idx_signalements_statut ON signalements(statut);
CREATE INDEX IF NOT EXISTS idx_signalements_commerce ON signalements(commerce_id);

-- ─────────────────────────────────────────────────────────────
-- 5. RLS sur signalements
-- ─────────────────────────────────────────────────────────────
ALTER TABLE signalements ENABLE ROW LEVEL SECURITY;

-- Lecture publique (un utilisateur peut voir ses propres signalements)
DROP POLICY IF EXISTS "Signalements lisibles par signaleur" ON signalements;
CREATE POLICY "Signalements lisibles par signaleur"
  ON signalements FOR SELECT
  USING (auth.uid() = signaleur_id);

-- Insertion par utilisateurs authentifies
DROP POLICY IF EXISTS "Utilisateurs authentifies peuvent signaler" ON signalements;
CREATE POLICY "Utilisateurs authentifies peuvent signaler"
  ON signalements FOR INSERT
  WITH CHECK (auth.uid() = signaleur_id);

-- ─────────────────────────────────────────────────────────────
-- 6. Policies RLS admin (acces total via Service Role Key)
--    Note: Le Service Role Key contourne la RLS par defaut.
--    Ces policies sont pour les requetes auth.uid() cote client.
-- ─────────────────────────────────────────────────────────────

-- Admin: lecture totale utilisateurs
DROP POLICY IF EXISTS "Admin lecture utilisateurs" ON utilisateurs;
CREATE POLICY "Admin lecture utilisateurs"
  ON utilisateurs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM utilisateurs u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Admin: modification totale utilisateurs
DROP POLICY IF EXISTS "Admin modification utilisateurs" ON utilisateurs;
CREATE POLICY "Admin modification utilisateurs"
  ON utilisateurs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM utilisateurs u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Admin: suppression totale utilisateurs
DROP POLICY IF EXISTS "Admin suppression utilisateurs" ON utilisateurs;
CREATE POLICY "Admin suppression utilisateurs"
  ON utilisateurs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM utilisateurs u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Admin: acces total commerces
DROP POLICY IF EXISTS "Admin full access commerces" ON commerces;
CREATE POLICY "Admin full access commerces"
  ON commerces FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM utilisateurs u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Admin: acces total avis
DROP POLICY IF EXISTS "Admin full access avis" ON avis;
CREATE POLICY "Admin full access avis"
  ON avis FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM utilisateurs u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Admin: acces total signalements
DROP POLICY IF EXISTS "Admin full access signalements" ON signalements;
CREATE POLICY "Admin full access signalements"
  ON signalements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM utilisateurs u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Admin: acces total categories
DROP POLICY IF EXISTS "Admin full access categories" ON categories;
CREATE POLICY "Admin full access categories"
  ON categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM utilisateurs u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );
