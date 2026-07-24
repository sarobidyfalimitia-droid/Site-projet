param(
    [Parameter(Mandatory = $true)]
    [string]$VpsHost,

    [Parameter(Mandatory = $true)]
    [string]$User,

    [Parameter(Mandatory = $true)]
    [string]$Domain,

    [string]$Email = "admin@$Domain",

    [string]$KeyPath = "$HOME\.ssh\id_ed25519"
)

$ErrorActionPreference = 'Stop'
$repoPath = Split-Path -Parent $PSScriptRoot
$projectName = Split-Path -Leaf $PSScriptRoot

if (-not (Test-Path $KeyPath)) {
    throw "La clé SSH n'existe pas à l'emplacement $KeyPath. Générez-la d'abord avec ssh-keygen."
}

Write-Host "Clé publique à ajouter sur le VPS :" -ForegroundColor Cyan
Get-Content "$KeyPath.pub"
Write-Host ""
Write-Host "Connexion au VPS en cours..." -ForegroundColor Yellow

$remoteScript = @'
set -e
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release nginx ufw certbot python3-certbot-nginx

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER

sudo ufw allow 22/tcp || true
sudo ufw allow 80/tcp || true
sudo ufw allow 443/tcp || true
sudo ufw --force enable || true

sudo mkdir -p /opt/agency-platform/nginx/ssl
sudo mkdir -p /opt/agency-platform
'@.Replace('{DOMAIN}', $Domain).Replace('{EMAIL}', $Email)

$remoteScript = $remoteScript + @'

sudo certbot --nginx -d {DOMAIN} --non-interactive --agree-tos -m {EMAIL} || true

if [ -f /etc/letsencrypt/live/{DOMAIN}/fullchain.pem ]; then
  sudo cp /etc/letsencrypt/live/{DOMAIN}/fullchain.pem /opt/agency-platform/nginx/ssl/fullchain.pem
  sudo cp /etc/letsencrypt/live/{DOMAIN}/privkey.pem /opt/agency-platform/nginx/ssl/privkey.pem
  sudo chmod 600 /opt/agency-platform/nginx/ssl/privkey.pem
fi
'@.Replace('{DOMAIN}', $Domain).Replace('{EMAIL}', $Email)

$remoteScript | ssh -i $KeyPath -o StrictHostKeyChecking=no -o UserKnownHostsFile="$HOME\.ssh\known_hosts" "$User@$VpsHost" 'bash -s'

Write-Host "Copie du projet vers le VPS..." -ForegroundColor Yellow
scp -i $KeyPath -o StrictHostKeyChecking=no -o UserKnownHostsFile="$HOME\.ssh\known_hosts" -r "$repoPath" "${User}@${VpsHost}:/tmp/${projectName}"

$deployScript = @'
sudo rm -rf /opt/agency-platform
sudo mkdir -p /opt/agency-platform
sudo cp -r /tmp/{PROJECT_NAME} /opt/agency-platform
sudo chown -R $USER:$USER /opt/agency-platform
cd /opt/agency-platform/{PROJECT_NAME}
cat > /opt/agency-platform/{PROJECT_NAME}/.env <<'EOF'
DOCKERHUB_USERNAME=your-dockerhub-username
POSTGRES_PASSWORD=MotDePasseFort123!
JWT_SECRET=change-me-please
JWT_REFRESH_SECRET=change-me-please-too
FRONTEND_URL=https://{DOMAIN}
NEXT_PUBLIC_API_URL=https://{DOMAIN}/api
NEXT_PUBLIC_SOCKET_URL=https://{DOMAIN}
NEXT_PUBLIC_SITE_URL=https://{DOMAIN}
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=Techno-logia <noreply@{DOMAIN}>
SMTP_DISABLED=false
EOF
cd /opt/agency-platform/{PROJECT_NAME}
sudo docker compose -f docker-compose.prod.yml up -d
'@.Replace('{PROJECT_NAME}', $projectName).Replace('{DOMAIN}', $Domain)

ssh -i $KeyPath -o StrictHostKeyChecking=no -o UserKnownHostsFile="$HOME\.ssh\known_hosts" "$User@$VpsHost" $deployScript

Write-Host "" 
Write-Host "Installation terminée." -ForegroundColor Green
Write-Host "Vérifie avec :" -ForegroundColor Cyan
Write-Host "  ssh $User@$VpsHost" -ForegroundColor White
Write-Host "  sudo docker compose -f /opt/agency-platform/$projectName/docker-compose.prod.yml ps" -ForegroundColor White
