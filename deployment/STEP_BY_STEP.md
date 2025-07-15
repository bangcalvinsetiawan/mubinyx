# 📋 STEP-BY-STEP UPLOAD GUIDE

## ✅ Step 1: Sudah selesai (kamu sudah di SSH)

## 🔨 Step 2: Buat direktori di SSH
Copy paste ini di SSH terminal:
```
mkdir -p public_html/api
mkdir -p public_html/uploads
ls -la public_html/
```

## 🚪 Step 3: Exit dari SSH
Ketik di SSH terminal:
```
exit
```

## 📤 Step 4: Upload files dari Windows terminal lokal
Buka terminal baru di Windows dan navigate ke deployment folder:
```
cd "c:\Users\chemc\Downloads\Telegram Desktop\Mubinyx\deployment"
```

Kemudian jalankan upload commands satu per satu:

### Upload Frontend:
```
scp -P 65002 -r frontend-build/* u503002510@194.163.35.221:public_html/
```

### Upload Backend:
```
scp -P 65002 -r backend-build/* u503002510@194.163.35.221:public_html/api/
```

### Upload Config:
```
scp -P 65002 .htaccess u503002510@194.163.35.221:public_html/
scp -P 65002 .env.production u503002510@194.163.35.221:public_html/api/.env
```

## 🔌 Step 5: Reconnect ke SSH
```
ssh -p 65002 u503002510@194.163.35.221
```

## ⚙️ Step 6: Setup di server (di SSH)
```
chmod -R 755 public_html
cd public_html/api
npm install --production
npx prisma generate
npx prisma migrate deploy
```

## 🔧 Step 7: Edit environment
```
nano .env
```

Update dengan data database kamu:
```
DATABASE_URL="mysql://u503002510_mubinyx:YOUR_DB_PASSWORD@localhost:3306/u503002510_mubinyx"
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long"
NODE_ENV="production"
PORT=3000
```

Save: Ctrl+X, Y, Enter

## 🚀 Step 8: Test
```
node main.js
```

## 🎯 CURRENT STATUS: Kamu di Step 2
Lanjutkan dengan membuat direktori di SSH terminal kamu.
