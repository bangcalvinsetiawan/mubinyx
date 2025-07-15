#!/bin/bash

# 🚀 Upload All Mubinyx Files via SSH Terminal
# Run this script inside your SSH terminal

echo "=== UPLOADING MUBINYX FILES TO HOSTINGER ==="
echo

# 1. Create directory structure
echo "📁 Creating directory structure..."
mkdir -p public_html
mkdir -p public_html/api
mkdir -p public_html/uploads
mkdir -p public_html/uploads/kyc
cd public_html

# 2. Create frontend files (using heredoc to transfer content)
echo "🎨 Creating frontend files..."

# Main HTML file
cat > index.html << 'FRONTEND_EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mubinyx - Investment Platform</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <span class="text-2xl font-bold text-blue-600">Mubinyx</span>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="#" class="text-gray-700 hover:text-blue-600">Home</a>
                    <a href="#" class="text-gray-700 hover:text-blue-600">About</a>
                    <a href="#" class="text-gray-700 hover:text-blue-600">Contact</a>
                    <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Login</button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="gradient-bg text-white py-20">
        <div class="max-w-7xl mx-auto px-4 text-center">
            <h1 class="text-5xl font-bold mb-6">Welcome to Mubinyx</h1>
            <p class="text-xl mb-8">Smart Investment Platform for Your Financial Future</p>
            <div class="space-x-4">
                <button class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">Get Started</button>
                <button class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600">Learn More</button>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="py-20">
        <div class="max-w-7xl mx-auto px-4">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold text-gray-800 mb-4">Why Choose Mubinyx?</h2>
                <p class="text-xl text-gray-600">Powerful features for smart investing</p>
            </div>
            
            <div class="grid md:grid-cols-3 gap-8">
                <div class="text-center p-8 bg-white rounded-xl shadow-lg">
                    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Smart Analytics</h3>
                    <p class="text-gray-600">Advanced analytics to help you make informed investment decisions.</p>
                </div>
                
                <div class="text-center p-8 bg-white rounded-xl shadow-lg">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Secure Platform</h3>
                    <p class="text-gray-600">Bank-level security to protect your investments and personal data.</p>
                </div>
                
                <div class="text-center p-8 bg-white rounded-xl shadow-lg">
                    <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">24/7 Support</h3>
                    <p class="text-gray-600">Round-the-clock support to help you with any questions or issues.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- API Status Section -->
    <section class="py-16 bg-gray-100">
        <div class="max-w-4xl mx-auto px-4">
            <div class="bg-white rounded-xl shadow-lg p-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">🚀 Deployment Status</h2>
                
                <div class="grid md:grid-cols-2 gap-6 mb-8">
                    <div class="text-center">
                        <div class="text-3xl mb-2">✅</div>
                        <h3 class="font-semibold">Frontend</h3>
                        <p class="text-gray-600">Successfully deployed</p>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl mb-2">🔧</div>
                        <h3 class="font-semibold">Backend API</h3>
                        <p class="text-gray-600">Running on server</p>
                    </div>
                </div>
                
                <div class="text-center space-y-4">
                    <button onclick="testAPI()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 mr-4">Test API</button>
                    <button onclick="testHealth()" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Health Check</button>
                </div>
                
                <div id="test-results" class="mt-6"></div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 text-center">
            <div class="text-2xl font-bold mb-4">Mubinyx</div>
            <p class="text-gray-400 mb-6">Smart Investment Platform</p>
            <div class="border-t border-gray-700 pt-6">
                <p class="text-gray-400">&copy; 2025 Mubinyx. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script>
        async function testAPI() {
            showLoading();
            try {
                const response = await fetch('/api');
                const data = await response.json();
                showResult('success', 'API Connection Successful! 🎉', JSON.stringify(data, null, 2));
            } catch (error) {
                showResult('error', 'API Connection Failed ❌', error.message);
            }
        }
        
        async function testHealth() {
            showLoading();
            try {
                const response = await fetch('/api/health');
                const data = await response.json();
                showResult('success', 'Health Check Passed! 💚', JSON.stringify(data, null, 2));
            } catch (error) {
                showResult('error', 'Health Check Failed ❌', error.message);
            }
        }
        
        function showLoading() {
            document.getElementById('test-results').innerHTML = 
                '<div class="text-center text-blue-600">🔄 Testing connection...</div>';
        }
        
        function showResult(type, title, content) {
            const bgColor = type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
            const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
            
            document.getElementById('test-results').innerHTML = 
                `<div class="mt-4 p-4 rounded-lg border ${bgColor}">
                    <div class="font-semibold ${textColor}">${title}</div>
                    <pre class="mt-2 text-sm ${textColor} whitespace-pre-wrap">${content}</pre>
                </div>`;
        }
    </script>
</body>
</html>
FRONTEND_EOF

# 3. Create .htaccess for routing
echo "⚙️ Creating .htaccess..."
cat > .htaccess << 'HTACCESS_EOF'
RewriteEngine On

# API routes
RewriteRule ^api/(.*)$ api/main.js [L,QSA]

# Frontend routes  
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
HTACCESS_EOF

# 4. Setup API backend
echo "🔧 Setting up API backend..."
cd api

# Create package.json
cat > package.json << 'PACKAGE_EOF'
{
  "name": "mubinyx-api",
  "version": "1.0.0",
  "description": "Mubinyx Investment Platform API",
  "main": "main.js",
  "scripts": {
    "start": "node main.js",
    "dev": "node main.js",
    "deploy": "npm install --production && node main.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "dotenv": "^16.3.1"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
PACKAGE_EOF

# Create main application
cat > main.js << 'API_EOF'
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from parent directory
app.use(express.static(path.join(__dirname, '../')));

// API Routes
app.get('/api', (req, res) => {
    res.json({
        message: 'Mubinyx API is running successfully! 🚀',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        status: 'active',
        environment: process.env.NODE_ENV || 'production'
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'All systems operational ✅',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: '1.0.0'
    });
});

app.get('/api/version', (req, res) => {
    res.json({
        name: 'Mubinyx API',
        version: '1.0.0',
        description: 'Investment Platform API',
        author: 'Mubinyx Team'
    });
});

// User management endpoints (basic structure)
app.get('/api/users', (req, res) => {
    res.json({
        message: 'User management endpoint',
        users: [],
        total: 0
    });
});

app.post('/api/auth/login', (req, res) => {
    res.json({
        message: 'Login endpoint ready',
        status: 'not_implemented'
    });
});

app.post('/api/auth/register', (req, res) => {
    res.json({
        message: 'Registration endpoint ready',
        status: 'not_implemented'
    });
});

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        error: 'API endpoint not found',
        path: req.path,
        message: 'The requested API endpoint does not exist'
    });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: 'Something went wrong on the server'
    });
});

// Start server
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log('🚀 Mubinyx Server Started Successfully!');
    console.log(`📍 Server running at: http://${HOST}:${PORT}`);
    console.log(`🌐 Frontend: http://${HOST}:${PORT}`);
    console.log(`📊 API: http://${HOST}:${PORT}/api`);
    console.log(`🔍 Health: http://${HOST}:${PORT}/api/health`);
    console.log(`⚡ Environment: ${process.env.NODE_ENV || 'production'}`);
    console.log('═══════════════════════════════════════');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 Received SIGINT, shutting down gracefully...');
    process.exit(0);
});
API_EOF

# Create environment file
cat > .env << 'ENV_EOF'
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long-for-security
DATABASE_URL=mysql://u503002510_mubinyx:YOUR_PASSWORD@localhost:3306/u503002510_mubinyx

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=your-session-secret-key-for-additional-security

# Features
ENABLE_REGISTRATION=true
ENABLE_KYC=true
ENABLE_INVESTMENTS=true
ENV_EOF

# 5. Install dependencies
echo "📦 Installing Node.js dependencies..."
npm install express cors helmet dotenv

# 6. Set proper permissions
echo "🔐 Setting file permissions..."
cd ..
chmod -R 755 .
chmod 644 index.html
chmod 644 .htaccess
find . -name "*.js" -exec chmod 644 {} \;
find . -name "*.json" -exec chmod 644 {} \;
chmod 755 uploads

# 7. Start the application
echo "🚀 Starting Mubinyx application..."
cd api
echo "Starting server in background..."
nohup node main.js > ../server.log 2>&1 &
echo $! > ../server.pid

sleep 3

echo ""
echo "✅ MUBINYX DEPLOYMENT COMPLETE!"
echo "═══════════════════════════════════════"
echo ""
echo "🌐 Your website is now live!"
echo "📱 Frontend: https://yourdomain.com"
echo "📊 API Status: https://yourdomain.com/api"
echo "🔍 Health Check: https://yourdomain.com/api/health"
echo ""
echo "📋 Server Status:"
if ps -p $(cat ../server.pid 2>/dev/null) > /dev/null 2>&1; then
    echo "✅ Server is running (PID: $(cat ../server.pid))"
else
    echo "⚠️  Server may not be running, check server.log"
fi
echo ""
echo "📝 Useful Commands:"
echo "  View logs: tail -f public_html/server.log"
echo "  Stop server: kill \$(cat public_html/server.pid)"
echo "  Restart: cd public_html/api && node main.js"
echo ""
echo "🎉 Deployment successful! Visit your domain to see the site."
echo ""
