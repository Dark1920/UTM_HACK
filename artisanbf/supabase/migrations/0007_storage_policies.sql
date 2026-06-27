-- Migration 0007: Storage Policies pour les photos de commerces
-- Bucket: photos-commerces
-- Structure: {user_id}/{commerce_id}/{filename}

-- Créer le bucket s'il n'existe pas
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos-commerces', 'photos-commerces', true)
ON CONFLICT (id) DO NOTHING;

-- Activer RLS sur le storage
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Les utilisateurs peuvent uploader dans leur propre dossier
CREATE POLICY "photos_insert_own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'photos-commerces'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Les utilisateurs peuvent voir toutes les photos publiques
CREATE POLICY "photos_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'photos-commerces');

-- Policy: Les utilisateurs peuvent modifier leurs propres photos
CREATE POLICY "photos_update_own"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'photos-commerces'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Les utilisateurs peuvent supprimer leurs propres photos
CREATE POLICY "photos_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'photos-commerces'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Les admins peuvent tout gérer
CREATE POLICY "photos_admin_all"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'photos-commerces'
    AND EXISTS (
      SELECT 1 FROM utilisateurs
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
