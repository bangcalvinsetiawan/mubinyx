'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth'

export default function Navigation() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuthStore()

  const isActive = (path: string) => pathname === path

  if (!isAuthenticated) {
    return null
  }

  return (
    <nav className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-white">
              💎 Mubinyx
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-cyan-400 bg-slate-700' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                🏠 Dashboard
              </Link>
              
              <Link
                href="/investments"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/investments') 
                    ? 'text-cyan-400 bg-slate-700' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                📈 Investments
              </Link>
              
              <Link
                href="/wallet"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/wallet') 
                    ? 'text-cyan-400 bg-slate-700' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                💰 Wallet
              </Link>

              <Link
                href="/kyc"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/kyc') 
                    ? 'text-green-400 bg-slate-700' 
                    : 'text-green-300 hover:text-green-200 hover:bg-slate-700'
                }`}
              >
                📋 KYC
              </Link>

              {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                <>
                  <Link
                    href="/users"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/users') 
                        ? 'text-cyan-400 bg-slate-700' 
                        : 'text-cyan-300 hover:text-cyan-200 hover:bg-slate-700'
                    }`}
                  >
                    👥 Users
                  </Link>
                  <Link
                    href="/admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/admin') 
                        ? 'text-yellow-400 bg-slate-700' 
                        : 'text-yellow-300 hover:text-yellow-200 hover:bg-slate-700'
                    }`}
                  >
                    👑 Admin
                  </Link>
                  <Link
                    href="/analytics"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/analytics') 
                        ? 'text-purple-400 bg-slate-700' 
                        : 'text-purple-300 hover:text-purple-200 hover:bg-slate-700'
                    }`}
                  >
                    📊 Analytics
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-slate-300 text-sm">
              Welcome, {user?.name || user?.email}
            </div>
            <div className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">
              {user?.role}
            </div>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
