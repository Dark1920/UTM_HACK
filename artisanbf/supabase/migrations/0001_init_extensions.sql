-- Migration 0001: Activer les extensions PostgreSQL nécessaires
-- PostGIS pour la géolocalisation
-- uuid-ossp pour la génération d'UUID

-- Activer PostGIS pour les requêtes géospatiales
CREATE EXTENSION IF NOT EXISTS postgis;

-- Activer uuid-ossp pour les UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
