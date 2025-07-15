# ✅ Deployment Checklist untuk Hostinger

## Pre-Deployment

- [ ] Domain sudah mengarah ke Hostinger nameservers
- [ ] SSL Certificate sudah aktif di Hostinger
- [ ] Database MySQL sudah dibuat di hPanel
- [ ] Environment variables sudah dipersiapkan
- [ ] Backup local project sudah dibuat

## File Upload

- [ ] Upload `frontend-build/` ke `public_html/`
- [ ] Upload `backend-build/` ke `public_html/api/`
- [ ] Upload `.htaccess` untuk URL rewriting
- [ ] Set file permissions yang benar (755 untuk folder, 644 untuk file)

## Database Setup

- [ ] Database MySQL dibuat: `username_mubinyx`
- [ ] User database dibuat dengan password yang kuat
- [ ] Database URL dikonfigurasi di `.env`
- [ ] Prisma schema di-generate: `npx prisma generate`
- [ ] Database migration: `npx prisma migrate deploy`
- [ ] Seed data (opsional): `npx prisma db seed`

## Backend Configuration

- [ ] Dependencies terinstall: `npm install --production`
- [ ] TypeScript compiled: `npm run build`
- [ ] Environment variables set:
  - [ ] `DATABASE_URL`
  - [ ] `JWT_SECRET`
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=3010`
- [ ] Upload folder permissions: `chmod 755 uploads/`

## Frontend Configuration

- [ ] API URL dikonfigurasi untuk production
- [ ] Static files dapat diakses
- [ ] Routing berfungsi dengan `.htaccess`
- [ ] Images dan assets loading dengan benar

## Testing

- [ ] Homepage loading: `https://yourdomain.com`
- [ ] API health check: `https://yourdomain.com/api/health` (jika ada)
- [ ] Login/Register functionality
- [ ] Database connection working
- [ ] File upload working (jika ada)

## Security

- [ ] `.env` files tidak dapat diakses public
- [ ] Database credentials secure
- [ ] JWT secret secure (min 32 characters)
- [ ] CORS dikonfigurasi dengan benar
- [ ] Security headers aktif

## Performance

- [ ] Gzip compression enabled
- [ ] Cache headers set
- [ ] Static files optimized
- [ ] Database queries optimized

## Monitoring

- [ ] Error logging setup
- [ ] Performance monitoring
- [ ] Backup schedule configured
- [ ] Uptime monitoring (opsional)

## Post-Deployment

- [ ] Test semua functionality
- [ ] Check error logs
- [ ] Monitor performance
- [ ] Setup regular backups
- [ ] Document any custom configurations

## Troubleshooting Commands

### Check Node.js version:
```bash
node --version
npm --version
```

### Restart application:
```bash
cd public_html/api
npm run deploy
```

### Check logs:
```bash
tail -f /home/username/logs/access.log
tail -f /home/username/logs/error.log
```

### Database troubleshooting:
```bash
npx prisma studio # untuk GUI database
npx prisma db push # untuk sync schema
```

## Support Contacts

- **Hostinger Support**: https://support.hostinger.com
- **Documentation**: Check DEPLOYMENT_GUIDE.md
- **Emergency**: Use Hostinger live chat 24/7
