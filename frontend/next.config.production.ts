/** @type {import('next').NextConfig} */
const nextConfig = {
  // Konfigurasi untuk static export (cocok untuk shared hosting)
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  
  // Optimasi untuk hosting
  images: {
    unoptimized: true
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010'
  },
  
  // Asset prefix untuk CDN (opsional)
  // assetPrefix: process.env.NODE_ENV === 'production' ? 'https://cdn.yourdomain.com' : '',
  
  // Disable x-powered-by header
  poweredByHeader: false,
  
  // Compression
  compress: true,
  
  // Experimental features
  experimental: {
    optimizeCss: true,
  }
};

export default nextConfig;
