// Re-export all shared types
export * from '../../../shared/types'

// Frontend-specific types
export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface WalletState {
  balance: number
  lockedBalance: number
  transactions: Transaction[]
  isLoading: boolean
}

export interface ProjectsState {
  projects: Project[]
  selectedProject: Project | null
  isLoading: boolean
  filters: {
    category?: string
    riskLevel?: string
    minInvestment?: number
    maxInvestment?: number
  }
}

// Import types from shared
import type { User, Project, Transaction } from '../../../shared/types'
