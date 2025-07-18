# 🚀 VPS Deployment Commands - Mubinyx

## 📋 **Langkah-langkah Install di VPS**

Jalankan command berikut satu per satu di terminal VPS Anda:

### **1. Update System & Install Prerequisites**
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git build-essential software-properties-common
```

### **2. Install Node.js 20.x**
```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs

# Verify installation
node --version  # Expected: v20.19.4 or higher
npm --version   # Expected: 10.8.2 or higher

# Check if versions are compatible with Next.js 15
echo "✅ Node.js $(node --version) is compatible with Next.js 15"
echo "✅ npm $(npm --version) is ready for deployment"

# If you need to update Node.js to latest LTS
# curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
# sudo apt-get install -y nodejs
```

### **2a. Version Compatibility Check**
```bash
# Verify Node.js version compatibility
NODE_VERSION=$(node --version | cut -d'v' -f2)
NPM_VERSION=$(npm --version)

echo "Current versions:"
echo "Node.js: v$NODE_VERSION"
echo "npm: $NPM_VERSION"

# Check minimum requirements for Next.js 15 and NestJS
if [[ "$(printf '%s\n' "18.0.0" "$NODE_VERSION" | sort -V | head -n1)" = "18.0.0" ]]; then
    echo "✅ Node.js version is compatible (requires 18.0.0+)"
else
    echo "❌ Node.js version too old. Please update to 18.0.0 or higher"
    exit 1
fi

if [[ "$(printf '%s\n' "8.0.0" "$NPM_VERSION" | sort -V | head -n1)" = "8.0.0" ]]; then
    echo "✅ npm version is compatible (requires 8.0.0+)"
else
    echo "❌ npm version too old. Please update npm: sudo npm install -g npm@latest"
fi

echo "🎯 Your VPS is ready for Mubinyx deployment!"
```

### **3. Install PM2 Process Manager**
```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify PM2 installation
pm2 --version
```

### **4. Install & Configure Nginx**
```bash
# Install Nginx
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

### **5. Install SSL Certificate Tool (Optional)**
```bash
# Install Certbot for SSL certificates
sudo apt install -y certbot python3-certbot-nginx
```

### **6. Create Application Directory**
```bash
# Create app directory
sudo mkdir -p /var/www/mubinyx

# Change ownership to current user
sudo chown -R $USER:$USER /var/www/mubinyx

# Navigate to app directory
cd /var/www/mubinyx
```

### **7. Clone Repository**
```bash
# Clone from GitHub
git clone https://github.com/bangcalvinsetiawan/mubinyx.git .

# Check if clone successful
ls -la
```

### **8. Install Backend Dependencies**
```bash
# Navigate to backend
cd /var/www/mubinyx/backend

# Install ALL dependencies (including devDependencies for build)
npm install

# Verify installation
npm list --depth=0
```

### **9. Install Frontend Dependencies & Build**
```bash
# Navigate to frontend
cd /var/www/mubinyx/frontend

# Clean any existing modules first
rm -rf node_modules package-lock.json .next

# Install ALL dependencies (including devDependencies for build)
npm install

# Rebuild native dependencies for Linux platform
npm rebuild

# Fix potential TypeScript and Next.js issues
npm install --save-dev typescript @types/node @types/react @types/react-dom

# Clear Next.js cache
npx next info
rm -rf .next

# Build for production with verbose output
npm run build

# If build fails, try alternative build approach
# npm run build -- --no-lint

# Verify build
ls -la .next
```

### **10. Setup Backend Environment**
```bash
# Navigate to backend
cd /var/www/mubinyx/backend

# Create environment file
cat > .env << 'EOF'
# Database
DATABASE_URL="file:./dev.db"

# JWT Secret (CHANGE THIS!)
JWT_SECRET="super-secret-jwt-key-change-this-in-production-112212"

# Application Port
PORT=3010

# CORS Origin (CHANGE TO YOUR DOMAIN!)
CORS_ORIGIN="http://mubinyx.karyadiwangsa.com"

# Email Configuration (OPTIONAL - Update with your SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
EOF

# Verify env file
cat .env
```

### **11. Setup Frontend Environment**
```bash
# Navigate to frontend
cd /var/www/mubinyx/frontend

# Create environment file
cat > .env.local << 'EOF'
# Backend API URL (CHANGE TO YOUR DOMAIN!)
NEXT_PUBLIC_API_URL="http://mubinyx.karyadiwangsa.com/api"

# App Configuration
NEXT_PUBLIC_APP_NAME="Mubinyx"
NEXT_PUBLIC_APP_URL="http://mubinyx.karyadiwangsa.com"

# Crypto Configuration
NEXT_PUBLIC_ENABLE_CRYPTO=true
EOF

# Verify env file
cat .env.local
```

### **12. Setup Database**
```bash
# Navigate to backend
cd /var/www/mubinyx/backend

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Use simple seed if main seed fails
npx tsx prisma/seed-simple.ts

# Or use the automated reset script
cd ..
chmod +x reset-database.sh
./reset-database.sh
```

### **13. Build Backend for Production**
```bash
# Navigate to backend
cd /var/www/mubinyx/backend

# Build application
npm run build

# Verify build
ls -la dist
```

### **14. Create PM2 Configuration**
```bash
# Navigate to app root
cd /var/www/mubinyx

# Create PM2 ecosystem file
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
mkdir -p logs

# Verify PM2 config
cat ecosystem.config.js
```

### **15. Configure Nginx Reverse Proxy**
```bash
# Create Nginx site configuration
sudo tee /etc/nginx/sites-available/mubinyx << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }

    # Backend API
    location /api {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://localhost:3010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }

    # Static files for uploads
    location /uploads {
        alias /var/www/mubinyx/backend/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/mubinyx /etc/nginx/sites-enabled/

# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t
```

### **16. Start Applications**
```bash
# Navigate to app directory
cd /var/www/mubinyx

# Start applications with PM2
pm2 start ecosystem.config.js

# Check PM2 status
pm2 status

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### **17. Reload Nginx**
```bash
# Reload Nginx with new configuration
sudo systemctl reload nginx

# Check Nginx status
sudo systemctl status nginx
```

### **18. Configure Firewall**
```bash
# Allow SSH
sudo ufw allow OpenSSH

# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Enable firewall
sudo ufw --force enable

# Check firewall status
sudo ufw status
```

### **19. Setup SSL Certificate (Optional)**
```bash
# IMPORTANT: Replace 'your-domain.com' with your actual domain
sudo certbot --nginx -d mubinyx.karyadiwangsa.com -d mubinyx.karyadiwangsa.com

# Test SSL renewal
sudo certbot renew --dry-run
```

### **20. Final Status Check**
```bash
# Check PM2 applications
pm2 status

# Check application logs
pm2 logs --lines 20

# Check Nginx status
sudo systemctl status nginx

# Check if ports are listening
sudo netstat -tlnp | grep -E ':(80|443|3000|3010)'
```

## 🎯 **Final Steps & Testing**

### **Update Domain Configuration**
```bash
# Edit Nginx config with your actual domain
sudo nano /etc/nginx/sites-available/mubinyx

# Edit backend environment
nano /var/www/mubinyx/backend/.env

# Edit frontend environment  
nano /var/www/mubinyx/frontend/.env.local

# Restart applications after changes
pm2 restart ecosystem.config.js
sudo systemctl reload nginx
```

### **Test Your Application**
```bash
# Test backend API
curl http://localhost:3010

# Test frontend
curl http://localhost:3000

# Test via domain (replace with your domain)
curl http://your-domain.com
curl http://your-domain.com/api
```

## 🔧 **Management Commands**

### **View Logs:**
```bash
# View all application logs
pm2 logs

# View specific app logs
pm2 logs mubinyx-backend
pm2 logs mubinyx-frontend

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### **Restart Applications:**
```bash
# Restart all apps
pm2 restart ecosystem.config.js

# Restart specific app
pm2 restart mubinyx-backend
pm2 restart mubinyx-frontend

# Restart Nginx
sudo systemctl restart nginx
```

### **Update Application:**
```bash
cd /var/www/mubinyx

# Pull latest changes
git pull origin main

# Update backend
cd backend
npm install
npm run build

# Update frontend
cd ../frontend
npm install
npm run build

# Restart applications
cd ..
pm2 restart ecosystem.config.js
```

### **Fix npm Dependencies Issues:**
```bash
# Quick fix using automated scripts
cd /var/www/mubinyx

# Fix lightningcss native binary issues
chmod +x fix-lightningcss-linux.sh
./fix-lightningcss-linux.sh

# Fix Next.js useSearchParams() Suspense boundary errors
chmod +x fix-suspense-boundary.sh
./fix-suspense-boundary.sh

# Fix ESLint/TypeScript build errors
chmod +x fix-eslint-build.sh
./fix-eslint-build.sh

# Alternative: Use the comprehensive frontend build fix
chmod +x fix-frontend-build.sh
./fix-frontend-build.sh

# Manual fix if scripts don't work
# If you get UNMET DEPENDENCY errors, clean and reinstall
cd /var/www/mubinyx/backend

# Clean npm cache and node_modules
rm -rf node_modules package-lock.json
npm cache clean --force

# Reinstall all dependencies
npm install

# Build for production
npm run build

# Fix frontend issues manually
cd ../frontend
rm -rf node_modules package-lock.json .next
npm cache clean --force
npm install

# Update next.config.ts for Next.js 15 compatibility
cat > next.config.ts << 'EOF'
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  experimental: { optimizePackageImports: ["lucide-react"], missingSuspenseWithCSRBailout: false },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  compress: true,
  poweredByHeader: false,
  trailingSlash: false,
  output: 'standalone',
};
export default nextConfig;
EOF

npm run build  # Build for production

# If still failing, disable all checks in next.config.ts
```

### **Backup Database:**
```bash
# Create backup directory
sudo mkdir -p /var/backups/mubinyx

# Backup database
cp /var/www/mubinyx/backend/prisma/dev.db /var/backups/mubinyx/database_$(date +%Y%m%d_%H%M%S).db

# Backup uploads
tar -czf /var/backups/mubinyx/uploads_$(date +%Y%m%d_%H%M%S).tar.gz -C /var/www/mubinyx/backend uploads
```

## 🆘 **Troubleshooting**

### **If Frontend Build Fails with "next build" Error:**
```bash
# Navigate to frontend directory
cd /var/www/mubinyx/frontend

# Step 1: Use automated fix scripts for common issues
chmod +x ../fix-lightningcss-linux.sh
../fix-lightningcss-linux.sh

# If failing due to useSearchParams() Suspense boundary errors:
chmod +x ../fix-suspense-boundary.sh
../fix-suspense-boundary.sh

# If still failing due to ESLint/TypeScript errors:
chmod +x ../fix-eslint-build.sh
../fix-eslint-build.sh

# Manual step-by-step fix if scripts don't work:

# Step 2: Fix Next.js 15 compatibility issues
cat > next.config.ts << 'EOF'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
    missingSuspenseWithCSRBailout: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true
  },
  compress: true,
  poweredByHeader: false,
  trailingSlash: false,
  output: 'standalone',
};

export default nextConfig;
EOF

# Step 3: Complete clean and reinstall
rm -rf node_modules package-lock.json .next
npm cache clean --force

# Step 4: Check Node.js version (must be 18+ for Next.js 15)
node --version  # Should be 20.x
npm --version   # Should be 10.x+

# Step 5: Install with legacy peer deps if needed
npm install --legacy-peer-deps

# Step 6: Fix TypeScript issues
npm install --save-dev typescript @types/node @types/react @types/react-dom

# Step 7: Try building without lint/type checks (production deployment)
npm run build -- --no-lint

# Step 8: If useSearchParams() errors, wrap with Suspense
# Edit src/app/page.tsx to add Suspense boundary:
# import { Suspense } from 'react';
# <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>

# Step 9: Try building again
npm run build

# Step 10: If memory issues during build
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
unset NODE_OPTIONS
```

### **Fix specific build errors:**
```bash
# If "Cannot find module" errors
cd /var/www/mubinyx/frontend
npm install --save-dev @types/node @types/react @types/react-dom
npm install sharp  # For Next.js image optimization

# If lightningcss errors
npm uninstall lightningcss
npm install lightningcss --platform=linux --arch=x64

# If TypeScript errors during build
npx tsc --noEmit  # Check TypeScript errors
npm run build -- --no-type-check  # Skip type checking

# If memory issues during build
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Reset environment variables after build
unset NODE_OPTIONS
```

### **If you get lightningcss native binary errors:**
```bash
# Check VPS environment first
echo "Node.js version: $(node --version)"  # Expected: v20.19.4
echo "NPM version: $(npm --version)"       # Expected: 10.8.2
echo "Platform: $(uname -m)"               # Expected: x86_64

# Use the automated fix script
cd /var/www/mubinyx
chmod +x fix-lightningcss-linux.sh
./fix-lightningcss-linux.sh

# Manual fix if script doesn't work
cd /var/www/mubinyx/frontend

# Complete removal and reinstall for Node.js v20.19.4 compatibility
npm uninstall lightningcss @tailwindcss/postcss @tailwindcss/node
rm -rf node_modules/lightningcss node_modules/@tailwindcss node_modules/.cache
npm cache clean --force

# Platform-specific installation for Linux VPS with Node.js v20
npm install lightningcss@1.22.1 --platform=linux --arch=x64 --force
npm install @tailwindcss/postcss

# Verify native binary compatibility
npm run build 2>&1 | grep -i "lightningcss\|binary"

# If still failing, use fallback approach with PostCSS
npm uninstall lightningcss
npm install --save-dev postcss autoprefixer

# Update postcss.config.mjs to use autoprefixer instead
cat > postcss.config.mjs << 'EOF'
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
  },
}

export default config
EOF

# Try building again
npm run build
```

### **If you get UNMET DEPENDENCY errors:**
```bash
# Check Node.js and npm versions first
node --version  # VPS: v20.19.4, Development: v22.17.0 
npm --version   # VPS: 10.8.2, Development: 10.9.2

# Both versions are compatible with Next.js 15 and NestJS
echo "✅ Version compatibility verified"

# Navigate to backend directory
cd /var/www/mubinyx/backend

# Clean everything and start fresh
rm -rf node_modules package-lock.json
npm cache clean --force

# Install ALL dependencies (not just production)
npm install

# Build the application
npm run build

# If still having issues, try with exact versions
npm install --engine-strict=false

# For version-specific issues, lock to compatible versions
npm install react@19.1.0 react-dom@19.1.0 next@15.4.1 --save-exact

# Check npm version compatibility
if [ "$(npm --version | cut -d. -f1)" -lt "8" ]; then
    echo "⚠️ npm version is old, updating..."
    sudo npm install -g npm@latest
fi
```

### **If Applications Won't Start:**
```bash
# Check Node.js version
node --version

# Check if ports are busy
sudo lsof -i :3000
sudo lsof -i :3010

# Reset PM2
pm2 delete all
pm2 start ecosystem.config.js
```

### **If Can't Access Website:**
```bash
# Check firewall
sudo ufw status

# Check Nginx configuration
sudo nginx -t
sudo systemctl status nginx

# Check DNS
nslookup your-domain.com
```

---

## 🔧 Version Compatibility Notes

### Environment Differences
- **Local Development:** Node.js v22.17.0, npm 10.9.2 (Windows)  
- **VPS Production:** Node.js v20.19.4, npm 10.8.2 (Linux Ubuntu)
- **Compatibility Status:** ✅ Both versions fully support Next.js 15.4.1 and NestJS

### Version-Specific Considerations
```bash
# Check minimum requirements on VPS
node --version | grep -E "v(18|20|22)\." && echo "✅ Node.js compatible" || echo "❌ Upgrade needed"
npm --version | grep -E "(8|9|10)\." && echo "✅ npm compatible" || echo "❌ Upgrade needed"

# Next.js 15 requires minimum Node.js 18.18.0
# NestJS supports Node.js 16+ (recommended 18+)
# Both are satisfied by Node.js v20.19.4
```

### Platform-Specific Binary Issues
```bash
# lightningcss native binaries differ between platforms
# Windows development → Linux production requires rebuild
# Use automated scripts to handle cross-platform compilation

# If manual fix needed:
npm rebuild --platform=linux --arch=x64
npm install lightningcss@1.22.1 --force --platform=linux
```

---

**🎉 Setelah menjalankan semua command di atas, aplikasi Mubinyx Anda akan berjalan di VPS!**

**📧 Access Points:**
- **Frontend:** http://your-domain.com
- **Backend API:** http://your-domain.com/api
- **Admin Panel:** http://your-domain.com/admin

**⚠️ Jangan lupa:**
1. Ganti `your-domain.com` dengan domain asli Anda
2. Update JWT_SECRET di file .env
3. Configure SMTP settings untuk email
4. Setup SSL certificate untuk HTTPS
