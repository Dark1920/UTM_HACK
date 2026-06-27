@echo off
echo ========================================
echo ArtisanBF - Installation & Setup
echo ========================================
echo.

echo [1/4] Nettoyage du cache npm...
call npm cache clean --force
echo.

echo [2/4] Installation des dependances...
echo (Cela peut prendre 3-5 minutes - soyez patient)
call npm install
echo.

if %errorlevel% neq 0 (
    echo ERREUR: npm install a echoue!
    pause
    exit /b 1
)

echo.
echo [3/4] Verification de l'installation...
call npm list next zod @supabase/supabase-js --depth=0
echo.

echo [4/4] Verification des types TypeScript...
call npx tsc --noEmit
echo.

echo ========================================
echo Installation terminee avec succes!
echo ========================================
echo.
echo Prochaines etapes:
echo 1. Copier .env.example en .env.local
echo 2. Configurer vos cles Supabase
echo 3. Appliquer les migrations SQL
echo 4. Lancer: npm run dev
echo.
pause
