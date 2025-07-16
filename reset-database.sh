#!/bin/bash

# 🗄️ Reset Database Script for Mubinyx VPS Deployment
# This script safely resets the database and runs seeding

echo "🚀 Resetting and seeding Mubinyx database..."

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

# Check if we're in backend directory
if [ ! -f "prisma/schema.prisma" ]; then
    print_error "Please run this script from the backend directory!"
    print_error "Expected: /var/www/mubinyx/backend/"
    exit 1
fi

print_status "Found Prisma schema ✓"

# Backup existing database if it exists
if [ -f "prisma/dev.db" ]; then
    print_warning "Backing up existing database..."
    cp prisma/dev.db "prisma/dev.db.backup.$(date +%Y%m%d_%H%M%S)"
    print_status "Database backed up ✓"
fi

# Reset database
print_status "🗄️ Resetting database..."
rm -f prisma/dev.db

# Push schema to create fresh database
print_status "📋 Creating fresh database schema..."
npx prisma db push --force-reset

if [ $? -eq 0 ]; then
    print_status "Database schema created successfully ✓"
else
    print_error "Failed to create database schema ✗"
    exit 1
fi

# Generate Prisma client
print_status "🔧 Generating Prisma client..."
npx prisma generate

if [ $? -eq 0 ]; then
    print_status "Prisma client generated successfully ✓"
else
    print_error "Failed to generate Prisma client ✗"
    exit 1
fi

# Run seeding
print_status "🌱 Seeding database with initial data..."
npx prisma db seed

if [ $? -eq 0 ]; then
    print_status "🎉 Database seeded successfully! ✓"
else
    print_warning "Seeding failed, but database is ready for manual data entry"
fi

print_status "🚀 Database reset and setup completed!"
print_status "You can now start your application."

# Show admin credentials
print_status "📧 Default Admin Credentials:"
print_status "Super Admin: superadmin@mubinyx.com / password123"
print_status "Admin: admin@mubinyx.com / password123"
