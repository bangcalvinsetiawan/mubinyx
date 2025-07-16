#!/bin/bash

# 🔧 Fix Dependencies Script for Mubinyx VPS Deployment
# This script fixes common dependency issues during deployment

echo "🚀 Starting dependency fix for Mubinyx..."

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

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the root of your mubinyx project!"
    print_error "Expected directory structure: /var/www/mubinyx/"
    exit 1
fi

print_status "Found backend and frontend directories ✓"

# Fix Backend Dependencies
print_status "🔧 Fixing backend dependencies..."
cd backend

# Clean everything
print_status "Cleaning backend cache and modules..."
rm -rf node_modules package-lock.json
npm cache clean --force

# Install all dependencies
print_status "Installing all backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_status "Backend dependencies installed successfully ✓"
else
    print_error "Failed to install backend dependencies ✗"
    exit 1
fi

# Build backend
print_status "Building backend..."
npm run build

if [ $? -eq 0 ]; then
    print_status "Backend build successful ✓"
else
    print_error "Backend build failed ✗"
    exit 1
fi

# Go back to root
cd ..

# Fix Frontend Dependencies
print_status "🔧 Fixing frontend dependencies..."
cd frontend

# Clean everything
print_status "Cleaning frontend cache and modules..."
rm -rf node_modules package-lock.json .next
npm cache clean --force

# Install all dependencies
print_status "Installing all frontend dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_status "Frontend dependencies installed successfully ✓"
else
    print_error "Failed to install frontend dependencies ✗"
    exit 1
fi

# Build frontend
print_status "Building frontend..."
npm run build

if [ $? -eq 0 ]; then
    print_status "Frontend build successful ✓"
else
    print_error "Frontend build failed ✗"
    exit 1
fi

# Go back to root
cd ..

print_status "🎉 All dependencies fixed and builds completed successfully!"
print_status "You can now start the applications with PM2:"
print_status "pm2 start ecosystem.config.js"

# Check if PM2 ecosystem file exists
if [ -f "ecosystem.config.js" ]; then
    print_status "PM2 ecosystem file found ✓"
    print_warning "Restarting PM2 applications..."
    pm2 restart ecosystem.config.js 2>/dev/null || pm2 start ecosystem.config.js
    
    print_status "Checking PM2 status..."
    pm2 status
else
    print_warning "PM2 ecosystem file not found. Please create it first."
fi

print_status "🚀 Deployment fix completed!"
