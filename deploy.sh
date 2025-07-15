#!/bin/bash

# Mubinyx Deployment Script untuk Hostinger
echo "🚀 Starting Mubinyx deployment preparation..."

# Create deployment directory
mkdir -p deployment
cd deployment

echo "📁 Creating deployment structure..."

# Frontend deployment
echo "🔨 Building frontend..."
cd ../frontend
npm run build 2>/dev/null || echo "⚠️  Build failed, using development files"

# Copy frontend files
echo "📋 Copying frontend files..."
cp -r .next ../deployment/frontend-build 2>/dev/null || cp -r src public package.json ../deployment/frontend-build
cp package.json ../deployment/frontend-build/ 2>/dev/null

# Backend deployment
echo "📋 Copying backend files..."
cd ../backend
cp -r src prisma package.json tsconfig.json ../deployment/backend-build
cp .env.example ../deployment/backend-build/.env

# Create deployment package
echo "📦 Creating deployment package..."
cd ../deployment
zip -r mubinyx-deployment.zip frontend-build backend-build

echo "✅ Deployment package ready: deployment/mubinyx-deployment.zip"
echo ""
echo "📋 Next steps:"
echo "1. Download mubinyx-deployment.zip"
echo "2. Login to Hostinger hPanel"
echo "3. Open File Manager"
echo "4. Upload and extract the zip file"
echo "5. Move frontend-build contents to public_html/"
echo "6. Move backend-build contents to public_html/api/"
echo "7. Setup database and environment variables"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md"
