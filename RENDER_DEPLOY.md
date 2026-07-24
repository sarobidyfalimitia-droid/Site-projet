# Guide de Déploiement sur Render

Ce guide vous explique comment déployer l'application Agency Platform sur Render.

## Prérequis

- Un compte Render (https://render.com)
- Votre projet sur GitHub/GitLab
- Accès en écriture au repository

## Structure du Déploiement

Le fichier `render.yaml` configure automatiquement :

- **Backend** : API Node.js/Express sur le port 3001
- **Frontend** : Application Next.js sur le port 3000
- **Base de données** : PostgreSQL (plan Starter)
- **Stockage** : Disque persistant pour les uploads (1GB)

## Étapes de Déploiement

### 1. Préparer le Repository

Assurez-vous que tous les fichiers sont commités et poussés vers votre repository :

```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### 2. Créer un Blueprint sur Render

1. Connectez-vous à votre compte Render
2. Cliquez sur **"New"** → **"Blueprint"**
3. Connectez votre repository GitHub/GitLab
4. Sélectionnez le repository `agency-platform`
5. Render détectera automatiquement le fichier `render.yaml`

### 3. Configurer les Variables d'Environnement

Lors de la création du Blueprint, Render vous demandera de configurer certaines variables :

#### Variables Backend (à configurer manuellement) :

- **SMTP_USER** : Votre adresse email Gmail
- **SMTP_PASS** : Mot de passe d'application Gmail (voir ci-dessous)
- **OPENROUTER_API_KEY** : Votre clé API OpenRouter

#### Configuration Gmail SMTP :

1. Activez l'authentification à 2 facteurs sur votre compte Google
2. Générez un "Mot de passe d'application" :
   - https://myaccount.google.com/apppasswords
   - Sélectionnez "Mail" et votre appareil
   - Copiez le mot de passe généré (16 caractères)
3. Utilisez ce mot de passe dans `SMTP_PASS`

### 4. Lancer le Déploiement

1. Cliquez sur **"Create Blueprint"**
2. Render va automatiquement :
   - Créer la base de données PostgreSQL
   - Builder et déployer le backend
   - Builder et déployer le frontend
   - Configurer les variables d'environnement
   - Exécuter les migrations Prisma

### 5. Vérifier le Déploiement

Le déploiement prend généralement 5-10 minutes. Vous pouvez suivre la progression dans le dashboard Render.

Une fois terminé, vous aurez accès à :
- **Frontend** : `https://agency-platform-frontend.onrender.com`
- **Backend API** : `https://agency-platform-backend.onrender.com`
- **Base de données** : Gérée automatiquement par Render

## Configuration Post-Déploiement

### 1. Exécuter les Migrations (si nécessaire)

Si les migrations ne se sont pas exécutées automatiquement :

```bash
# Se connecter au service backend sur Render
# Aller dans le dashboard → Shell
# Exécuter :
npx prisma migrate deploy
```

### 2. Créer le Premier Utilisateur

Accédez à l'application et créez le premier utilisateur via l'interface d'inscription.

### 3. Tester les Fonctionnalités

- Inscription/Connexion
- Upload de fichiers
- Envoi d'emails
- Fonctionnalités IA (si OPENROUTER_API_KEY est configuré)

## Variables d'Environnement

### Backend

| Variable | Description | Valeur |
|----------|-------------|--------|
| `NODE_ENV` | Environnement | `production` |
| `PORT` | Port du serveur | `3001` |
| `DATABASE_URL` | URL de la base de données | Auto-généré par Render |
| `JWT_SECRET` | Clé secrète JWT | Auto-généré par Render |
| `JWT_REFRESH_SECRET` | Clé refresh JWT | Auto-généré par Render |
| `JWT_EXPIRES_IN` | Durée token JWT | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Durée token refresh | `30d` |
| `FRONTEND_URL` | URL du frontend | `https://agency-platform-frontend.onrender.com` |
| `UPLOAD_DIR` | Dossier uploads | `/app/uploads` |
| `SMTP_HOST` | Serveur SMTP | `smtp.gmail.com` |
| `SMTP_PORT` | Port SMTP | `587` |
| `SMTP_USER` | Email expéditeur | Votre email Gmail |
| `SMTP_PASS` | Mot de passe app Gmail | Mot de passe d'application |
| `SMTP_FROM` | Expéditeur | `Techno-logia <noreply@techno-logia.fr>` |
| `SMTP_DISABLED` | Désactiver SMTP | `false` |
| `OPENROUTER_API_KEY` | Clé API OpenRouter | Votre clé API |

### Frontend

| Variable | Description | Valeur |
|----------|-------------|--------|
| `NODE_ENV` | Environnement | `production` |
| `NEXT_PUBLIC_API_URL` | URL API backend | `https://agency-platform-backend.onrender.com/api` |
| `NEXT_PUBLIC_SOCKET_URL` | URL WebSocket | `https://agency-platform-backend.onrender.com` |
| `NEXT_PUBLIC_SITE_URL` | URL du site | `https://agency-platform-frontend.onrender.com` |

## Limitations du Plan Starter

Le plan Starter de Render a certaines limitations :

- **750 heures/mois** de temps d'exécution (suffisant pour un petit projet)
- **1GB** de stockage persistant
- **Mise en veille** après 15 minutes d'inactivité (le premier appel peut être lent)
- **Pas de SSL personnalisé** (SSL automatique inclus)

## Mises à jour Automatiques

Le déploiement est configuré pour se mettre à jour automatiquement à chaque push sur la branche `main`.

Pour désactiver les déploiements automatiques :
1. Allez dans le service Render
2. Settings → Auto-Deploy
3. Désactivez l'option

## Monitoring et Logs

### Voir les Logs

1. Allez dans le dashboard Render
2. Sélectionnez le service (backend ou frontend)
3. Cliquez sur **"Logs"**
4. Vous pouvez filtrer par niveau (info, error, warn)

### Métriques

Render fournit des métriques de base :
- CPU et mémoire utilisés
- Temps de réponse
- Nombre de requêtes

## Dépannage

### Le déploiement échoue

1. Vérifiez les logs de build dans Render
2. Assurez-vous que tous les fichiers sont commités
3. Vérifiez que les Dockerfiles sont valides

### L'application ne démarre pas

1. Vérifiez les logs du service
2. Assurez-vous que le port est correct (3001 pour backend, 3000 pour frontend)
3. Vérifiez que la base de données est accessible

### Erreurs de base de données

1. Vérifiez que `DATABASE_URL` est correctement configuré
2. Exécutez les migrations manuellement si nécessaire
3. Vérifiez les logs Prisma

### Uploads ne fonctionnent pas

1. Vérifiez que le disque persistant est monté sur `/app/uploads`
2. Vérifiez les permissions du dossier
3. Consultez les logs backend

## Support

- Documentation Render : https://render.com/docs
- Support Render : https://render.com/support
- Issues du projet : Créez une issue sur GitHub

## Coûts Estimés

- **Backend (Starter)** : $7/mois
- **Frontend (Starter)** : $7/mois
- **PostgreSQL (Starter)** : $7/mois
- **Stockage 1GB** : $0.10/mois

**Total** : ~$21/mois

Le plan gratuit de Render ne supporte pas les bases de données PostgreSQL, donc un plan payant est nécessaire.