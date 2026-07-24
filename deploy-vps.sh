#!/usr/bin/env bash
set -euo pipefail

export DOCKERHUB_USERNAME="${DOCKERHUB_USERNAME:-your-dockerhub-username}"
export POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-postgres}"
export JWT_SECRET="${JWT_SECRET:-changeme}"
export JWT_REFRESH_SECRET="${JWT_REFRESH_SECRET:-changeme}"
export FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"
export NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-http://localhost:3001/api}"
export NEXT_PUBLIC_SOCKET_URL="${NEXT_PUBLIC_SOCKET_URL:-http://localhost:3001}"
export NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-http://localhost:3000}"
export SMTP_HOST="${SMTP_HOST:-smtp.gmail.com}"
export SMTP_PORT="${SMTP_PORT:-587}"
export SMTP_USER="${SMTP_USER:-}"
export SMTP_PASS="${SMTP_PASS:-}"
export SMTP_FROM="${SMTP_FROM:-Techno-logia <noreply@techno-logia.fr>}"
export SMTP_DISABLED="${SMTP_DISABLED:-false}"

mkdir -p /opt/agency-platform/nginx/ssl

cat > /opt/agency-platform/.env <<EOF
DOCKERHUB_USERNAME=${DOCKERHUB_USERNAME}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
JWT_SECRET=${JWT_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
FRONTEND_URL=${FRONTEND_URL}
NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
NEXT_PUBLIC_SOCKET_URL=${NEXT_PUBLIC_SOCKET_URL}
NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
SMTP_HOST=${SMTP_HOST}
SMTP_PORT=${SMTP_PORT}
SMTP_USER=${SMTP_USER}
SMTP_PASS=${SMTP_PASS}
SMTP_FROM=${SMTP_FROM}
SMTP_DISABLED=${SMTP_DISABLED}
EOF

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is not installed on the VPS"
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose is not available"
  exit 1
fi

docker compose -f docker-compose.prod.yml pull

docker compose -f docker-compose.prod.yml up -d --remove-orphans

docker compose -f docker-compose.prod.yml ps
