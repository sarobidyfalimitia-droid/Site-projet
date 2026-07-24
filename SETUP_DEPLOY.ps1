# Script d'initialisation pour le déploiement
# Ce script prépare le projet pour Vercel + Fly.io + Neon

param(
    [switch]$SkipGit = $false,
    [switch]$Help = $false
)

if ($Help) {
    Write-Host "=== Script de Préparation pour Déploiement ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\SETUP_DEPLOY.ps1 [options]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -SkipGit    Skip git operations"
    Write-Host "  -Help       Show this help"
    Write-Host ""
    Write-Host "Ce script va:"
    Write-Host "  1. Vérifier la structure du projet"
    Write-Host "  2. Créer les fichiers de configuration"
    Write-Host "  3. Préparer le repository pour le déploiement"
    Write-Host ""
    exit
}

Write-Host "=== Préparation du Projet pour Déploiement ===" -ForegroundColor Cyan
Write-Host ""

# Vérifier que nous sommes dans le bon dossier
if (-not (Test-Path "agency-platform")) {
    Write-Host "❌ Erreur: Le dossier 'agency-platform' n'existe pas dans le répertoire courant." -ForegroundColor Red
    Write-Host "   Veuillez exécuter ce script depuis la racine du projet." -ForegroundColor Yellow
    exit 1
}

Set-Location agency-platform

Write-Host "✅ Dossier agency-platform trouvé" -ForegroundColor Green
Write-Host ""

# Étape 1: Vérifier les fichiers de configuration
Write-Host "📋 Étape 1: Vérification des fichiers de configuration..." -ForegroundColor Yellow

$requiredFiles = @(
    "backend/Dockerfile",
    "frontend/Dockerfile",
    "backend/package.json",
    "frontend/package.json",
    "backend/fly.toml",
    "vercel.json"
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
        Write-Host "  ❌ Manquant: $file" -ForegroundColor Red
    } else {
        Write-Host "  ✅ $file" -ForegroundColor Green
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host ""
    Write-Host "❌ Erreur: Fichiers manquants. Impossible de continuer." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Tous les fichiers de configuration sont présents" -ForegroundColor Green
Write-Host ""

# Étape 2: Vérifier Git
if (-not $SkipGit) {
    Write-Host "📋 Étape 2: Vérification de Git..." -ForegroundColor Yellow
    
    try {
        $gitVersion = git --version
        Write-Host "  ✅ Git détecté: $gitVersion" -ForegroundColor Green
        
        # Vérifier si c'est un repository git
        $gitStatus = git status 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✅ Repository Git initialisé" -ForegroundColor Green
            
            # Vérifier la branche
            $branch = git branch --show-current
            Write-Host "  📌 Branche actuelle: $branch" -ForegroundColor Cyan
            
            if ($branch -ne "main" -and $branch -ne "master") {
                Write-Host "  ⚠️  Attention: Vous n'êtes pas sur la branche 'main' ou 'master'" -ForegroundColor Yellow
                $switchBranch = Read-Host "  Voulez-vous créer/switcher vers la branche 'main'? (o/n)"
                if ($switchBranch -eq "o") {
                    git branch -M main
                    Write-Host "  ✅ Branche 'main' créée/activée" -ForegroundColor Green
                }
            }
        } else {
            Write-Host "  ⚠️  Ce n'est pas un repository Git" -ForegroundColor Yellow
            $initGit = Read-Host "  Voulez-vous initialiser Git? (o/n)"
            if ($initGit -eq "o") {
                git init
                git add .
                git commit -m "Initial commit - Prepare for deployment"
                Write-Host "  ✅ Git initialisé" -ForegroundColor Green
            }
        }
    } catch {
        Write-Host "  ❌ Git n'est pas installé" -ForegroundColor Red
        Write-Host "     Installez Git depuis: https://git-scm.com/downloads" -ForegroundColor Yellow
    }
    Write-Host ""
}

# Étape 3: Créer le fichier .env.production pour le backend
Write-Host "📋 Étape 3: Création du fichier .env.production pour le backend..." -ForegroundColor Yellow

$backendEnvContent = @"
# IMPORTANT: Ces valeurs seront remplacées par les secrets Fly.io
# Ne committez PAS ce fichier avec de vraies valeurs

NODE_ENV=production
PORT=3001

# Database URL (sera fourni par Neon)
DATABASE_URL=postgres://user:password@host:5432/agency_platform

# JWT Secrets (générez des valeurs sécurisées)
JWT_SECRET=change-me-in-production
JWT_REFRESH_SECRET=change-me-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

# Frontend URL (sera https://agency-platform-frontend.vercel.app)
FRONTEND_URL=https://agency-platform-frontend.vercel.app

# Uploads
UPLOAD_DIR=/app/uploads

# SMTP Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=Techno-logia <noreply@techno-logia.fr>
SMTP_DISABLED=false

# OpenRouter API (optionnel)
OPENROUTER_API_KEY=your-openrouter-key
"@

$backendEnvPath = "backend/.env.production"
if (-not (Test-Path $backendEnvPath)) {
    $backendEnvContent | Out-File -FilePath $backendEnvPath -Encoding UTF8
    Write-Host "  ✅ Fichier .env.production créé dans backend/" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Le fichier .env.production existe déjà" -ForegroundColor Yellow
    $overwrite = Read-Host "  Voulez-vous l'écraser? (o/n)"
    if ($overwrite -eq "o") {
        $backendEnvContent | Out-File -FilePath $backendEnvPath -Encoding UTF8
        Write-Host "  ✅ Fichier .env.production mis à jour" -ForegroundColor Green
    }
}

Write-Host ""

# Étape 4: Créer le fichier .env.production pour le frontend
Write-Host "📋 Étape 4: Création du fichier .env.production pour le frontend..." -ForegroundColor Yellow

$frontendEnvContent = @"
# IMPORTANT: Ces valeurs seront remplacées par les variables Vercel
# Ne committez PAS ce fichier avec de vraies valeurs

NODE_ENV=production

# Backend URLs (sera https://agency-platform-backend.fly.dev)
NEXT_PUBLIC_API_URL=https://agency-platform-backend.fly.dev/api
NEXT_PUBLIC_SOCKET_URL=https://agency-platform-backend.fly.dev
NEXT_PUBLIC_SITE_URL=https://agency-platform-frontend.vercel.app
"@

$frontendEnvPath = "frontend/.env.production"
if (-not (Test-Path $frontendEnvPath)) {
    $frontendEnvContent | Out-File -FilePath $frontendEnvPath -Encoding UTF8
    Write-Host "  ✅ Fichier .env.production créé dans frontend/" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Le fichier .env.production existe déjà" -ForegroundColor Yellow
    $overwrite = Read-Host "  Voulez-vous l'écraser? (o/n)"
    if ($overwrite -eq "o") {
        $frontendEnvContent | Out-File -FilePath $frontendEnvPath -Encoding UTF8
        Write-Host "  ✅ Fichier .env.production mis à jour" -ForegroundColor Green
    }
}

Write-Host ""

# Étape 5: Vérifier les Dockerfiles
Write-Host "📋 Étape 5: Vérification des Dockerfiles..." -ForegroundColor Yellow

$backendDockerfile = Get-Content "backend/Dockerfile" -Raw
if ($backendDockerfile -match "node:20") {
    Write-Host "  ✅ Backend Dockerfile: Node 20 détecté" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Backend Dockerfile: Version Node non standard" -ForegroundColor Yellow
}

$frontendDockerfile = Get-Content "frontend/Dockerfile" -Raw
if ($frontendDockerfile -match "node:20") {
    Write-Host "  ✅ Frontend Dockerfile: Node 20 détecté" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Frontend Dockerfile: Version Node non standard" -ForegroundColor Yellow
}

Write-Host ""

# Étape 6: Créer un fichier de résumé
Write-Host "📋 Étape 6: Création du fichier de résumé..." -ForegroundColor Yellow

$summaryContent = @"
# Résumé de Préparation pour Déploiement

Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

## ✅ Fichiers Créés/Modifiés

- backend/.env.production (template)
- frontend/.env.production (template)
- backend/fly.toml (configuration Fly.io)
- vercel.json (configuration Vercel)

## 📝 Prochaines Étapes

### 1. Créer un compte Neon (Base de données)
   - URL: https://neon.tech
   - Créer un projet: agency-platform
   - Copier l'URL de connexion

### 2. Créer un compte Fly.io (Backend)
   - URL: https://fly.io
   - Installer la CLI: iwr https://fly.io/install.ps1 -UseBasicParsing | iex
   - Déployer: cd backend && fly launch --no-deploy
   - Configurer les secrets: fly secrets set DATABASE_URL="votre-url-neon" ...

### 3. Créer un compte Vercel (Frontend)
   - URL: https://vercel.com
   - Installer la CLI: npm i -g vercel
   - Déployer: vercel --prod
   - Configurer les variables d'environnement

### 4. Configurer Gmail SMTP (OTP)
   - Activer la 2FA: https://myaccount.google.com/apppasswords
   - Générer un mot de passe d'application
   - Mettre à jour les secrets Fly.io

## 🔗 URLs Finales

- Frontend: https://agency-platform-frontend.vercel.app
- Backend: https://agency-platform-backend.fly.dev
- API Health: https://agency-platform-backend.fly.dev/api/health

## 📚 Documentation

- Guide rapide: QUICK_START_FREE.md
- Guide détaillé: FREE_DEPLOY.md
- Comparaison: DEPLOYMENT_OPTIONS.md

## ⚠️ Important

- Ne committez PAS les fichiers .env.production avec de vraies valeurs
- Utilisez les secrets Fly.io et Vercel pour les variables sensibles
- Testez localement avant de déployer
"@

$summaryContent | Out-File -FilePath "DEPLOYMENT_SUMMARY.md" -Encoding UTF8
Write-Host "  ✅ Fichier DEPLOYMENT_SUMMARY.md créé" -ForegroundColor Green

Write-Host ""

# Étape 7: Instructions finales
Write-Host "=== Préparation Terminée ! ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Fichiers créés:" -ForegroundColor Yellow
Write-Host "  - backend/.env.production (template)"
Write-Host "  - frontend/.env.production (template)"
Write-Host "  - DEPLOYMENT_SUMMARY.md (guide des prochaines étapes)"
Write-Host ""
Write-Host "🚀 Prochaines étapes:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Lisez DEPLOYMENT_SUMMARY.md pour les instructions détaillées" -ForegroundColor White
Write-Host "2. Créez un compte sur https://neon.tech et obtenez votre DATABASE_URL" -ForegroundColor White
Write-Host "3. Créez un compte sur https://fly.io et déployez le backend" -ForegroundColor White
Write-Host "4. Créez un compte sur https://vercel.com et déployez le frontend" -ForegroundColor White
Write-Host "5. Configurez Gmail SMTP pour les emails OTP" -ForegroundColor White
Write-Host ""
Write-Host "📚 Guides disponibles:" -ForegroundColor Yellow
Write-Host "  - QUICK_START_FREE.md (guide rapide 15 min)" -ForegroundColor White
Write-Host "  - FREE_DEPLOY.md (guide détaillé)" -ForegroundColor White
Write-Host "  - DEPLOYMENT_OPTIONS.md (comparaison des options)" -ForegroundColor White
Write-Host ""
Write-Host "💡 Conseil: Commencez par QUICK_START_FREE.md pour un déploiement en 15 minutes!" -ForegroundColor Green
Write-Host ""

# Retourner à la racine
Set-Location ..

Write-Host "✅ Script terminé avec succès!" -ForegroundColor Green