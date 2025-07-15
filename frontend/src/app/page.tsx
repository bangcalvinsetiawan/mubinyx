'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/auth'
import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'
import DashboardRouter from '@/components/DashboardRouter'

interface DashboardStats {
  totalProjects: number
  totalInvestments: string
  totalInvestors: number
  averageRoi: string
  totalInvestmentsRaw: number
}

const features = [
  {
    icon: '🚀',
    title: 'Smart Investment',
    description: 'AI-powered investment recommendations based on market analysis and risk assessment.'
  },
  {
    icon: '🔒',
    title: 'Secure Trading',
    description: 'Bank-level security with multi-layer encryption and cold storage for digital assets.'
  },
  {
    icon: '📊',
    title: 'Real-time Analytics',
    description: 'Advanced charts and market data with real-time updates and predictive insights.'
  },
  {
    icon: '💎',
    title: 'Diverse Portfolio',
    description: 'Access to stocks, crypto, commodities, and alternative investments in one platform.'
  }
]

export default function Home() {
  const searchParams = useSearchParams()
  const { isAuthenticated, user } = useAuthStore()
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats`)
        if (response.ok) {
          const stats = await response.json()
          setDashboardStats(stats)
        } else {
          console.error('Failed to fetch stats:', response.status, response.statusText)
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        // Fallback to default stats if API fails
        setDashboardStats({
          totalProjects: 0,
          totalInvestments: '$0',
          totalInvestors: 0,
          averageRoi: '0',
          totalInvestmentsRaw: 0
        })
      } finally {
        setLoading(false)
      }
    }

    // Add a small delay to ensure environment variables are loaded
    setTimeout(fetchStats, 100)
  }, [])

  // Check if login parameter is present and show auth form
  useEffect(() => {
    const showLogin = searchParams.get('login')
    if (showLogin === 'true') {
      setShowAuth(true)
      setAuthMode('login')
    }
  }, [searchParams])

  // If user is authenticated, show dashboard with navigation
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <DashboardRouter />
      </div>
    )
  }

  const handleAuthSuccess = () => {
    setShowAuth(false)
  }

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {!showAuth ? (
        // Landing Page
        <main className="flex flex-col gap-8 items-center justify-center min-h-screen p-8">
          <div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-6xl font-bold text-white mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Mubinyx
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl">
              Leading investment platform with blockchain technology and artificial intelligence
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setAuthMode('register')
                  setShowAuth(true)
                }}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
              >
                Start Investing
              </motion.button>
              
              <Link href="/investments">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-slate-800/50 border border-slate-700 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-slate-700/50 transition-all duration-300"
                >
                  View Investment Opportunities
                </motion.button>
              </Link>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setAuthMode('login')
                  setShowAuth(true)
                }}
                className="bg-slate-700/50 hover:bg-slate-700/70 text-white px-8 py-3 rounded-lg font-semibold text-lg border border-slate-600 transition-all duration-300"
              >
                Login
              </motion.button>
            </div>
          </div>

          <div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
          >
            {features.map((feature, index) => (
              <div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Dashboard Statistics */}
          {!loading && dashboardStats && (
            <div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
            >
              <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6">
                <div className="text-2xl mb-2">📈</div>
                <h3 className="text-white font-bold text-2xl">{dashboardStats.totalProjects}</h3>
                <p className="text-cyan-300 text-sm">Active Projects</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-6">
                <div className="text-2xl mb-2">💰</div>
                <h3 className="text-white font-bold text-2xl">{dashboardStats.totalInvestments}</h3>
                <p className="text-green-300 text-sm">Total Investments</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
                <div className="text-2xl mb-2">👥</div>
                <h3 className="text-white font-bold text-2xl">{dashboardStats.totalInvestors}</h3>
                <p className="text-purple-300 text-sm">Total Investors</p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
                <div className="text-2xl mb-2">🎯</div>
                <h3 className="text-white font-bold text-2xl">{dashboardStats.averageRoi}%</h3>
                <p className="text-orange-300 text-sm">Average ROI</p>
              </div>
            </div>
          )}

          
        </main>
      ) : (
        // Auth Forms
        <main className="flex items-center justify-center min-h-screen p-8">
          <div className="w-full max-w-md">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowAuth(false)}
              className="mb-6 text-slate-400 hover:text-white transition-colors flex items-center"
            >
              ← Back to Home
            </motion.button>
            
            {authMode === 'login' ? (
              <LoginForm onSuccess={handleAuthSuccess} onToggleForm={toggleAuthMode} />
            ) : (
              <RegisterForm onSuccess={handleAuthSuccess} onToggleForm={toggleAuthMode} />
            )}
          </div>
        </main>
      )}
    </div>
  )
}
