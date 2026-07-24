# Déploiement gratuit sur VPS avec Jenkins, Docker Hub et HTTPS

Ce guide permet de déployer l’application gratuitement sur un VPS Linux, avec :
- Jenkins pour la CI/CD
- Docker Hub pour les images
- Docker Compose pour l’exécution
- Nginx + HTTPS via Let’s Encrypt
- SMTP pour les emails

## 1. Prérequis

- Un VPS Ubuntu/Debian avec accès SSH
- Un domaine pointant vers l’IP du VPS
- Un compte Docker Hub
- Un compte GitHub/GitLab/Bitbucket avec le dépôt

## 2. Installer Docker et HTTPS sur le VPS

Exécuter sur le VPS :

```bash
chmod +x setup-vps.sh
bash setup-vps.sh votre-domaine.com admin@votre-domaine.com
```

## 3. Copier le projet sur le VPS

```bash
sudo mkdir -p /opt/agency-platform
sudo chown -R $USER:$USER /opt/agency-platform
cd /opt/agency-platform
```

Copier les fichiers du projet dans ce dossier, notamment :
- docker-compose.prod.yml
- deploy-vps.sh
- nginx/

## 4. Variables d’environnement

Créer un fichier .env sur le VPS :

```bash
nano /opt/agency-platform/.env
```

Contenu recommandé :

```env
DOCKERHUB_USERNAME=votre_nom_dockerhub
POSTGRES_PASSWORD=MotDePasseFort123!
JWT_SECRET=une_cle_secrete_tres_longue
JWT_REFRESH_SECRET=une_autre_cle_secrete_tres_longue
FRONTEND_URL=https://votre-domaine.com
NEXT_PUBLIC_API_URL=https://votre-domaine.com/api
NEXT_PUBLIC_SOCKET_URL=https://votre-domaine.com
NEXT_PUBLIC_SITE_URL=https://votre-domaine.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre_email@gmail.com
SMTP_PASS=votre_mot_de_passe_app
SMTP_FROM=Techno-logia <noreply@votre-domaine.com>
SMTP_DISABLED=false
```

## 5. SMTP Gmail (gratuit)

Pour Gmail :
- activer les mots de passe d’applications
- utiliser le mot de passe généré au lieu du mot de passe classique

Si l’authentification Gmail bloque l’envoi, utiliser :
- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=587`
- `SMTP_USER=votre_email@gmail.com`
- `SMTP_PASS=mot_de_passe_app`

## 6. Déployer avec Docker Compose

```bash
cd /opt/agency-platform
docker compose -f docker-compose.prod.yml up -d
```

## 7. Vérifier

```bash
docker compose ps
curl -I https://votre-domaine.com
```

## 8. Jenkins

Créer dans Jenkins les credentials suivants :
- docker-hub-credentials
- postgres-password
- jwt-secret
- jwt-refresh-secret
- vps-host
- vps-user
- vps-deploy-path
- vps-ssh-credentials

Le pipeline va automatiquement :
1. construire les images Docker
2. les pousser sur Docker Hub
3. les déployer sur le VPS par SSH

## 9. DNS

Créer un A record vers l’IP du VPS :
- `@` → IP VPS
- `www` → IP VPS

## 10. Résolution de problèmes

Si les emails ne partent pas :
- vérifier `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- tester avec un mot de passe d’application Gmail
- vérifier que `SMTP_DISABLED=false`

Si le site ne répond pas :
- vérifier les ports 80/443 ouverts
- vérifier `docker compose ps`
- vérifier `sudo journalctl -u docker --no-pager -n 100`
