# Mubinyx Investment Platform - AI Coding Assistant Instructions

## 🏗️ Architecture Overview

Mubinyx is a **full-stack investment management platform** with a **monorepo structure**:
- **Backend**: NestJS + Prisma ORM + SQLite/MySQL + JWT auth (port 3010)
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS + Zustand store (port 3000)
- **Shared**: TypeScript type definitions in `/shared/types/`

### Core Business Domains
1. **Authentication & Authorization** (`auth/`) - JWT-based with role-based access (USER/ADMIN/SUPER_ADMIN)
2. **KYC Verification** (`kyc/`) - Document upload + admin approval workflow
3. **Investment Management** (`projects/`, `investments/`) - Project creation, investment tracking, ROI calculations
4. **Wallet System** (`wallet/`) - Balance management, transactions, crypto integration
5. **User Management** (`users/`, `user-profile/`) - Profile management with referral system

## 🔧 Development Workflows

### Backend (NestJS)
```bash
# Development
cd backend && npm run dev  # Watch mode on port 3010

# Database operations
npm run db:generate      # Generate Prisma client
npm run db:push         # Push schema changes
npm run db:seed         # Seed with test data
npm run db:studio       # Open Prisma Studio

# Production build
npm run build && npm run start:prod
```

### Frontend (Next.js)
```bash
# Development
cd frontend && npm run dev  # Development server on port 3000

# Production build
npm run build && npm run start
```

### Full Application Startup
Both servers must run simultaneously. Backend serves API on `/api/*` routes via Nginx reverse proxy in production.

## 📐 Project-Specific Patterns

### Database Schema (Prisma)
- **Primary Keys**: CUID strings (`@id @default(cuid())`)
- **User Relations**: Self-referential for referral system (`User.referrals[]`)
- **Soft Deletes**: Status-based (`status: "ACTIVE" | "SUSPENDED"`)
- **Audit Fields**: `createdAt`/`updatedAt` on all entities

### Authentication Flow
```typescript
// JWT token stored in localStorage (frontend)
// Guards: JWT + Role-based decorators (backend)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
```

### API Communication
- **Client**: Axios with interceptors in `/frontend/src/lib/api.ts`
- **Auto token injection**: Request interceptor adds Bearer token
- **Auto logout**: Response interceptor handles 401 redirects

### State Management (Frontend)
- **Zustand stores** in `/frontend/src/store/`
- **Auth state**: `useAuthStore()` for user session
- **Form validation**: React Hook Form + custom validation

### File Structure Conventions
```
backend/src/
├── auth/           # JWT auth + user registration
├── kyc/            # KYC document verification
├── wallet/         # Transaction management
├── projects/       # Investment projects
├── users/          # User CRUD operations
└── prisma/         # Database service

frontend/src/
├── app/            # Next.js 15 app router pages
├── components/     # Reusable UI components
├── lib/            # Utilities (API client, etc.)
├── store/          # Zustand state management
└── types/          # Frontend-specific types
```

## 🔌 Integration Points

### Deployment Architecture
- **PM2**: Process management (`ecosystem.config.js` generated during deployment)
- **Nginx**: Reverse proxy (frontend: `/`, backend: `/api/*`)
- **Auto-deployment**: Use `/deploy-to-vps.sh` for Ubuntu/VPS deployment

### External Dependencies
- **Crypto Integration**: ethers.js for Web3 functionality
- **File Uploads**: Multer middleware for KYC documents
- **Email System**: SMTP configuration in environment variables
- **Charts**: Chart.js + react-chartjs-2 for analytics

### Environment Configuration
```typescript
// Backend: .env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
PORT=3010

// Frontend: .env.local  
NEXT_PUBLIC_API_URL="http://localhost:3010"
NEXT_PUBLIC_APP_NAME="Mubinyx"
```

## 🚨 Critical Implementation Notes

1. **CORS Configuration**: Backend allows all origins (`origin: '*'`) - modify for production
2. **File Uploads**: Static files served from `/uploads/` path in backend
3. **Role-Based Access**: Three-tier system (USER < ADMIN < SUPER_ADMIN) enforced via decorators
4. **Referral System**: Unique referral codes generated per user with tracking
5. **KYC Workflow**: Document upload → Admin review → Status update → User notification

## 📊 Database Relationships
- `User` ↔ `Wallet` (1:1)
- `User` ↔ `Investment[]` (1:many)
- `Project` ↔ `Investment[]` (1:many)
- `User` ↔ `User[]` (self-referential referrals)
- `User` ↔ `UserVerification` (1:1 for KYC)

When working on this codebase, always consider the multi-tenant nature (users/admins), the financial transaction implications, and the KYC compliance requirements.
