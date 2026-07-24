#!/bin/bash

# WSL Ubuntu Setup Script for Agency Platform
# This script sets up the development environment on WSL Ubuntu

set -e

echo "🚀 Setting up Agency Platform on WSL Ubuntu..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
echo "📦 Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
echo "📦 Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Setup PostgreSQL database
echo "🗄️ Setting up PostgreSQL database..."
sudo -u postgres psql -c "CREATE DATABASE agency_platform;"
sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'deepseek';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE agency_platform TO postgres;"

# Install Docker
echo "📦 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
rm get-docker.sh

# Install Docker Compose
echo "📦 Installing Docker Compose..."
sudo apt install -y docker-compose-plugin

# Install Git
echo "📦 Installing Git..."
sudo apt install -y git

# Install PM2 for process management
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Configure Git (optional)
echo "🔧 Configure Git if needed:"
echo "git config --global user.name 'Your Name'"
echo "git config --global user.email 'your@email.com'"

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Clone your repository: git clone <your-repo-url>"
echo "2. Navigate to project: cd agency-platform"
echo "3. Install backend dependencies: cd backend && npm install"
echo "4. Install frontend dependencies: cd ../frontend && npm install"
echo "5. Setup database: cd ../backend && npx prisma db push"
echo "6. Start development servers:"
echo "   - Backend: cd backend && npm run dev"
echo "   - Frontend: cd frontend && npm run dev"
echo ""
echo "For production deployment with Docker:"
echo "1. Copy .env.prod to .env and update variables"
echo "2. Run: docker-compose -f docker-compose.prod.yml up -d"
