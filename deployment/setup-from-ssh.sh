#!/bin/bash

# 🚀 Setup Mubinyx Langsung di SSH Server

echo "=== SETUP MUBINYX DI SERVER ==="

# 1. Buat struktur direktori
echo "📁 Membuat struktur direktori..."
mkdir -p public_html/api
mkdir -p public_html/uploads
mkdir -p public_html/uploads/kyc

# 2. Setup Backend
echo "⚙️ Setup Backend..."
cd public_html/api

# Initialize Node.js project
npm init -y

# Install dependencies
echo "📦 Installing dependencies..."
npm install express @nestjs/core @nestjs/common @nestjs/platform-express
npm install @prisma/client prisma bcryptjs jsonwebtoken
npm install @nestjs/jwt @nestjs/passport passport passport-local passport-jwt
npm install multer @types/multer class-validator class-transformer

# 3. Create main application file
echo "📝 Creating main.js..."
cat > main.js << 'EOF'
const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static('../'));

// Basic routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/api', (req, res) => {
    res.json({ message: 'Mubinyx API is running!', version: '1.0.0' });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
EOF

# 4. Create package.json for production
echo "📦 Creating package.json..."
cat > package.json << 'EOF'
{
  "name": "mubinyx-api",
  "version": "1.0.0",
  "description": "Mubinyx Investment Platform API",
  "main": "main.js",
  "scripts": {
    "start": "node main.js",
    "dev": "node main.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "@nestjs/core": "^10.0.0",
    "@nestjs/common": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0"
  }
}
EOF

# 5. Create environment file
echo "🔧 Creating .env..."
cat > .env << 'EOF'
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
DATABASE_URL=mysql://u503002510_mubinyx:YOUR_PASSWORD@localhost:3306/u503002510_mubinyx
EOF

# 6. Setup Frontend
echo "🎨 Setup Frontend..."
cd ../

# Create basic HTML
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mubinyx Investment Platform</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; text-align: center; }
        .status { padding: 15px; background: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; margin: 20px 0; }
        .btn { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
        .btn:hover { background: #0056b3; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Mubinyx Investment Platform</h1>
        <div class="status">
            <strong>✅ Deployment Successful!</strong><br>
            Website is now running on Hostinger.
        </div>
        
        <h2>🔗 Quick Links:</h2>
        <ul>
            <li><a href="/api">API Status</a></li>
            <li><a href="/api/health">Health Check</a></li>
        </ul>
        
        <h2>📊 Next Steps:</h2>
        <ol>
            <li>Setup database connection</li>
            <li>Configure domain settings</li>
            <li>Upload complete frontend files</li>
            <li>Test all functionality</li>
        </ol>
        
        <button class="btn" onclick="checkAPI()">Test API Connection</button>
        
        <div id="api-result" style="margin-top: 20px;"></div>
    </div>
    
    <script>
        async function checkAPI() {
            try {
                const response = await fetch('/api');
                const data = await response.json();
                document.getElementById('api-result').innerHTML = 
                    '<div style="background: #d4edda; padding: 10px; border-radius: 5px;">' +
                    '<strong>API Response:</strong><br>' + JSON.stringify(data, null, 2) + '</div>';
            } catch (error) {
                document.getElementById('api-result').innerHTML = 
                    '<div style="background: #f8d7da; padding: 10px; border-radius: 5px;">' +
                    '<strong>Error:</strong> ' + error.message + '</div>';
            }
        }
    </script>
</body>
</html>
EOF

# 7. Create .htaccess
cat > .htaccess << 'EOF'
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
</IfModule>
EOF

# 8. Set permissions
echo "🔐 Setting permissions..."
chmod -R 755 .
chmod 644 index.html
chmod 644 .htaccess
chmod -R 755 uploads

# 9. Start the application
echo "🚀 Starting application..."
cd api
node main.js &

echo ""
echo "✅ SETUP COMPLETE!"
echo ""
echo "🌐 Your website should be available at: https://yourdomain.com"
echo "📊 API endpoint: https://yourdomain.com/api"
echo "🔍 Health check: https://yourdomain.com/api/health"
echo ""
echo "📝 Next steps:"
echo "1. Update .env file with real database credentials"
echo "2. Test the website in your browser"
echo "3. Upload complete frontend and backend files"
echo ""
