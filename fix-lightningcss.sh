#!/bin/bash

# 🔧 Fix LightningCSS Native Binary Error for Mubinyx VPS Deployment
# This script specifically fixes the lightningcss.linux-x64-gnu.node error

echo "🚀 Fixing LightningCSS native binary error..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if we're in frontend directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the frontend directory!"
    print_error "Expected: /var/www/mubinyx/frontend/"
    exit 1
fi

print_status "Found package.json ✓"

# Check if this is a Next.js project
if ! grep -q "next" package.json; then
    print_error "This doesn't seem to be a Next.js project!"
    exit 1
fi

print_status "Confirmed Next.js project ✓"

# Step 1: Clean everything
print_status "🧹 Cleaning frontend cache and modules..."
rm -rf node_modules package-lock.json .next
npm cache clean --force

print_status "Cache and modules cleaned ✓"

# Step 2: Install dependencies
print_status "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies ✗"
    exit 1
fi

print_status "Dependencies installed ✓"

# Step 3: Rebuild native dependencies
print_status "🔨 Rebuilding native dependencies for Linux platform..."

# Try to rebuild lightningcss specifically
print_status "Rebuilding lightningcss..."
npm rebuild lightningcss

if [ $? -ne 0 ]; then
    print_warning "Standard rebuild failed, trying alternative approach..."
    
    # Alternative: Remove and reinstall
    print_status "Removing and reinstalling lightningcss..."
    npm uninstall lightningcss
    npm install lightningcss
    
    if [ $? -ne 0 ]; then
        print_error "Failed to reinstall lightningcss ✗"
        
        # Last resort: Try different version
        print_warning "Trying with specific lightningcss version..."
        npm install lightningcss@1.21.0
    fi
fi

# Try to rebuild @tailwindcss/postcss
print_status "Rebuilding @tailwindcss/postcss..."
npm rebuild @tailwindcss/postcss

if [ $? -ne 0 ]; then
    print_warning "TailwindCSS PostCSS rebuild failed, trying alternative..."
    npm uninstall @tailwindcss/postcss
    npm install @tailwindcss/postcss
fi

# Step 4: Try building
print_status "🏗️ Building frontend..."
npm run build

if [ $? -eq 0 ]; then
    print_status "🎉 Frontend build successful! ✓"
    print_status "Build artifacts created in .next directory"
    ls -la .next
else
    print_error "Build failed ✗"
    print_error "Checking for common issues..."
    
    # Check Node.js version
    NODE_VERSION=$(node --version)
    print_status "Node.js version: $NODE_VERSION"
    
    # Check if the binary exists
    if [ -f "node_modules/lightningcss/lightningcss.linux-x64-gnu.node" ]; then
        print_status "LightningCSS binary found ✓"
    else
        print_error "LightningCSS binary not found ✗"
        print_status "Available lightningcss files:"
        find node_modules/lightningcss -name "*.node" 2>/dev/null || echo "No .node files found"
    fi
    
    # Suggest manual intervention
    print_warning "Try these manual steps:"
    print_warning "1. cd /var/www/mubinyx/frontend"
    print_warning "2. npm uninstall lightningcss @tailwindcss/postcss"
    print_warning "3. npm install --platform=linux --arch=x64 lightningcss"
    print_warning "4. npm install @tailwindcss/postcss"
    print_warning "5. npm run build"
    
    exit 1
fi

print_status "🚀 LightningCSS fix completed successfully!"
