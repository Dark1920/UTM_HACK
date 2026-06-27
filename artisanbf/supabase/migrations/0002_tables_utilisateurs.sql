-- Migration 0002: Table des utilisateurs
-- Liée à auth.users via un trigger automatique

-- Table des utilisateurs (profils étendus)
CREATE TABLE IF NOT EXISTS utilisateurs (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nom VARCHAR(255) NOT NULL,
  telephone VARCHAR(20),
  role VARCHAR(20) NOT NULL DEFAULT 'citoyen' CHECK (role IN ('citoyen', 'artisan', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les recherches par rôle
CREATE INDEX idx_utilisateurs_role ON utilisateurs(role);

-- Trigger pour créer automatiquement un profil utilisateur lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.utilisateurs (id, nom, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nom', 'Utilisateur'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'citoyen')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger sur auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_utilisateurs_updated_at
  BEFORE UPDATE ON utilisateurs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
