# 🚀 Mubinyx Investment Platform

<div align="center">
  <h3>Modern Investment Platform Built with Next.js & NestJS</h3>
  <p>A comprehensive investment management solution with KYC verification, portfolio management, and admin dashboard.</p>
  
  ![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
  ![License](https://img.shields.io/badge/license-MIT-green.svg)
  ![Status](https://img.shields.io/badge/status-production--ready-brightgreen.svg)
</div>

## ✨ Features

- 🔐 **JWT-based Authentication** - Secure user login and registration
- 📋 **KYC Verification** - Complete Know Your Customer workflow
- 💼 **Investment Portfolio** - Comprehensive investment management
- 👤 **User Profiles** - Detailed user profile management
- 📊 **Admin Dashboard** - Full administrative control panel
- 📱 **Responsive Design** - Modern UI with Tailwind CSS
- 🔒 **Security First** - Built with security best practices
- 🚀 **Production Ready** - Optimized for deployment

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.4.1** - React framework with SSR/SSG
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Performant forms with validation

### Backend
- **NestJS** - Scalable Node.js framework
- **Prisma ORM** - Type-safe database client
- **JWT Authentication** - Secure token-based auth
- **Multer** - File upload handling

### Database
- **SQLite** - Development database
- **MySQL** - Production database
- **Prisma Migrations** - Database schema management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL 13+
- Redis (optional, for caching)

### 1. Clone & Setup

```bash
# Already created in workspace
cd mubinyx
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies (already done)
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database URL and other settings

# Setup database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
# or
npm run db:migrate   # Create and run migrations

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies (already done)
npm install

# Setup environment
cp .env.local.example .env.local
# Edit .env.local with your API URL

# Start development server
npm run dev
```

## 🌟 Features

### Investment Platform
- 📊 **Project Management** - Create and manage investment projects
- 💰 **Portfolio Tracking** - Real-time investment portfolio monitoring
- 📈 **Analytics Dashboard** - Comprehensive performance metrics
- 🔄 **Transaction History** - Detailed transaction tracking

### Cryptocurrency Integration
- 💎 **Multi-Chain Support** - Ethereum, BSC, Polygon networks
- 🔐 **Secure Wallets** - Crypto wallet integration with Web3
- 💸 **Crypto Payments** - Accept investments in cryptocurrency
- ⚡ **Real-time Rates** - Live cryptocurrency exchange rates

### Security & Compliance
- 🔒 **KYC Verification** - Document verification system
- 🛡️ **2FA Authentication** - Two-factor authentication
- 👤 **Role-based Access** - User, Admin, Super Admin roles
- 📋 **Audit Trails** - Comprehensive activity logging

### User Experience
- 🎨 **Modern UI/UX** - Beautiful, responsive design
- 🌓 **Dark Theme** - Eye-friendly dark mode
- 📱 **Mobile First** - Optimized for all devices
- 🚀 **Fast Performance** - Optimized for speed

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Zustand** - Lightweight state management
- **React Query** - Server state management
- **Rainbow Kit** - Web3 wallet connection
- **Three.js** - 3D graphics and animations
- **Chart.js** - Data visualization

### Backend
- **NestJS** - Scalable Node.js framework
- **TypeScript** - Type-safe development
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Robust relational database
- **JWT** - Secure authentication
- **WebSockets** - Real-time communication
- **Bull** - Background job processing
- **Web3/Ethers** - Blockchain interaction
- **Redis** - Caching and sessions

## 📁 Project Structure

```
mubinyx/
├── frontend/                 # Next.js 14 App
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # Reusable components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities & configs
│   │   ├── services/       # API services
│   │   ├── store/          # Zustand stores
│   │   └── types/          # TypeScript types
│   └── public/             # Static assets
│
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # Users module
│   │   ├── projects/       # Investment projects
│   │   ├── crypto/         # Crypto payments
│   │   ├── wallets/        # User wallets
│   │   ├── cms/            # CMS module
│   │   └── prisma/         # Database service
│   └── prisma/             # Database schema
│
└── shared/                  # Shared types & constants
    └── types/
```

## 🔧 Development

### Available Scripts

#### Backend (`/backend`)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:migrate   # Run database migrations
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with sample data
```

#### Frontend (`/frontend`)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Environment Variables

#### Backend (`.env`)
```env
NODE_ENV=development
PORT=3001
DATABASE_URL="postgresql://user:password@localhost:5432/mubinyx"
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
REDIS_HOST=localhost
REDIS_PORT=6379
FRONTEND_URL=http://localhost:3000
```

#### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🚦 Getting Started

1. **Start Backend**: 
   ```bash
   cd backend && npm run dev
   ```
   Backend will be available at `http://localhost:3001`

2. **Start Frontend**: 
   ```bash
   cd frontend && npm run dev
   ```
   Frontend will be available at `http://localhost:3000`

3. **Open Browser**: Navigate to `http://localhost:3000`

## 🔐 Authentication Flow

1. **Registration**: Users sign up with email/password
2. **Email Verification**: Verify email address
3. **KYC Process**: Upload identity documents
4. **2FA Setup**: Configure two-factor authentication
5. **Wallet Creation**: Automatic wallet creation for users

## 💾 Database Schema

The application uses a comprehensive Prisma schema with the following main entities:

- **Users** - User accounts and authentication
- **Projects** - Investment projects and categories
- **Investments** - User investments in projects
- **Transactions** - Financial transactions
- **Wallets** - User crypto wallets
- **CryptoTransactions** - Blockchain transactions
- **Notifications** - User notifications
- **CMS** - Content management

## 🔄 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile

### Projects
- `GET /projects` - List all projects
- `GET /projects/:id` - Get project details
- `POST /projects` - Create new project (Admin)

### Investments
- `POST /investments` - Create investment
- `GET /investments/my` - Get user investments

## 🎨 UI Components

The frontend includes a comprehensive set of reusable components:

- **Forms** - Registration, login, investment forms
- **Charts** - Portfolio performance charts
- **Cards** - Project cards, investment cards
- **Modals** - Confirmation dialogs, detail modals
- **Navigation** - Header, sidebar, breadcrumbs

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔒 Security Features

- **Input Validation** - All inputs validated with class-validator
- **SQL Injection Protection** - Prisma ORM prevents SQL injection
- **XSS Protection** - Sanitized inputs and outputs
- **CSRF Protection** - Cross-site request forgery protection
- **Rate Limiting** - API rate limiting with throttler
- **Helmet** - Security headers middleware

## 🚀 Deployment

### Production Build

```bash
# Backend
cd backend
npm run build
npm run start

# Frontend
cd frontend
npm run build
npm run start
```

### Docker Deployment

```dockerfile
# Dockerfile examples would be here
```

## 📊 Monitoring & Analytics

- **Performance Monitoring** - Built-in analytics
- **Error Tracking** - Comprehensive error handling
- **User Analytics** - User behavior tracking
- **Investment Metrics** - ROI and performance tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

---

**Mubinyx** - The Future of Investment Platform 🚀
