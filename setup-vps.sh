#!/usr/bin/env bash
set -euo pipefail

DOMAIN="${1:-example.com}"
EMAIL="${2:-admin@$DOMAIN}"

if [[ "$DOMAIN" == "example.com" ]]; then
  echo "Usage: bash setup-vps.sh your-domain.com admin@example.com"
  exit 1
fi

sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release nginx ufw certbot python3-certbot-nginx

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo "\ndeb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker "$USER"

sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

sudo mkdir -p /opt/agency-platform/nginx/ssl
sudo mkdir -p /opt/agency-platform

sudo certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$EMAIL"

sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem /opt/agency-platform/nginx/ssl/fullchain.pem
sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem /opt/agency-platform/nginx/ssl/privkey.pem
sudo chmod 600 /opt/agency-platform/nginx/ssl/privkey.pem

echo "Installation complete."
echo "Next: copy your project to /opt/agency-platform and run docker compose -f docker-compose.prod.yml up -d"
