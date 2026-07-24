# Configuration Manuelle de Neon (Plus Simple)

Si le script `SETUP_NEON.bat` ne fonctionne pas, suivez ces étapes manuelles.

---

## 📝 ÉTAPE 1 : Créer un Compte Neon

1. **Ouvrez votre navigateur** et allez sur : **https://neon.tech**
2. **Cliquez sur "Sign Up"** (en haut à droite)
3. **Choisissez "Sign up with GitHub"**
4. **Autorisez Neon** à accéder à votre compte GitHub
5. **Connectez-vous**

---

## 📝 ÉTAPE 2 : Créer un Projet

1. Une fois connecté, vous arrivez sur le dashboard
2. **Cliquez sur "New Project"** (bouton en haut à droite)
3. **Remplissez les informations** :
   - **Project name** : `agency-platform`
   - **Region** : Choisissez `Europe (Frankfurt)` ou `Europe (Paris)`
   - **PostgreSQL version** : Laissez la version par défaut (15 ou 16)
4. **Cliquez sur "Create Project"**

---

## 📝 ÉTAPE 3 : Récupérer l'URL de Connexion

### Méthode A : Depuis le Dashboard (Plus Simple)

1. Après la création du projet, vous voyez une page avec :
   - Un **bloc noir** en haut avec l'URL de connexion
   - Format : `postgresql://user:password@host/dbname`

2. **COPIEZ CETTE URL** (bouton "Copy" à droite du bloc)

### Méthode B : Depuis "Connection Details"

1. Dans le dashboard, cliquez sur **"Connection Details"** (à gauche)
2. Sous **"Connection string"**, vous voyez l'URL complète
3. **COPIEZ-LA**

---

## 📝 ÉTAPE 4 : Tester la Connexion (Optionnel)

```bash
# Installer psql si ce n'est pas fait
# Windows : Téléchargez PostgreSQL depuis https://www.postgresql.org/download/windows/

# Tester la connexion
psql "postgresql://user:password@host/dbname"
```

---

## 📝 ÉTAPE 5 : Configurer le Fichier .env

1. **Ouvrez le fichier `.env`** à la racine du projet (agency-platform/.env)

2. **Remplacez la ligne DATABASE_URL** (ou ajoutez-la si elle n'existe pas) :

```env
# Configuration Neon
DATABASE_URL=postgresql://user:password@host/dbname
```

**Remplacez** `postgresql://user:password@host/dbname` par **votre URL Neon copiée**

3. **Sauvegardez le fichier**

---

## 📝 ÉTAPE 6 : Copier l'URL dans backend/.env.production

1. **Ouvrez** `backend/.env.production`
2. **Remplacez** la ligne `DATABASE_URL` :

```env
DATABASE_URL=postgresql://user:password@host/dbname
```

3. **Sauvegardez le fichier**

---

## ✅ VÉRIFICATION

Votre URL Neon doit ressembler à ça :

```
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.eu-central-1.aws.neon.tech/neondb
```

**Format** : `postgresql://[user]:[password]@[host]/[database]`

---

## 🎯 Exemple Complet

Si votre URL Neon est :
```
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.eu-central-1.aws.neon.tech/neondb
```

Alors votre fichier `.env` doit contenir :
```env
DATABASE_URL=postgresql://alex:AbC123dEf@ep-cool-darkness-123456.eu-central-1.aws.neon.tech/neondb
```

---

## 🚀 Prochaines Étapes

Une fois que vous avez votre `DATABASE_URL` :

1. ✅ Copiez-la dans `.env` et `backend/.env.production`
2. ✅ Déployez le backend sur Fly.io (voir `INSTRUCTIONS_FINALES.md`)
3. ✅ Exécutez les migrations : `npx prisma migrate deploy`

---

## 🆘 Si Vous Avez des Problèmes

### Le dashboard Neon ne charge pas
- Vérifiez votre connexion internet
- Essayez un autre navigateur
- Videz le cache du navigateur

### Je ne trouve pas l'URL de connexion
- Allez dans **"Connection Details"** dans le menu de gauche
- Cliquez sur l'icône **"Copy"** à côté de "Connection string"

### L'URL ne fonctionne pas
- Vérifiez que vous avez bien copié toute l'URL
- Vérifiez qu'il n'y a pas d'espaces avant/après
- Vérifiez que le projet est bien actif (pas en pause)

---

## 📞 Support Neon

- **Documentation** : https://neon.tech/docs
- **Discord** : https://discord.gg/neon
- **GitHub** : https://github.com/neondatabase/neon

---

**Une fois que vous avez votre DATABASE_URL, passez à l'ÉTAPE 2 dans `INSTRUCTIONS_FINALES.md`**