@echo off
REM 🚀 Manual SSH Upload Commands for Mubinyx

echo === MANUAL SSH UPLOAD COMMANDS ===
echo.
echo Based on your SSH connection: u503002510@194.163.35.221 -p 65002
echo.

echo 📋 Copy and paste these commands in your SSH terminal:
echo.

echo 1️⃣ Create directories:
echo mkdir -p public_html/api
echo mkdir -p public_html/uploads
echo.

echo 2️⃣ Exit SSH and upload files from your local terminal:
echo.

echo scp -P 65002 -r frontend-build/* u503002510@194.163.35.221:public_html/
echo.

echo scp -P 65002 -r backend-build/* u503002510@194.163.35.221:public_html/api/
echo.

echo scp -P 65002 .htaccess u503002510@194.163.35.221:public_html/
echo.

echo scp -P 65002 .env.production u503002510@194.163.35.221:public_html/api/.env
echo.

echo 3️⃣ After upload, reconnect to SSH and run:
echo.

echo chmod -R 755 public_html
echo chmod -R 644 public_html/*.html
echo chmod -R 644 public_html/*.js
echo chmod -R 644 public_html/*.css
echo.

echo cd public_html/api
echo npm install --production
echo npx prisma generate
echo npx prisma migrate deploy
echo.

echo 4️⃣ Edit environment file:
echo nano .env
echo.

echo 📝 In the .env file, update:
echo DATABASE_URL="mysql://u503002510_mubinyx:YOUR_DB_PASSWORD@localhost:3306/u503002510_mubinyx"
echo JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"
echo NODE_ENV="production"
echo PORT=3000
echo.

echo ✅ All commands ready! Follow the steps above.
echo.

pause
