# 🔍 Vérification de l'authentification Google en Production

## 📋 URL du site
**Frontend** : https://technologia-62da.onrender.com  
**Backend** : https://agency-platform-backend.onrender.com

---

## ✅ Vérifications effectuées

### 1. Configuration Backend ✅

**Fichier modifié** : `render.yaml`
- ✅ Ajout de `GOOGLE_CLIENT_ID` (sync: false - à configurer manuellement sur Render)
- ✅ Ajout de `GOOGLE_CLIENT_SECRET` (sync: false - à configurer manuellement sur Render)
- ✅ Ajout de `GOOGLE_CALLBACK_URL` : `https://technologia-62da.onrender.com/api/auth/google/callback`

### 2. Configuration du code Backend ✅

**Fichier** : `backend/src/index.ts`
- ✅ Import de Passport
- ✅ Import de la stratégie Google
- ✅ Initialisation de Passport (`app.use(passport.initialize())`)

**Fichier** : `backend/src/passport/google.strategy.ts`
- ✅ Stratégie Google OAuth2 configurée
- ✅ Création automatique de compte client
- ✅ Gestion des erreurs

**Fichier** : `backend/src/routes/auth.google.routes.ts`
- ✅ Route `/api/auth/google` pour initier la connexion
- ✅ Route `/api/auth/google/callback` pour le callback
- ✅ Génération de JWT avec `name`, `email`, `id`, `role`
- ✅ Redirection vers le frontend avec tokens

### 3. Configuration Frontend ✅

**Fichier** : `frontend/app/auth/login/page.tsx`
- ✅ Bouton "Se connecter avec Google" présent
- ✅ URL correcte vers `/api/auth/google`

**Fichier** : `frontend/app/auth/callback/page.tsx`
- ✅ Page de callback pour recevoir les tokens
- ✅ Décodage du JWT
- ✅ Redirection vers `/client` ou `/admin`
- ✅ Gestion des erreurs

---

## ⚙️ Configuration requise sur Render

### Étape 1 : Configurer les variables d'environnement du Backend

1. Aller sur https://dashboard.render.com
2. Sélectionner le service `agency-platform-backend`
3. Aller dans **Environment**
4. Ajouter ces variables :

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=https://technologia-62da.onrender.com/api/auth/google/callback
FRONTEND_URL=https://technologia-62da.onrender.com
```

5. Cliquer sur **Save Changes**
6. Le service va redéployer automatiquement

### Étape 2 : Configurer Google Cloud Console

1. Aller sur https://console.cloud.google.com
2. Sélectionner votre projet
3. Aller dans **APIs & Services** → **Credentials**
4. Cliquer sur votre OAuth 2.0 Client ID
5. Modifier les **Authorized redirect URIs** :

```
https://technologia-62da.onrender.com/api/auth/google/callback
```

6. Ajouter les **Authorized JavaScript origins** :

```
https://technologia-62da.onrender.com
```

7. Cliquer sur **Save**

### Étape 3 : Vérifier le frontend

Le frontend est déjà configuré dans `render.yaml` :

```yaml
- key: NEXT_PUBLIC_API_URL
  fromService:
    name: agency-platform-backend
    type: web
    property: host
    suffix: /api
```

Cela génère automatiquement : `https://agency-platform-backend.onrender.com/api`

---

## 🧪 Tests à effectuer

### Test 1 : Vérifier que le backend fonctionne

```bash
curl https://agency-platform-backend.onrender.com/api/health
```

Réponse attendue :
```json
{
  "status": "ok",
  "timestamp": "2024-..."
}
```

### Test 2 : Vérifier la route Google OAuth

```bash
curl https://agency-platform-backend.onrender.com/api/auth/google
```

Devrait rediriger vers Google (erreur 302 ou redirection).

### Test 3 : Tester la connexion Google

1. Aller sur https://technologia-62da.onrender.com/auth/login
2. Cliquer sur **"Se connecter avec Google"**
3. Se connecter avec un compte Google
4. Vérifier la redirection vers `/client` ou `/admin`

### Test 4 : Vérifier les logs Render

1. Aller sur le dashboard Render
2. Sélectionner `agency-platform-backend`
3. Aller dans **Logs**
4. Chercher les messages :
   - `🚀 Server running on http://localhost:3001`
   - `Client connected:` (pour Socket.io)
   - En cas d'erreur Google : messages d'erreur détaillés

---

## 🐛 Problèmes courants et solutions

### Problème 1 : "redirect_uri_mismatch"

**Cause** : L'URI de callback dans Google Cloud Console ne correspond pas à celle configurée.

**Solution** :
1. Vérifier dans Google Cloud Console :
   - URI de redirection autorisés : `https://technologia-62da.onrender.com/api/auth/google/callback`
2. Vérifier dans Render :
   - `GOOGLE_CALLBACK_URL` = `https://technologia-62da.onrender.com/api/auth/google/callback`

### Problème 2 : "invalid_client"

**Cause** : Client ID ou Client Secret incorrect.

**Solution** :
1. Vérifier dans Google Cloud Console que les identifiants sont corrects
2. Vérifier dans Render que les variables sont bien configurées
3. Redéployer le service après modification

### Problème 3 : "Access blocked"

**Cause** : L'API Google+ n'est pas activée ou le compte Google n'est pas autorisé.

**Solution** :
1. Aller dans Google Cloud Console → APIs & Services → Library
2. Chercher "Google+ API" et l'activer
3. Si en mode "Testing", ajouter les emails de test dans OAuth consent screen

### Problème 4 : Erreur CORS

**Cause** : FRONTEND_URL mal configuré.

**Solution** :
1. Vérifier dans Render que `FRONTEND_URL` = `https://technologia-62da.onrender.com`
2. Redéployer le backend

### Problème 5 : Token expiré ou invalide

**Cause** : JWT_SECRET différent entre les redéploiements.

**Solution** :
1. Render génère automatiquement `JWT_SECRET` et `JWT_REFRESH_SECRET`
2. Ces valeurs sont persistantes entre les redéploiements
3. Si vous les avez modifiées manuellement, vérifiez qu'elles sont correctes

---

## 📊 Checklist de vérification

### Backend
- [ ] Variables d'environnement configurées sur Render
- [ ] GOOGLE_CLIENT_ID présent
- [ ] GOOGLE_CLIENT_SECRET présent
- [ ] GOOGLE_CALLBACK_URL = `https://technologia-62da.onrender.com/api/auth/google/callback`
- [ ] FRONTEND_URL = `https://technologia-62da.onrender.com`
- [ ] Service redéployé après modifications

### Google Cloud Console
- [ ] OAuth 2.0 Client ID créé
- [ ] Authorized redirect URIs contient : `https://technologia-62da.onrender.com/api/auth/google/callback`
- [ ] Authorized JavaScript origins contient : `https://technologia-62da.onrender.com`
- [ ] Google+ API activée (si nécessaire)

### Frontend
- [ ] Site accessible sur https://technologia-62da.onrender.com
- [ ] Bouton "Se connecter avec Google" visible
- [ ] Redirection vers Google fonctionne
- [ ] Callback fonctionne et redirige vers /client ou /admin

---

## 🔄 Redéployer après modifications

### Backend
```bash
# Si vous avez modifié le code, poussez vers GitHub
git add .
git commit -m "fix: Google OAuth configuration"
git push

# Render redéploiera automatiquement
```

### Frontend
```bash
# Même processus
git add .
git commit -m "chore: update frontend"
git push
```

---

## 📝 Notes importantes

1. **Ne jamais commit de .env** : Les fichiers `.env` sont dans `.gitignore`
2. **Variables Render** : Toutes les variables sensibles sont configurées sur Render
3. **HTTPS obligatoire** : Google OAuth nécessite HTTPS en production
4. **Callback URL** : Doit être exactement la même dans Google Cloud Console et Render

---

## 🎯 Résultat attendu

Après configuration complète :
1. ✅ L'utilisateur clique sur "Se connecter avec Google"
2. ✅ Il est redirigé vers Google
3. ✅ Il se connecte avec son compte Google
4. ✅ Il est redirigé vers le frontend avec un token JWT
5. ✅ Il est connecté et redirigé vers `/client` (ou `/admin` si admin)
6. ✅ Son nom et email sont affichés correctement

---

**Date de dernière mise à jour** : 2026-03-08  
**Site en production** : https://technologia-62da.onrender.com