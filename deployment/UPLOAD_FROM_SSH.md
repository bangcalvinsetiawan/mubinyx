# 🚀 UPLOAD LANGSUNG DARI SSH

## Metode 1: Upload via wget/curl (jika ada akses internet di server)

### 1️⃣ Buat direktori dulu:
```bash
mkdir -p public_html/api
mkdir -p public_html/uploads
cd public_html
```

### 2️⃣ Download files dari GitHub/Google Drive (jika sudah diupload):
Atau kita bisa menggunakan metode lain...

## Metode 2: Buat files langsung di server

### 1️⃣ Buat struktur backend:
```bash
cd public_html/api
npm init -y
npm install express @nestjs/core @nestjs/common @nestjs/platform-express @prisma/client prisma bcryptjs jsonwebtoken
```

### 2️⃣ Copy paste file utama:
```bash
nano main.js
```

## Metode 3: Upload via File Manager Hostinger

1. Login ke hPanel Hostinger
2. Buka File Manager
3. Navigate ke folder kamu
4. Upload zip file dari deployment folder

## Metode 4: Transfer files dari local dengan rsync

### Exit SSH dan dari Windows terminal:
```bash
# Sync seluruh deployment folder
rsync -avz -e "ssh -p 65002" ./frontend-build/ u503002510@194.163.35.221:public_html/
rsync -avz -e "ssh -p 65002" ./backend-build/ u503002510@194.163.35.221:public_html/api/
```

## 🎯 REKOMENDASI TERCEPAT: File Manager

Karena files sudah siap di deployment folder, cara tercepat adalah:

1. **Zip deployment folder** di Windows:
   - Right click pada folder `deployment`
   - Send to > Compressed folder
   - Rename jadi `mubinyx-deploy.zip`

2. **Upload via hPanel**:
   - Login ke Hostinger hPanel
   - File Manager
   - Upload `mubinyx-deploy.zip`
   - Extract di folder yang tepat

Mau pakai metode yang mana?
