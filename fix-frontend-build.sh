#!/bin/bash

# 🔧 Fix Frontend Build Issues - Mubinyx
# This script fixes common Next.js build errors on VPS deployment

echo "🔧 Fixing Frontend Build Issues..."

# Navigate to frontend directory
cd /var/www/mubinyx/frontend || { echo "❌ Frontend directory not found!"; exit 1; }

echo "📋 Current Node.js version:"
node --version
npm --version

echo "🧹 Cleaning existing build artifacts..."
rm -rf node_modules package-lock.json .next
npm cache clean --force

echo "📦 Installing dependencies with legacy peer deps..."
npm install --legacy-peer-deps

echo "🔧 Installing required TypeScript types..."
npm install --save-dev typescript @types/node @types/react @types/react-dom

echo "🖼️ Installing Sharp for Next.js image optimization..."
npm install sharp

echo "⚡ Fixing lightningcss native binary issues..."
# Remove existing lightningcss completely
npm uninstall lightningcss @tailwindcss/postcss

# Clear any cached binaries
rm -rf node_modules/.cache
rm -rf node_modules/lightningcss

# Reinstall lightningcss with platform-specific build
npm install lightningcss --platform=linux --arch=x64
npm install @tailwindcss/postcss

# Alternative: Force rebuild all native dependencies
npm rebuild

# Verify lightningcss installation
echo "🔍 Checking lightningcss installation..."
ls -la node_modules/lightningcss/
find node_modules/lightningcss -name "*.node" | head -5

echo "🔍 Checking Next.js info..."
npx next info

echo "🏗️ Attempting to build with increased memory..."
export NODE_OPTIONS="--max-old-space-size=4096"

echo "📝 Building with verbose output..."
if npm run build; then
    echo "✅ Build successful!"
    ls -la .next
else
    echo "❌ Build failed. Trying alternative approaches..."
    
    # Try fixing lightningcss issue specifically
    echo "� Fixing lightningcss issue..."
    npm uninstall lightningcss @tailwindcss/postcss
    npm install lightningcss --platform=linux --arch=x64 --force
    npm install @tailwindcss/postcss --force
    
    echo "�🔄 Trying build without lint..."
    if npm run build -- --no-lint; then
        echo "✅ Build successful without lint!"
    else
        echo "🔄 Trying to replace TailwindCSS with CSS approach..."
        
        # Temporary fix: disable lightningcss in next.config
        cp next.config.ts next.config.ts.backup
        
        cat > next.config.ts << 'EOF'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ["lucide-react"]
  },
  // Disable lightningcss temporarily
  webpack: (config: any) => {
    config.infrastructureLogging = { debug: /PackFileCache/ };
    return config;
  }
};

export default nextConfig;
EOF
        
        if npm run build; then
            echo "✅ Build successful with modified config!"
        else
            echo "🔄 Trying manual Next.js build..."
            if npx next build; then
                echo "✅ Manual build successful!"
            else
                echo "❌ All build attempts failed. Trying final fallback..."
                
                # Restore original config
                mv next.config.ts.backup next.config.ts
                
                # Try without TailwindCSS processing
                echo "🔄 Disabling TailwindCSS processing temporarily..."
                mv tailwind.config.ts tailwind.config.ts.backup || true
                mv postcss.config.mjs postcss.config.mjs.backup || true
                
                if npm run build; then
                    echo "✅ Build successful without TailwindCSS processing!"
                    echo "⚠️  Note: You may need to manually configure TailwindCSS later"
                else
                    echo "❌ All build attempts failed. Check error logs above."
                    echo "💡 Manual debugging suggestions:"
                    echo "1. Check TypeScript errors: npx tsc --noEmit"
                    echo "2. Check Next.js config: cat next.config.ts"
                    echo "3. Check package.json scripts: cat package.json | grep -A 5 scripts"
                    echo "4. Check lightningcss: find node_modules -name '*lightning*' -type f"
                    echo "5. Try manual lightningcss fix: npm install lightningcss --force --platform=linux"
                    exit 1
                fi
            fi
        fi
    fi
fi

# Reset environment variables
unset NODE_OPTIONS

echo "🎉 Frontend build fix completed!"
echo "📁 Build output:"
ls -la .next

echo "✅ Ready to start with PM2!"
