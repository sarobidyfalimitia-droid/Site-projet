@echo off
chcp 65001 >nul
echo ========================================
echo   Initialisation de Neon Database
echo ========================================
echo.

REM Vérifier si Neon CLI est installé
neon --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Neon CLI n'est pas installé
    echo.
    echo Installation en cours...
    call npm install -g neon
    echo.
)

echo ✅ Neon CLI détecté
echo.

REM Vérifier si l'utilisateur est connecté
echo 📋 Vérification de la connexion Neon...
neon auth status >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Vous n'êtes pas connecté à Neon
    echo.
    echo 🔐 Veuillez vous connecter :
    echo.
    echo   1. Un navigateur va s'ouvrir
    echo   2. Connectez-vous avec GitHub
    echo   3. Autorisez Neon
    echo.
    pause
    call neon auth login
    echo.
)

echo ✅ Connecté à Neon
echo.

REM Créer le projet
echo 📦 Création du projet Neon...
echo.
echo Nom du projet : agency-platform
echo Region : aws-eu-central-1 (Europe Francfort)
echo.

set /p confirm="Voulez-vous créer le projet ? (o/n) : "
if /i not "%confirm%"=="o" (
    echo Opération annulée
    pause
    exit /b 0
)

echo.
echo Création du projet en cours...
neon projects create --name agency-platform --region-id aws-eu-central-1

echo.
echo ========================================
echo   ✅ Projet créé avec succès !
echo ========================================
echo.
echo 📋 COPIEZ L'URL DE CONNEXION affichée ci-dessus
echo.
echo Format attendu :
echo   postgresql://[user]:[password]@[neon_hostname]/[dbname]
echo.
echo ========================================
echo.

REM Créer le fichier .env
echo 📝 Création du fichier .env...
echo.

set /p db_url="Collez votre DATABASE_URL ici : "
echo.

if "%db_url%"=="" (
    echo ❌ Erreur : URL vide
    pause
    exit /b 1
)

echo # Configuration de la base de données Neon > .env
echo. >> .env
echo DATABASE_URL=%db_url% >> .env
echo. >> .env
echo # Autres variables d'environnement >> .env
echo NODE_ENV=production >> .env
echo PORT=3001 >> .env

echo ✅ Fichier .env créé avec succès !
echo.

echo ========================================
echo   🎉 Configuration terminée !
echo ========================================
echo.
echo 📋 Prochaines étapes :
echo.
echo 1. Copiez la DATABASE_URL dans backend/.env.production
echo 2. Déployez le backend sur Fly.io
echo 3. Exécutez les migrations : npx prisma migrate deploy
echo.
echo 📚 Consultez INSTRUCTIONS_FINALES.md pour la suite
echo.
pause