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
| **Name** | `technologia` |
| **Environment** | `Node` |
| **Region** | `Frankfurt` (ou le plus proche) |
| **Branch** | `main` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |

---

## 📋 Variables d'environnement à ajouter

### Sur le service FRONTEND

Ajouter ces variables **UNE PAR UNE** dans **Environment** :

#### 1. NEXT_PUBLIC_GOOGLE_CLIENT_ID
```
Key: NEXT_PUBLIC_GOOGLE_CLIENT_ID
Value: [VOTRE_CLIENT_ID_GOOGLE]
Sync: ❌ Décocher "Sync"
```

**Note** : Les autres variables (NEXT_PUBLIC_API_URL, NEXT_PUBLIC_SOCKET_URL, NEXT_PUBLIC_SITE_URL, NODE_ENV) seront automatiquement remplies par Render si vous utilisez le render.yaml.

---

## 🔧 Variables à ajouter sur le BACKEND (si pas déjà fait)

Aller sur le service `agency-platform-backend` → **Environment** :

#### 1. GOOGLE_CLIENT_ID
```
Key: GOOGLE_CLIENT_ID
Value: [VOTRE_CLIENT_ID_GOOGLE]
Sync: ❌ Décocher "Sync"
```

#### 2. GOOGLE_CLIENT_SECRET
```
Key: GOOGLE_CLIENT_SECRET
Value: [VOTRE_CLIENT_SECRET_GOOGLE]
Sync: ❌ Décocher "Sync"
```

#### 3. GOOGLE_CALLBACK_URL
```
Key: GOOGLE_CALLBACK_URL
Value: https://techno-logia.onrender.com/api/auth/google/callback
Sync: ❌ Décocher "Sync"
```

#### 4. FRONTEND_URL
```
Key: FRONTEND_URL
Value: https://technologia.onrender.com
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
   https://technologia.onrender.com
   ```

6. Cliquer sur **"Save"**

---

## ✅ Checklist de déploiement

### Frontend
- [ ] Créer Web Service (pas Static Site)
- [ ] Name: `technologia`
- [ ] Root Directory: `frontend`
- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm start`
- [ ] Variable: `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- [ ] Autres variables: automatiques via render.yaml

### Backend
- [ ] Variable: `GOOGLE_CLIENT_ID`
- [ ] Variable: `GOOGLE_CLIENT_SECRET`
- [ ] Variable: `GOOGLE_CALLBACK_URL`
- [ ] Variable: `FRONTEND_URL`

### Google Cloud Console
- [ ] Authorized redirect URI: `https://techno-logia.onrender.com/api/auth/google/callback`
- [ ] Authorized JavaScript origin: `https://technologia.onrender.com`

---

## 🎯 Après le déploiement

1. Attendre 2-3 minutes pour le build
2. Vérifier le frontend : https://technologia.onrender.com
3. Tester la connexion classique
4. Tester la connexion Google
5. Vérifier les redirections

---

## 📝 Résumé des valeurs à copier-coller

### Frontend
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=[VOTRE_CLIENT_ID_GOOGLE]
```

### Backend
```
GOOGLE_CLIENT_ID=[VOTRE_CLIENT_ID_GOOGLE]
GOOGLE_CLIENT_SECRET=[VOTRE_CLIENT_SECRET_GOOGLE]
GOOGLE_CALLBACK_URL=https://techno-logia.onrender.com/api/auth/google/callback
FRONTEND_URL=https://technologia.onrender.com
```

---

## ⚠️ Important

- **Client ID** : Même valeur pour frontend ET backend
- **Client Secret** : Seulement sur le backend (jamais exposé)
- **URLs** : Le frontend est maintenant sur `https://technologia.onrender.com`
- **Où trouver les valeurs** : Google Cloud Console → APIs & Services → Credentials