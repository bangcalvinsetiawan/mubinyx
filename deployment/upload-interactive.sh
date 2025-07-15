#!/bin/bash

# 🚀 Upload Mubinyx to Hostinger via SSH (Linux/Mac Version)

echo "=== MUBINYX SSH UPLOAD SCRIPT ==="
echo

# Check if we're in the right directory
if [[ ! -d "frontend-build" ]]; then
    echo "❌ Error: frontend-build folder not found!"
    echo "Please run this script from the deployment folder"
    exit 1
fi

if [[ ! -d "backend-build" ]]; then
    echo "❌ Error: backend-build folder not found!"
    echo "Please run this script from the deployment folder"
    exit 1
fi

echo "✅ Found deployment files"
echo

# Get Hostinger details
read -p "🏠 Enter your Hostinger server (e.g., srv123.hostinger.com): " HOST
read -p "👤 Enter your username: " USERNAME

echo
echo "📤 Uploading to $HOST as $USERNAME..."
echo

# Create directories
echo "1️⃣ Creating directories..."
ssh $USERNAME@$HOST "mkdir -p public_html/api"

# Upload frontend files
echo "2️⃣ Uploading frontend files..."
scp -r frontend-build/* $USERNAME@$HOST:public_html/

# Upload backend files
echo "3️⃣ Uploading backend files..."
scp -r backend-build/* $USERNAME@$HOST:public_html/api/

# Upload configuration
echo "4️⃣ Uploading configuration..."
scp .htaccess $USERNAME@$HOST:public_html/
scp .env.production $USERNAME@$HOST:public_html/api/.env

# Set permissions
echo "5️⃣ Setting permissions..."
ssh $USERNAME@$HOST "chmod -R 755 public_html"
ssh $USERNAME@$HOST "find public_html -name '*.html' -exec chmod 644 {} \;"
ssh $USERNAME@$HOST "find public_html -name '*.js' -exec chmod 644 {} \;"
ssh $USERNAME@$HOST "find public_html -name '*.css' -exec chmod 644 {} \;"

# Install dependencies
echo "6️⃣ Installing dependencies..."
ssh $USERNAME@$HOST "cd public_html/api && npm install --production"

# Setup database
echo "7️⃣ Setting up database..."
ssh $USERNAME@$HOST "cd public_html/api && npx prisma generate"
ssh $USERNAME@$HOST "cd public_html/api && npx prisma migrate deploy"

echo
echo "✅ Upload completed!"
echo
echo "🌐 Your website should be available at: https://yourdomain.com"
echo "📊 API should be available at: https://yourdomain.com/api"
echo

echo "📝 Next steps:"
echo "1. Update .env file with correct database URL"
echo "2. Test your website"
echo "3. Run monitor.sh to check status"
echo

echo "🔧 Manual commands reference:"
echo "ssh $USERNAME@$HOST"
echo "cd public_html/api"
echo "nano .env  # Edit environment variables"
echo "npm run start  # Start the application"
echo

read -p "Press Enter to continue..."
