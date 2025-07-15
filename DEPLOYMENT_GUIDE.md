# 🚀 Panduan Deployment ke Hostinger

## Persiapan Sebelum Upload

### 1. Update Konfigurasi untuk Production

#### Frontend Configuration
1. Edit `frontend/next.config.ts`:
```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_API_URL: 'https://yourdomain.com/api'
  }
};

export default nextConfig;
```

2. Edit `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

#### Backend Configuration
1. Edit `backend/src/main.ts` untuk production:
```typescript
const port = process.env.PORT || 3010;
app.enableCors({
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  credentials: true,
});
```

2. Buat file `backend/.env.production`:
```
DATABASE_URL="file:./prod.db"
JWT_SECRET="your-super-secure-jwt-secret-for-production"
PORT=3010
```

## Metode 1: Upload Manual via cPanel File Manager

### Langkah 1: Build Project
```bash
# Build frontend
cd frontend
npm run build

# Install backend dependencies
cd ../backend
npm install --production
```

### Langkah 2: Siapkan File untuk Upload
1. **Frontend**: Upload folder `frontend/out` atau `frontend/.next` ke `public_html/`
2. **Backend**: Upload semua file backend ke `public_html/api/` atau subdomain terpisah

### Langkah 3: Upload ke Hostinger
1. Login ke Hostinger hPanel
2. Buka File Manager
3. Upload file:
   - Frontend → `public_html/`
   - Backend → `public_html/api/` atau subdomain
4. Extract file jika perlu

### Langkah 4: Setup Database
1. Buat database MySQL di hPanel
2. Update `DATABASE_URL` di backend
3. Run migration:
```bash
npx prisma migrate deploy
npx prisma generate
```

## Metode 2: Deploy via Git (Recommended)

### Langkah 1: Setup Git Repository
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/mubinyx.git
git push -u origin main
```

### Langkah 2: Setup di Hostinger
1. Login ke hPanel
2. Buka Git Version Control
3. Klik "Create New Repository"
4. Masukkan Git URL repository
5. Set deployment path:
   - Frontend: `public_html/`
   - Backend: `public_html/api/`

### Langkah 3: Auto Deploy
1. Setup webhook di GitHub/GitLab
2. Setiap push akan auto deploy

## Metode 3: FTP Upload

### Menggunakan FileZilla atau FTP Client
```
Host: ftp.yourdomain.com
Username: your-ftp-username
Password: your-ftp-password
Port: 21
```

1. Connect ke FTP
2. Upload file:
   - Frontend → `/public_html/`
   - Backend → `/public_html/api/`

## Konfigurasi Database Production

### 1. MySQL Database (Recommended untuk Production)
```bash
# Install MySQL driver
npm install mysql2

# Update schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### 2. Environment Variables
```
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
JWT_SECRET="your-production-jwt-secret"
NODE_ENV="production"
```

## SSL dan Domain Setup

### 1. Setup SSL Certificate
- Hostinger biasanya menyediakan SSL gratis
- Aktifkan di hPanel → SSL

### 2. Domain Configuration
- Pastikan domain mengarah ke Hostinger nameservers
- Update DNS records jika perlu

## Monitoring dan Maintenance

### 1. Log Files
- Check error logs di hPanel
- Monitor aplikasi performance

### 2. Backup
- Setup automatic backup di Hostinger
- Backup database secara berkala

### 3. Updates
- Update dependencies secara berkala
- Monitor security updates

## Troubleshooting

### Common Issues:
1. **Build Error**: Check Node.js version compatibility
2. **Database Connection**: Verify DATABASE_URL
3. **CORS Error**: Update allowed origins
4. **File Permissions**: Set correct permissions (755 for folders, 644 for files)

### Support:
- Hostinger Support: https://support.hostinger.com
- Documentation: Check Hostinger knowledge base
