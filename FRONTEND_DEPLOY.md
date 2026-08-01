# 🚀 Guide de déploiement du frontend sur Render

## ✅ Configuration du Web Service

### 1. Créer le service

1. Aller sur https://dashboard.render.com
2. Cliquer sur **"+ New"** → **"Web Service"**
3. Connecter le repo : `sarobidyfalimitia-droid/Site-projet`
4. Render détectera le `render.yaml` automatiquement

### 2. Configuration manuelle (si pas de render.yaml)

| Champ | Valeur |
|-------|--------|
| **Name** | `agency-platform-frontend` |
| **Environment** | `Node` |
| **Region** | `Frankfurt` (ou le plus proche) |
| **Branch** | `main` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm ci --include=dev && npm run build` |
| **Start Command** | `npm start` |

---

## 📋 Variables d'environnement à ajouter

### Sur le service FRONTEND

Ajouter ces variables **UNE PAR UNE** dans **Environment** :

#### 1. NEXT_PUBLIC_API_URL
```
Key: NEXT_PUBLIC_API_URL
Value: https://techno-logia.onrender.com/api
Sync: ❌ Décocher "Sync"
```

#### 2. NEXT_PUBLIC_SOCKET_URL
```
Key: NEXT_PUBLIC_SOCKET_URL
Value: https://techno-logia.onrender.com
Sync: ❌ Décocher "Sync"
```

#### 3. NEXT_PUBLIC_SITE_URL
```
Key: NEXT_PUBLIC_SITE_URL
Value: https://agency-platform-frontend.onrender.com
Sync: ❌ Décocher "Sync"
```

#### 4. NEXT_PUBLIC_GOOGLE_CLIENT_ID
```
Key: NEXT_PUBLIC_GOOGLE_CLIENT_ID
Value: [VOTRE CLIENT ID GOOGLE]
Sync: ❌ Décocher "Sync"
```

**Comment obtenir le Google Client ID ?**
1. Aller sur https://console.cloud.google.com
2. Sélectionner votre projet
3. **APIs & Services** → **Credentials**
4. Cliquer sur votre OAuth 2.0 Client ID
5. Copier le **Client ID** (ex: `123456789-abc123def456.apps.googleusercontent.com`)

#### 5. NODE_ENV
```
Key: NODE_ENV
Value: production
Sync: ✅ Laisser coché
```

---

## 🔧 Variables à ajouter sur le BACKEND (si pas déjà fait)

Aller sur le service `agency-platform-backend` → **Environment** :

#### 1. GOOGLE_CLIENT_ID
```
Key: GOOGLE_CLIENT_ID
Value: [MÊME CLIENT ID QUE LE FRONTEND]
Sync: ❌ Décocher "Sync"
```

#### 2. GOOGLE_CLIENT_SECRET
```
Key: GOOGLE_CLIENT_SECRET
Value: [VOTRE CLIENT SECRET GOOGLE]
Sync: ❌ Décocher "Sync"
```

**Où trouver le Client Secret ?**
1. Même endroit que le Client ID (Google Cloud Console)
2. C'est la valeur qui commence par `GOCSPX-...`

#### 3. GOOGLE_CALLBACK_URL
```
Key: GOOGLE_CALLBACK_URL
Value: https://techno-logia.onrender.com/api/auth/google/callback
Sync: ❌ Décocher "Sync"
```

#### 4. FRONTEND_URL
```
Key: FRONTEND_URL
Value: https://agency-platform-frontend.onrender.com
Sync: ❌ Décocher "Sync"
```

---

## 🌐 Configuration Google Cloud Console

### 1. Ajouter les URIs autorisées

1. Aller sur https://console.cloud.google.com
2. **APIs & Services** → **Credentials**
3. Cliquer sur votre OAuth 2.0 Client ID
4. Section **"Authorized redirect URIs"** :
   ```
   https://techno-logia.onrender.com/api/auth/google/callback
   ```

5. Section **"Authorized JavaScript origins"** :
   ```
   https://agency-platform-frontend.onrender.com
   ```

6. Cliquer sur **"Save"**

---

## ✅ Checklist de déploiement

### Frontend
- [ ] Créer Web Service (pas Static Site)
- [ ] Name: `agency-platform-frontend`
- [ ] Root Directory: `frontend`
- [ ] Build Command: `npm ci --include=dev && npm run build`
- [ ] Start Command: `npm start`
- [ ] Variable: `NEXT_PUBLIC_API_URL`
- [ ] Variable: `NEXT_PUBLIC_SOCKET_URL`
- [ ] Variable: `NEXT_PUBLIC_SITE_URL`
- [ ] Variable: `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- [ ] Variable: `NODE_ENV`

### Backend
- [ ] Variable: `GOOGLE_CLIENT_ID`
- [ ] Variable: `GOOGLE_CLIENT_SECRET`
- [ ] Variable: `GOOGLE_CALLBACK_URL`
- [ ] Variable: `FRONTEND_URL`

### Google Cloud Console
- [ ] Authorized redirect URI: `https://techno-logia.onrender.com/api/auth/google/callback`
- [ ] Authorized JavaScript origin: `https://agency-platform-frontend.onrender.com`

---

## 🎯 Après le déploiement

1. Attendre 2-3 minutes pour le build
2. Vérifier le frontend : https://agency-platform-frontend.onrender.com
3. Tester la connexion classique
4. Tester la connexion Google
5. Vérifier les redirections

---

## 📝 Résumé des valeurs à copier-coller

### Frontend
```
NEXT_PUBLIC_API_URL=https://techno-logia.onrender.com/api
NEXT_PUBLIC_SOCKET_URL=https://techno-logia.onrender.com
NEXT_PUBLIC_SITE_URL=https://agency-platform-frontend.onrender.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=votre-client-id-google
NODE_ENV=production
```

### Backend
```
GOOGLE_CLIENT_ID=votre-client-id-google
GOOGLE_CLIENT_SECRET=votre-client-secret-google
GOOGLE_CALLBACK_URL=https://techno-logia.onrender.com/api/auth/google/callback
FRONTEND_URL=https://agency-platform-frontend.onrender.com
```

---

## ⚠️ Important

- **Client ID** : Même valeur pour frontend ET backend
- **Client Secret** : Seulement sur le backend (jamais exposé)
- **URLs** : Remplacer `agency-platform-frontend.onrender.com` par votre vraie URL Render