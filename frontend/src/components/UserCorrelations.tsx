'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/auth'
import Navigation from './Navigation'

interface UserCorrelation {
  userId: string
  name: string
  email: string
  role: string
  status: string
  joinDate: string
  wallet: {
    balance: number
    balanceFormatted: string
    lockedBalance: number
  }
  investment: {
    totalInvested: number
    totalInvestedFormatted: string
    portfolioValue: number
    portfolioValueFormatted: string
    projectsCount: number
    activeProjects: number
  }
  activity: {
    transactionsCount: number
    referralsCount: number
  }
  projects: Array<{
    projectName: string
    category: string
    amount: number
    status: string
    roi: number
  }>
}

interface UserProfile {
  userInfo: {
    id: string
    name: string
    email: string
    role: string
    status: string
    emailVerified: boolean
    createdAt: string
    referralCode: string
  }
  walletInfo: {
    balance: number
    balanceFormatted: string
    lockedBalance: number
    lockedBalanceFormatted: string
    totalBalance: number
    totalBalanceFormatted: string
    recentTransactions: Array<{
      id: string
      type: string
      amount: number
      amountFormatted: string
      status: string
      description: string
      createdAt: string
    }>
  }
  investmentInfo: {
    totalInvested: number
    totalInvestedFormatted: string
    portfolioValue: number
    portfolioValueFormatted: string
    totalProjects: number
    activeInvestments: number
    investments: Array<any>
  }
  networkInfo: {
    referralsCount: number
    referrals: Array<any>
  }
  activityInfo: {
    unreadNotifications: number
    recentNotifications: Array<any>
    verificationStatus: string
  }
}

export default function UserCorrelations() {
  const { token, user } = useAuthStore()
  const [correlations, setCorrelations] = useState<UserCorrelation[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [view, setView] = useState<'dashboard' | 'correlations'>('dashboard')

  useEffect(() => {
    if (token) {
      fetchUserProfile()
      if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') {
        fetchCorrelations()
      }
    }
  }, [token, user])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-profile/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setUserProfile(data)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCorrelations = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-profile/correlations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setCorrelations(data)
      }
    } catch (error) {
      console.error('Error fetching correlations:', error)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'text-red-400 bg-red-400/20'
      case 'ADMIN': return 'text-yellow-400 bg-yellow-400/20'
      case 'USER': return 'text-green-400 bg-green-400/20'
      default: return 'text-slate-400 bg-slate-400/20'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'text-green-400 bg-green-400/20'
      case 'PENDING': return 'text-yellow-400 bg-yellow-400/20'
      case 'SUSPENDED': return 'text-red-400 bg-red-400/20'
      default: return 'text-slate-400 bg-slate-400/20'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading user data...</div>
      </div>
    )
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">User Analytics Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setView('dashboard')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                view === 'dashboard' 
                  ? 'bg-cyan-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              📊 My Dashboard
            </button>
            {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
              <button
                onClick={() => setView('correlations')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  view === 'correlations' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                🔗 User Correlations
              </button>
            )}
          </div>
        </div>

        {view === 'dashboard' && userProfile && (
          <div className="space-y-8">
            {/* User Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">💰 Wallet Balance</h3>
                <p className="text-3xl font-bold text-green-400">{userProfile.walletInfo.balanceFormatted}</p>
                <p className="text-slate-400 text-sm mt-2">Locked: {userProfile.walletInfo.lockedBalanceFormatted}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">📈 Total Invested</h3>
                <p className="text-3xl font-bold text-blue-400">{userProfile.investmentInfo.totalInvestedFormatted}</p>
                <p className="text-slate-400 text-sm mt-2">Projects: {userProfile.investmentInfo.totalProjects}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">💎 Portfolio Value</h3>
                <p className="text-3xl font-bold text-purple-400">{userProfile.investmentInfo.portfolioValueFormatted}</p>
                <p className="text-slate-400 text-sm mt-2">Active: {userProfile.investmentInfo.activeInvestments}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">🌐 Network</h3>
                <p className="text-3xl font-bold text-cyan-400">{userProfile.networkInfo.referralsCount}</p>
                <p className="text-slate-400 text-sm mt-2">Referrals</p>
              </motion.div>
            </div>

            {/* Recent Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6">Recent Transactions</h3>
              <div className="space-y-4">
                {userProfile.walletInfo.recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <p className="text-white font-semibold">{tx.description}</p>
                      <p className="text-slate-400 text-sm">{new Date(tx.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{tx.amountFormatted}</p>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {view === 'correlations' && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6">User Correlations Overview</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="text-slate-300 font-semibold p-3">User</th>
                      <th className="text-slate-300 font-semibold p-3">Role</th>
                      <th className="text-slate-300 font-semibold p-3">Wallet Balance</th>
                      <th className="text-slate-300 font-semibold p-3">Total Invested</th>
                      <th className="text-slate-300 font-semibold p-3">Portfolio Value</th>
                      <th className="text-slate-300 font-semibold p-3">Projects</th>
                      <th className="text-slate-300 font-semibold p-3">Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {correlations.map((correlation) => (
                      <motion.tr
                        key={correlation.userId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-slate-700 hover:bg-slate-700/30 cursor-pointer"
                        onClick={() => setSelectedUser(selectedUser === correlation.userId ? null : correlation.userId)}
                      >
                        <td className="p-3">
                          <div>
                            <p className="text-white font-semibold">{correlation.name}</p>
                            <p className="text-slate-400 text-sm">{correlation.email}</p>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getRoleColor(correlation.role)}`}>
                            {correlation.role}
                          </span>
                        </td>
                        <td className="p-3">
                          <p className="text-green-400 font-semibold">{correlation.wallet.balanceFormatted}</p>
                          {correlation.wallet.lockedBalance > 0 && (
                            <p className="text-orange-400 text-xs">Locked: ${correlation.wallet.lockedBalance.toLocaleString()}</p>
                          )}
                        </td>
                        <td className="p-3">
                          <p className="text-blue-400 font-semibold">{correlation.investment.totalInvestedFormatted}</p>
                        </td>
                        <td className="p-3">
                          <p className="text-purple-400 font-semibold">{correlation.investment.portfolioValueFormatted}</p>
                        </td>
                        <td className="p-3">
                          <p className="text-white">{correlation.investment.projectsCount} total</p>
                          <p className="text-green-400 text-sm">{correlation.investment.activeProjects} active</p>
                        </td>
                        <td className="p-3">
                          <p className="text-white">{correlation.activity.transactionsCount} txns</p>
                          <p className="text-cyan-400 text-sm">{correlation.activity.referralsCount} refs</p>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Detailed User Info */}
            {selectedUser && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
              >
                {(() => {
                  const user = correlations.find(c => c.userId === selectedUser);
                  if (!user) return null;
                  
                  return (
                    <div>
                      <h4 className="text-lg font-bold text-white mb-4">📊 {user.name} - Detailed Projects</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {user.projects.map((project, index) => (
                          <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                            <h5 className="text-white font-semibold">{project.projectName}</h5>
                            <p className="text-slate-400 text-sm">{project.category}</p>
                            <div className="mt-2">
                              <p className="text-green-400">${project.amount.toLocaleString()}</p>
                              <p className="text-purple-400 text-sm">ROI: {project.roi}%</p>
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                                {project.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </div>
        )}
        </div>
      </div>
    </>
  )
}
