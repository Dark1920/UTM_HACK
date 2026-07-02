-- Migration : Bucket de stockage pour les photos de commerces
-- Utilisé par la route POST /api/upload.

-- Bucket public (lecture des images sans authentification)
INSERT INTO storage.buckets (id, name, public)
VALUES ('commerces', 'commerces', true)
ON CONFLICT (id) DO NOTHING;

-- Lecture publique des objets du bucket
CREATE POLICY "Images commerces lisibles publiquement"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'commerces');

-- L'écriture passe par le service role (backend), qui contourne la RLS.
-- Un utilisateur authentifié peut aussi téléverser dans son propre dossier
-- (préfixe = son id), au cas où l'upload se ferait côté client.
CREATE POLICY "Utilisateur téléverse dans son dossier"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'commerces'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
