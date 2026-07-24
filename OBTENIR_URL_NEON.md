# 🎯 Comment Obtenir Votre URL Neon (2 minutes)

## ⚠️ Important

**Je ne peux pas vous donner l'URL** car :
- Elle est unique à VOTRE compte
- Elle contient VOS identifiants (user, password, host)
- Elle n'existe que si VOUS créez le projet

**MAIS** : C'est très facile à obtenir vous-même ! Suivez ces étapes :

---

## 📝 MÉTHODE LA PLUS SIMPLE (30 secondes)

### Étape 1 : Allez sur Neon
```
https://neon.tech
```

### Étape 2 : Connectez-vous
- Cliquez sur **"Sign Up"** (en haut à droite)
- Choisissez **"Sign up with GitHub"**
- Autorisez Neon

### Étape 3 : Créez un projet
- Cliquez sur **"New Project"**
- Nom : `agency-platform`
- Region : `Europe (Frankfurt)`
- Cliquez sur **"Create Project"**

### Étape 4 : COPIEZ L'URL
- **Regardez en haut de la page** après la création
- Vous voyez un **bloc noir** avec du texte comme ça :

```
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.eu-central-1.aws.neon.tech/neondb
```

- **Cliquez sur le bouton [Copy]** à droite du bloc
- **C'est fait !** Vous avez votre URL

---

## ✅ Exemple Concret

### Ce que vous allez voir :

```
┌──────────────────────────────────────────────────────────────┐
│  postgresql://alex:AbC123dEf@ep-cool-darkness-123456...      │
│                                              [Copy]           │
└──────────────────────────────────────────────────────────────┘
```

### Ce que vous devez copier :

```
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.eu-central-1.aws.neon.tech/neondb
```

---

## 📋 Où Coller l'URL

### 1. Dans le fichier `.env` (racine du projet)

Ouvrez `agency-platform/.env` et ajoutez/modifiez cette ligne :

```env
DATABASE_URL=postgresql://alex:AbC123dEf@ep-cool-darkness-123456.eu-central-1.aws.neon.tech/neondb
```

**Remplacez** `postgresql://alex:AbC123dEf@ep-cool-darkness-123456.eu-central-1.aws.neon.tech/neondb` par **votre URL copiée**

### 2. Dans le fichier `backend/.env.production`

Ouvrez `agency-platform/backend/.env.production` et modifiez cette ligne :

```env
DATABASE_URL=postgresql://alex:AbC123dEf@ep-cool-darkness-123456.eu-central-1.aws.neon.tech/neondb
```

**Remplacez** par **votre URL copiée**

---

## 🎯 Format de l'URL

Toute URL Neon ressemble à ça :

```
postgresql://[user]:[password]@[host]/[database]
```

**Exemple** :
```
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.eu-central-1.aws.neon.tech/neondb
```

- `alex` = votre user
- `AbC123dEf` = votre password
- `ep-cool-darkness-123456.eu-central-1.aws.neon.tech` = votre host
- `neondb` = votre database

---

## 🚀 Après avoir copié l'URL

1. ✅ Collez l'URL dans `.env` et `backend/.env.production`
2. ✅ Suivez `INSTRUCTIONS_FINALES.md` pour déployer sur Fly.io
3. ✅ Exécutez `npx prisma migrate deploy`

---

## 🆘 Si Vous Ne Trouvez Pas l'URL

### Option 1 : Regardez en haut de la page
- Après avoir créé le projet, l'URL est affichée dans un **bloc noir** en haut

### Option 2 : Connection Details
- Menu de gauche → **"Connection Details"**
- Section **"Connection string"**
- Bouton **"Copy"**

### Option 3 : Utilisez Neon CLI
```bash
neon projects list
neon projects get agency-platform
```

---

## 💡 Astuce

**L'URL est longue** (environ 100 caractères). Assurez-vous de copier TOUTE l'URL, pas juste le début.

---

## 📞 Support

Si vous avez des problèmes :
- **Neon Docs** : https://neon.tech/docs
- **Neon Discord** : https://discord.gg/neon

---

## ✅ RÉSUMÉ

1. Allez sur https://neon.tech
2. Créez un compte avec GitHub
3. Créez le projet `agency-platform`
4. **COPIEZ L'URL** depuis le bloc noir en haut
5. Collez-la dans `.env` et `backend/.env.production`

**C'est tout !** 🎉

---

**Note** : Je ne peux pas créer cette URL pour vous, mais elle est générée automatiquement en 30 secondes quand vous créez le projet sur Neon.