#!/bin/bash

# 🚀 Quick VPS Deployment Script for Mubinyx
# Run this script on your VPS to deploy Mubinyx application

echo "🚀 Mubinyx Quick VPS Deployment"
echo "================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Domain input
read -p "🌐 Enter your domain name (e.g., yourdomain.com): " DOMAIN_NAME

if [ -z "$DOMAIN_NAME" ]; then
    echo -e "${RED}Domain name is required!${NC}"
    exit 1
fi

echo -e "${GREEN}Using domain: $DOMAIN_NAME${NC}"

# Update system
echo -e "${YELLOW}[1/8]${NC} Updating system packages..."
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git build-essential software-properties-common

# Install Node.js
echo -e "${YELLOW}[2/8]${NC} Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 and Nginx
echo -e "${YELLOW}[3/8]${NC} Installing PM2 and Nginx..."
sudo npm install -g pm2
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Create app directory and clone
echo -e "${YELLOW}[4/8]${NC} Setting up application..."
sudo mkdir -p /var/www/mubinyx
sudo chown -R $USER:$USER /var/www/mubinyx
cd /var/www/mubinyx

# Clone repository (you may need to update this URL)
git clone https://github.com/bangcalvinsetiawan/mubinyx.git .

# Install dependencies and build
echo -e "${YELLOW}[5/8]${NC} Installing dependencies and building..."

# Backend
cd /var/www/mubinyx/backend
npm install --production

# Frontend
cd /var/www/mubinyx/frontend
npm install --production
npm run build

# Setup environment files
echo -e "${YELLOW}[6/8]${NC} Setting up environment configuration..."

# Backend environment
cd /var/www/mubinyx/backend
cat > .env << EOF
DATABASE_URL="file:./dev.db"
JWT_SECRET="mubinyx-super-secret-jwt-key-$(date +%s)"
PORT=3010
CORS_ORIGIN="https://$DOMAIN_NAME"
EOF

# Frontend environment
cd /var/www/mubinyx/frontend
cat > .env.local << EOF
NEXT_PUBLIC_API_URL="https://$DOMAIN_NAME/api"
NEXT_PUBLIC_APP_NAME="Mubinyx"
NEXT_PUBLIC_APP_URL="https://$DOMAIN_NAME"
NEXT_PUBLIC_ENABLE_CRYPTO=true
EOF

# Setup database
echo -e "${YELLOW}[7/8]${NC} Setting up database..."
cd /var/www/mubinyx/backend
npx prisma generate
npx prisma db push
npx prisma db seed

# Build backend
npm run build

# Create PM2 configuration
cd /var/www/mubinyx
mkdir -p logs

cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'mubinyx-backend',
      cwd: './backend',
      script: 'npm',
      args: 'run start:prod',
      env: {
        NODE_ENV: 'production',
        PORT: 3010
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'mubinyx-frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};
EOF

# Configure Nginx
echo -e "${YELLOW}[8/8]${NC} Configuring Nginx..."
sudo tee /etc/nginx/sites-available/mubinyx << EOF
server {
    listen 80;
    server_name $DOMAIN_NAME www.$DOMAIN_NAME;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location /api {
        rewrite ^/api/(.*) /\$1 break;
        proxy_pass http://localhost:3010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location /uploads {
        alias /var/www/mubinyx/backend/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/mubinyx /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
sudo nginx -t && sudo systemctl reload nginx

# Start applications
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo "================================"
echo ""
echo -e "📋 ${YELLOW}Next Steps:${NC}"
echo "1. Point your domain DNS to this server's IP address"
echo "2. Install SSL certificate:"
echo "   sudo apt install certbot python3-certbot-nginx"
echo "   sudo certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME"
echo ""
echo -e "🌐 ${YELLOW}Access your application:${NC}"
echo "   Frontend: http://$DOMAIN_NAME"
echo "   Backend API: http://$DOMAIN_NAME/api"
echo ""
echo -e "🔧 ${YELLOW}Management commands:${NC}"
echo "   Check status: pm2 status"
echo "   View logs: pm2 logs"
echo "   Restart: pm2 restart ecosystem.config.js"
echo ""
echo -e "⚠️  ${YELLOW}Important:${NC}"
echo "   - Update JWT_SECRET in /var/www/mubinyx/backend/.env"
echo "   - Configure SMTP settings for email functionality"
echo "   - Setup SSL certificate for production use"
echo ""
echo -e "${GREEN}Happy deploying! 🚀${NC}"
