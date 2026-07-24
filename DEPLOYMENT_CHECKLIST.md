# Checklist de Déploiement sur Render

Utilisez cette checklist pour vous assurer que tout est prêt pour le déploiement.

## ✅ Fichiers de Configuration Créés

- [x] `render.yaml` - Configuration Blueprint Render
- [x] `RENDER_DEPLOY.md` - Guide de déploiement détaillé
- [x] `backend/Dockerfile` - Image Docker du backend
- [x] `frontend/Dockerfile` - Image Docker du frontend
- [x] `backend/.env.example` - Variables d'environnement backend
- [x] `frontend/.env.example` - Variables d'environnement frontend

## 📋 Avant de Commencer

### 1. Repository GitHub/GitLab

- [ ] Le code est commité et poussé sur la branche `main`
- [ ] Le repository est accessible publiquement ou connecté à Render
- [ ] Les fichiers suivants sont présents :
  - `render.yaml` (à la racine)
  - `backend/Dockerfile`
  - `frontend/Dockerfile`
  - `backend/package.json`
  - `frontend/package.json`

### 2. Compte Render

- [ ] Compte créé sur https://render.com
- [ ] Carte bancaire ajoutée (nécessaire pour les bases de données)
- [ ] Repository GitHub/GitLab connecté à Render

## 🚀 Étapes de Déploiement

### Étape 1 : Préparer le Repository

```bash
# Dans le dossier agency-platform
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

- [ ] Code poussé vers GitHub/GitLab

### Étape 2 : Créer le Blueprint

1. [ ] Se connecter à Render
2. [ ] Cliquer sur **"New"** → **"Blueprint"**
3. [ ] Sélectionner le repository `agency-platform`
4. [ ] Render détecte automatiquement `render.yaml`

### Étape 3 : Configurer les Variables d'Environnement

Lors de la création du Blueprint, Render affiche les variables qui nécessitent une valeur :

#### Backend - Variables à configurer manuellement :

- [ ] **SMTP_USER** : Votre adresse email Gmail
  - Exemple : `contact@techno-logia.fr`
  
- [ ] **SMTP_PASS** : Mot de passe d'application Gmail
  - Générer sur : https://myaccount.google.com/apppasswords
  - Format : 16 caractères (sans espaces)
  
- [ ] **OPENROUTER_API_KEY** : Votre clé API OpenRouter
  - Obtenir sur : https://openrouter.ai/keys
  - Optionnel si vous n'utilisez pas les fonctionnalités IA

#### Variables auto-configurées par Render :

- [ ] `DATABASE_URL` - Gérée automatiquement
- [ ] `JWT_SECRET` - Générée automatiquement
- [ ] `JWT_REFRESH_SECRET` - Générée automatiquement
- [ ] `FRONTEND_URL` - URL du frontend (déjà configurée)
- [ ] `NEXT_PUBLIC_API_URL` - URL du backend (déjà configurée)
- [ ] `NEXT_PUBLIC_SOCKET_URL` - URL WebSocket (déjà configurée)
- [ ] `NEXT_PUBLIC_SITE_URL` - URL du site (déjà configurée)

### Étape 4 : Lancer le Déploiement

- [ ] Cliquer sur **"Create Blueprint"**
- [ ] Attendre la création des services (5-10 minutes)

## ✅ Vérifications Post-Déploiement

### Services Déployés

- [ ] **Base de données** `agency-platform-db` créée
- [ ] **Backend** `agency-platform-backend` déployé et en cours d'exécution
- [ ] **Frontend** `agency-platform-frontend` déployé et en cours d'exécution

### URLs Accessibles

- [ ] Frontend : https://agency-platform-frontend.onrender.com
- [ ] Backend API : https://agency-platform-backend.onrender.com
- [ ] Health check backend : https://agency-platform-backend.onrender.com/api/health

### Tests de Fonctionnalités

- [ ] Page d'accueil du frontend se charge
- [ ] Inscription d'un nouvel utilisateur fonctionne
- [ ] Connexion avec identifiants fonctionne
- [ ] Upload de fichiers fonctionne
- [ ] Envoi d'emails fonctionne (si SMTP configuré)
- [ ] Fonctionnalités IA fonctionnent (si OPENROUTER_API_KEY configuré)

## 🔧 Configuration Post-Déploiement

### Migrations Prisma

Si les migrations ne se sont pas exécutées automatiquement :

1. [ ] Aller dans le dashboard Render → Backend service
2. [ ] Cliquer sur **"Shell"**
3. [ ] Exécuter : `npx prisma migrate deploy`
4. [ ] Vérifier qu'aucune erreur n'apparaît

### Premier Utilisateur

- [ ] Créer le premier utilisateur via l'interface d'inscription
- [ ] Vérifier que l'email de confirmation est reçu (si SMTP activé)
- [ ] Se connecter avec le premier utilisateur

### Données de Test (Optionnel)

- [ ] Créer des données de test si nécessaire
- [ ] Vérifier que les données sont persistantes

## 📊 Monitoring

### Logs

- [ ] Vérifier les logs du backend (pas d'erreurs critiques)
- [ ] Vérifier les logs du frontend (pas d'erreurs critiques)
- [ ] Vérifier les logs de la base de données

### Métriques

- [ ] CPU et mémoire dans les limites du plan Starter
- [ ] Temps de réponse acceptable (< 2s)
- [ ] Pas d'erreurs 500

## 🔒 Sécurité

- [ ] Toutes les variables sensibles sont configurées (pas en dur dans le code)
- [ ] JWT_SECRET et JWT_REFRESH_SECRET sont générés automatiquement
- [ ] HTTPS est actif (SSL automatique Render)
- [ ] CORS configuré correctement (FRONTEND_URL)
- [ ] Rate limiting activé (express-rate-limit)

## 💰 Coûts

### Plan Recommandé : Starter

- [ ] Backend : $7/mois
- [ ] Frontend : $7/mois
- [ ] PostgreSQL : $7/mois
- [ ] Stockage 1GB : $0.10/mois
- [ ] **Total : ~$21/mois**

### Optimisation des Coûts (Optionnel)

- [ ] Utiliser le plan Free pour le frontend (si possible)
- [ ] Réduire le stockage si < 500MB utilisé
- [ ] Configurer la mise en veille pour réduire les heures d'utilisation

## 🔄 Mises à Jour

### Déploiement Automatique

- [ ] Configuré pour se déclencher sur push vers `main`
- [ ] Tester en faisant un petit commit et en poussant

### Rollback (si nécessaire)

- [ ] Savoir comment revenir à une version précédente
- [ ] Connaître l'emplacement des backups de base de données

## 📝 Documentation

- [ ] `RENDER_DEPLOY.md` lu et compris
- [ ] Variables d'environnement documentées
- [ ] Procédure de rollback documentée
- [ ] Contacts d'urgence enregistrés

## 🆘 Dépannage

### Si le déploiement échoue

- [ ] Vérifier les logs de build dans Render
- [ ] Vérifier que tous les fichiers sont commités
- [ ] Vérifier la syntaxe de `render.yaml`
- [ ] Consulter `RENDER_DEPLOY.md` section Dépannage

### Si l'application ne démarre pas

- [ ] Vérifier les logs du service
- [ ] Vérifier le port (3001 backend, 3000 frontend)
- [ ] Vérifier la base de données
- [ ] Vérifier les variables d'environnement

### Si les uploads ne fonctionnent pas

- [ ] Vérifier que le disque persistant est monté
- [ ] Vérifier les permissions du dossier `/app/uploads`
- [ ] Consulter les logs backend

## ✨ Finalisation

- [ ] Toutes les fonctionnalités sont testées et fonctionnelles
- [ ] Les logs sont propres (pas d'erreurs critiques)
- [ ] La documentation est à jour
- [ ] L'équipe est informée du déploiement
- [ ] Les URLs sont partagées avec les utilisateurs

## 📞 Support

- **Documentation Render** : https://render.com/docs
- **Support Render** : https://render.com/support
- **Issues du projet** : Créer une issue sur GitHub

---

**Date de déploiement** : _______________

**Déployé par** : _______________

**URLs** :
- Frontend : https://agency-platform-frontend.onrender.com
- Backend : https://agency-platform-backend.onrender.com

**Notes** :
_________________________________
_________________________________
_________________________________