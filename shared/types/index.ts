export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum UserStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  SUSPENDED = 'SUSPENDED'
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  INVESTMENT = 'INVESTMENT',
  RETURN = 'RETURN',
  COMMISSION = 'COMMISSION'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export enum ProjectStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  FUNDED = 'FUNDED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: UserRole
  status: UserStatus
  referralCode: string
  referredBy?: string
  emailVerified: boolean
  twoFactorEnabled: boolean
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  categoryId: string
  name: string
  slug: string
  description: string
  imageUrl?: string
  minInvestment: number
  maxInvestment: number
  targetAmount: number
  collectedAmount: number
  roiPercentage: number
  durationMonths: number
  startDate?: string
  endDate?: string
  status: ProjectStatus
  riskLevel: string
  riskAnalysis?: any
  financialData?: any
  documents: any[]
  createdAt: string
  updatedAt: string
}

export interface Investment {
  id: string
  userId: string
  projectId: string
  amount: number
  expectedReturn: number
  startDate: string
  maturityDate: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  userId: string
  code: string
  type: TransactionType
  amount: number
  status: TransactionStatus
  createdAt: string
  updatedAt: string
}

export interface Wallet {
  id: string
  userId: string
  balance: number
  lockedBalance: number
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
