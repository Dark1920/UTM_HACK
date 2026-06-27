# ============================================
# Guide d'Application des Migrations Supabase
# ============================================

# OPTION 1 : Via Supabase Dashboard (RECOMMANDÉ)
# 1. Allez sur https://app.supabase.com/project/VOTRE_PROJECT/sql-editor
# 2. Copiez et collez le contenu de chaque fichier SQL dans l'ordre :
#    - 0001_init_extensions.sql
#    - 0002_tables_utilisateurs.sql
#    - 0003_tables_commerces.sql
#    - 0004_tables_avis_signalements_stats.sql
#    - 0005_tables_categories.sql
#    - 0006_rls_policies.sql
#    - 0007_indexes_functions.sql
#    - 0008_fonctions_geo.sql
# 3. Cliquez sur "Run" pour chaque fichier

# OPTION 2 : Via Supabase CLI (si installé)
# Supabase CLI Docs: https://supabase.com/docs/guides/cli

# Installer Supabase CLI (Optionnel)
# npm install -g supabase

# Se connecter
# supabase login

# Lier au projet
# supabase link --project-ref VOTRE_PROJECT_REF

# Appliquer les migrations
# supabase db push
