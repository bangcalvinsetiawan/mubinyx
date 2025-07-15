# 🚀 QUICK START GUIDE - Upload ke Hostinger

## Langkah 1: Upload Files

### Via File Manager (Recommended)
1. Login ke Hostinger hPanel
2. Buka **File Manager**
3. Upload dan extract file dari folder `deployment/`
4. Pindahkan isi `frontend-build/` ke `public_html/`
5. Pindahkan isi `backend-build/` ke `public_html/api/`

### Via FTP
```
Host: ftp.yourdomain.com
User: cpanel_username
Pass: cpanel_password
Port: 21
```

## Langkah 2: Setup Database

### Buat Database MySQL
1. Di hPanel, buka **MySQL Databases**
2. Buat database baru: `username_mubinyx`
3. Buat user database dengan password yang kuat
4. Assign user ke database dengan ALL PRIVILEGES

### Update Environment Variables
Edit file `api/.env`:
```env
DATABASE_URL="mysql://db_username:db_password@localhost:3306/db_name"
JWT_SECRET="your-32-character-secure-secret-key"
NODE_ENV="production"
```

## Langkah 3: Install Dependencies

### Via SSH (jika tersedia)
```bash
cd public_html/api
npm install --production
npm run build
```

### Via Terminal di hPanel
1. Buka **Terminal** di hPanel
2. Jalankan:
```bash
cd public_html/api
npm install --production
npx prisma generate
npx prisma migrate deploy
```

## Langkah 4: Setup Web Server

### File .htaccess untuk Frontend (public_html/.htaccess)
```apache
RewriteEngine On

# Handle Next.js static files
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]

# API routing
RewriteRule ^api/(.*)$ /api/index.js [L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
```

### Package.json untuk Backend API
```json
{
  "scripts": {
    "start": "node dist/main.js",
    "build": "nest build",
    "prod": "npm run build && npm run start"
  }
}
```

## Langkah 5: Test Deployment

1. Buka `https://yourdomain.com` - harus load frontend
2. Test API: `https://yourdomain.com/api/health`
3. Check database connection

## Troubleshooting

### Common Issues:

**Build Error:**
```bash
rm -rf node_modules
npm install
npm run build
```

**Database Connection:**
- Check DATABASE_URL format
- Verify database credentials
- Ensure MySQL service is running

**File Permissions:**
```bash
chmod 755 public_html/
chmod 644 public_html/api/.env
```

**Memory Issues:**
- Use `npm install --production`
- Clear cache: `npm cache clean --force`

### Support Contacts:
- Hostinger: https://support.hostinger.com
- Live Chat: Available 24/7
