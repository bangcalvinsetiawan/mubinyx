@echo off
REM Mubinyx Deployment Script untuk Hostinger (Windows)
echo 🚀 Starting Mubinyx deployment preparation...

REM Create deployment directory
if not exist deployment mkdir deployment
cd deployment

echo 📁 Creating deployment structure...

REM Frontend deployment
echo 🔨 Preparing frontend...
cd ..\frontend
if not exist .next (
    echo ⚠️ No build found, copying source files...
    mkdir ..\deployment\frontend-build
    xcopy /E /I src ..\deployment\frontend-build\src
    xcopy /E /I public ..\deployment\frontend-build\public
    copy package.json ..\deployment\frontend-build\
    copy next.config.ts ..\deployment\frontend-build\
    copy tsconfig.json ..\deployment\frontend-build\
    copy tailwind.config.ts ..\deployment\frontend-build\
    copy postcss.config.mjs ..\deployment\frontend-build\
) else (
    echo 📋 Copying built frontend...
    mkdir ..\deployment\frontend-build
    xcopy /E /I .next ..\deployment\frontend-build\.next
    xcopy /E /I public ..\deployment\frontend-build\public
    copy package.json ..\deployment\frontend-build\
)

REM Backend deployment
echo 📋 Copying backend files...
cd ..\backend
mkdir ..\deployment\backend-build
xcopy /E /I src ..\deployment\backend-build\src
xcopy /E /I prisma ..\deployment\backend-build\prisma
copy package.json ..\deployment\backend-build\
copy tsconfig.json ..\deployment\backend-build\
copy nest-cli.json ..\deployment\backend-build\
if exist .env copy .env ..\deployment\backend-build\

REM Create additional files for deployment
cd ..\deployment

echo Creating deployment instructions...
echo # Mubinyx Deployment Files > README.txt
echo. >> README.txt
echo Frontend files: frontend-build/ >> README.txt
echo Backend files: backend-build/ >> README.txt
echo. >> README.txt
echo Instructions: >> README.txt
echo 1. Upload frontend-build contents to public_html/ >> README.txt
echo 2. Upload backend-build contents to public_html/api/ >> README.txt
echo 3. Install dependencies: npm install >> README.txt
echo 4. Setup database and environment variables >> README.txt
echo 5. Run: npm run build ^&^& npm start >> README.txt

echo ✅ Deployment files ready in deployment/ folder
echo.
echo 📋 Next steps:
echo 1. Compress the deployment folder
echo 2. Login to Hostinger hPanel
echo 3. Open File Manager
echo 4. Upload and extract the files
echo 5. Follow the README.txt instructions
echo.
echo 📖 For detailed instructions, see DEPLOYMENT_GUIDE.md

pause
