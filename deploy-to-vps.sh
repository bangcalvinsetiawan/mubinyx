#!/bin/bash

# 🚀 Mubinyx VPS Deployment Script
# Auto-installer untuk deploy aplikasi Mubinyx ke VPS hosting

echo "🚀 Starting Mubinyx VPS Deployment..."
echo "============================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root for security reasons"
   print_status "Please run as a regular user with sudo privileges"
   exit 1
fi

# Update system packages
print_step "1. Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
print_step "2. Installing essential packages..."
sudo apt install -y curl wget git build-essential software-properties-common

# Install Node.js (using NodeSource repository)
print_step "3. Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js installation
node_version=$(node --version)
npm_version=$(npm --version)
print_status "Node.js installed: $node_version"
print_status "NPM installed: $npm_version"

# Install PM2 globally
print_step "4. Installing PM2 Process Manager..."
sudo npm install -g pm2

# Install Nginx
print_step "5. Installing Nginx..."
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Install SSL certificate tool (Certbot)
print_step "6. Installing Certbot for SSL..."
sudo apt install -y certbot python3-certbot-nginx

# Create application directory
APP_DIR="/var/www/mubinyx"
print_step "7. Creating application directory: $APP_DIR"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# Clone or copy application
print_step "8. Cloning Mubinyx application..."
cd $APP_DIR

# If git repository exists, clone it
if [ ! -d ".git" ]; then
    print_status "Cloning from GitHub repository..."
    git clone https://github.com/bangcalvinsetiawan/mubinyx.git .
else
    print_status "Repository already exists, pulling latest changes..."
    git pull origin main
fi

# Install backend dependencies
print_step "9. Installing backend dependencies..."
cd $APP_DIR/backend
npm install --production

# Install frontend dependencies  
print_step "10. Installing frontend dependencies..."
cd $APP_DIR/frontend
npm install --production

# Build frontend for production
print_step "11. Building frontend for production..."
npm run build

# Create environment files
print_step "12. Creating environment configuration..."
cd $APP_DIR

# Backend environment
cat > backend/.env << EOF
# Database
DATABASE_URL="file:./dev.db"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Application Port
PORT=3010

# CORS Origin
CORS_ORIGIN="https://yourdomain.com"

# Email Configuration (Update with your SMTP settings)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH="./uploads"

# Crypto API Keys (Update with your API keys)
BLOCKCHAIN_API_KEY="your-blockchain-api-key"
EXCHANGE_RATE_API_KEY="your-exchange-rate-api-key"
EOF

# Frontend environment
cat > frontend/.env.local << EOF
# Backend API URL
NEXT_PUBLIC_API_URL="https://yourdomain.com/api"

# App Configuration
NEXT_PUBLIC_APP_NAME="Mubinyx"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"

# Crypto Configuration
NEXT_PUBLIC_ENABLE_CRYPTO=true
EOF

# Setup database
print_step "13. Setting up database..."
cd $APP_DIR/backend
npx prisma generate
npx prisma db push
npx prisma db seed

# Create PM2 ecosystem file
print_step "14. Creating PM2 configuration..."
cat > $APP_DIR/ecosystem.config.js << EOF
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
      max_memory_restart: '1G',
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend-combined.log',
      time: true
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
      max_memory_restart: '1G',
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_file: './logs/frontend-combined.log',
      time: true
    }
  ]
};
EOF

# Create logs directory
mkdir -p $APP_DIR/logs

# Build backend for production
print_step "15. Building backend for production..."
cd $APP_DIR/backend
npm run build

# Create Nginx configuration
print_step "16. Configuring Nginx..."
sudo tee /etc/nginx/sites-available/mubinyx << EOF
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend (Next.js)
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

    # Backend API
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

    # Static files for uploads
    location /uploads {
        alias $APP_DIR/backend/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/mubinyx /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
print_step "17. Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    print_status "Nginx configuration is valid"
    sudo systemctl reload nginx
else
    print_error "Nginx configuration has errors"
    exit 1
fi

# Start applications with PM2
print_step "18. Starting applications with PM2..."
cd $APP_DIR
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
pm2 startup

# Create deployment scripts
print_step "19. Creating deployment scripts..."

# Create update script
cat > $APP_DIR/update.sh << 'EOF'
#!/bin/bash
echo "🔄 Updating Mubinyx application..."

cd /var/www/mubinyx

# Pull latest changes
git pull origin main

# Update backend
cd backend
npm install --production
npm run build

# Update frontend
cd ../frontend
npm install --production
npm run build

# Restart applications
cd ..
pm2 restart ecosystem.config.js

echo "✅ Application updated successfully!"
EOF

chmod +x $APP_DIR/update.sh

# Create backup script
cat > $APP_DIR/backup.sh << 'EOF'
#!/bin/bash
echo "💾 Creating backup..."

BACKUP_DIR="/var/backups/mubinyx"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
cp /var/www/mubinyx/backend/prisma/dev.db $BACKUP_DIR/database_$DATE.db

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz -C /var/www/mubinyx/backend uploads

echo "✅ Backup created: $BACKUP_DIR"
EOF

chmod +x $APP_DIR/backup.sh

# Create systemd service for PM2
print_step "20. Setting up systemd service..."
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME

# Setup firewall
print_step "21. Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Final status check
print_step "22. Checking application status..."
sleep 5

pm2 status
sudo systemctl status nginx --no-pager -l

print_status "============================================"
print_status "🎉 Mubinyx deployment completed!"
print_status "============================================"
print_status ""
print_status "📋 Next Steps:"
print_status "1. Update domain name in Nginx config: /etc/nginx/sites-available/mubinyx"
print_status "2. Update environment files with your actual values:"
print_status "   - $APP_DIR/backend/.env"
print_status "   - $APP_DIR/frontend/.env.local"
print_status "3. Setup SSL certificate:"
print_status "   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com"
print_status "4. Test your application:"
print_status "   - Frontend: http://your-server-ip"
print_status "   - Backend API: http://your-server-ip/api"
print_status ""
print_status "🔧 Management Commands:"
print_status "- Update app: $APP_DIR/update.sh"
print_status "- Create backup: $APP_DIR/backup.sh"
print_status "- View logs: pm2 logs"
print_status "- Restart apps: pm2 restart ecosystem.config.js"
print_status ""
print_warning "⚠️  Don't forget to:"
print_warning "- Change default JWT secret and passwords"
print_warning "- Configure your SMTP settings for emails"
print_warning "- Setup domain DNS to point to your server IP"
print_warning "- Configure SSL certificate for HTTPS"

echo ""
print_status "🚀 Deployment script completed successfully!"
EOF
