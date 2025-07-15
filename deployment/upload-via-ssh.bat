@echo off
REM 🚀 Upload Mubinyx to Hostinger via SSH
REM Make sure you're already connected to SSH terminal

echo === MUBINYX SSH UPLOAD SCRIPT ===
echo.

REM Check if we're in the right directory
if not exist "frontend-build" (
    echo ❌ Error: frontend-build folder not found!
    echo Please run this script from the deployment folder
    pause
    exit /b 1
)

if not exist "backend-build" (
    echo ❌ Error: backend-build folder not found!
    echo Please run this script from the deployment folder
    pause
    exit /b 1
)

echo ✅ Found deployment files
echo.

echo 📋 This script will help you upload files via SSH
echo.
echo 📝 Manual SSH Commands to Run:
echo.
echo 1️⃣ Create directories:
echo mkdir -p public_html/api
echo.

echo 2️⃣ Upload frontend files:
echo scp -r frontend-build/* username@server:/home/username/public_html/
echo.

echo 3️⃣ Upload backend files:
echo scp -r backend-build/* username@server:/home/username/public_html/api/
echo.

echo 4️⃣ Upload configuration files:
echo scp .htaccess username@server:/home/username/public_html/
echo scp .env.production username@server:/home/username/public_html/api/.env
echo.

echo 5️⃣ Set permissions:
echo ssh username@server "chmod -R 755 /home/username/public_html"
echo ssh username@server "chmod -R 644 /home/username/public_html/*.html"
echo ssh username@server "chmod -R 644 /home/username/public_html/*.js"
echo ssh username@server "chmod -R 644 /home/username/public_html/*.css"
echo.

echo 6️⃣ Install backend dependencies:
echo ssh username@server "cd /home/username/public_html/api && npm install --production"
echo.

echo 7️⃣ Setup database:
echo ssh username@server "cd /home/username/public_html/api && npx prisma generate"
echo ssh username@server "cd /home/username/public_html/api && npx prisma migrate deploy"
echo.

echo ⚠️  IMPORTANT: Replace 'username' and 'server' with your actual Hostinger details!
echo.

echo 🔍 Want to run interactive upload? Press any key...
pause

echo.
echo 🚀 Starting interactive upload process...
echo.

REM Interactive upload
set /p HOST="Enter your Hostinger server (e.g., srv123.hostinger.com): "
set /p USERNAME="Enter your username: "

echo.
echo 📤 Uploading to %HOST% as %USERNAME%...
echo.

echo 1️⃣ Creating directories...
ssh %USERNAME%@%HOST% "mkdir -p public_html/api"

echo 2️⃣ Uploading frontend files...
scp -r frontend-build/* %USERNAME%@%HOST%:public_html/

echo 3️⃣ Uploading backend files...
scp -r backend-build/* %USERNAME%@%HOST%:public_html/api/

echo 4️⃣ Uploading configuration...
scp .htaccess %USERNAME%@%HOST%:public_html/
scp .env.production %USERNAME%@%HOST%:public_html/api/.env

echo 5️⃣ Setting permissions...
ssh %USERNAME%@%HOST% "chmod -R 755 public_html && chmod -R 644 public_html/*.html public_html/*.js public_html/*.css"

echo 6️⃣ Installing dependencies...
ssh %USERNAME%@%HOST% "cd public_html/api && npm install --production"

echo 7️⃣ Setting up database...
ssh %USERNAME%@%HOST% "cd public_html/api && npx prisma generate && npx prisma migrate deploy"

echo.
echo ✅ Upload completed!
echo.
echo 🌐 Your website should be available at: https://yourdomain.com
echo 📊 API should be available at: https://yourdomain.com/api
echo.
echo 📝 Next steps:
echo 1. Update .env file with correct database URL
echo 2. Test your website
echo 3. Run monitor.bat to check status
echo.

pause