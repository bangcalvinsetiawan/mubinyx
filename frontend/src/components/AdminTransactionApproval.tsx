'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/auth'
import Navigation from './Navigation'

interface PendingTransaction {
  id: string
  user?: {
    id: string
    email: string
    firstName: string
    lastName: string
  }
  type: string
  amount: number
  amountFormatted: string
  status: string
  description: string
  metadata: any
  createdAt: string
}

interface DashboardStats {
  totalProjects: number
  totalInvestments: string
  totalInvestors: number
  averageROI: string
  pendingTransactions: number
  totalTransactionVolume: string
}

export default function AdminTransactionApproval() {
  const { token, user } = useAuthStore()
  const [pendingTransactions, setPendingTransactions] = useState<PendingTransaction[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    if (token && (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN')) {
      fetchPendingTransactions()
      fetchStats()
    }
  }, [token, user])

  const fetchPendingTransactions = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet/admin/pending-transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setPendingTransactions(data)
      }
    } catch (error) {
      console.error('Error fetching pending transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/public-stats`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleApproveTransaction = async (transactionId: string) => {
    setProcessingId(transactionId)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet/admin/approve/${transactionId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        alert(result.message)
        fetchPendingTransactions()
        fetchStats()
      }
    } catch (error) {
      console.error('Error approving transaction:', error)
      alert('Error approving transaction')
    } finally {
      setProcessingId(null)
    }
  }

  const handleRejectTransaction = async (transactionId: string) => {
    const reason = prompt('Enter rejection reason:')
    if (!reason) return

    setProcessingId(transactionId)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet/admin/reject/${transactionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      })

      if (response.ok) {
        const result = await response.json()
        alert(result.message)
        fetchPendingTransactions()
        fetchStats()
      }
    } catch (error) {
      console.error('Error rejecting transaction:', error)
      alert('Error rejecting transaction')
    } finally {
      setProcessingId(null)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return '💳'
      case 'WITHDRAWAL': return '💸'
      default: return '💰'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return 'text-green-400 bg-green-400/20'
      case 'WITHDRAWAL': return 'text-red-400 bg-red-400/20'
      default: return 'text-blue-400 bg-blue-400/20'
    }
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Access Denied: Admin privileges required</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading admin dashboard...</div>
      </div>
    )
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
          <div className="text-slate-300">
            Welcome, {user.firstName} {user.lastName} ({user.role})
          </div>
        </div>

        {/* Dashboard Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
            >
              <h3 className="text-sm font-medium text-slate-400 mb-2">Total Projects</h3>
              <p className="text-2xl font-bold text-cyan-400">{stats.totalProjects}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
            >
              <h3 className="text-sm font-medium text-slate-400 mb-2">Total Investments</h3>
              <p className="text-2xl font-bold text-green-400">{stats.totalInvestments}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
            >
              <h3 className="text-sm font-medium text-slate-400 mb-2">Total Investors</h3>
              <p className="text-2xl font-bold text-blue-400">{stats.totalInvestors}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
            >
              <h3 className="text-sm font-medium text-slate-400 mb-2">Average ROI</h3>
              <p className="text-2xl font-bold text-purple-400">{stats.averageROI}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
            >
              <h3 className="text-sm font-medium text-slate-400 mb-2">Pending Approvals</h3>
              <p className="text-2xl font-bold text-yellow-400">{pendingTransactions.length}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
            >
              <h3 className="text-sm font-medium text-slate-400 mb-2">Transaction Volume</h3>
              <p className="text-2xl font-bold text-emerald-400">{stats.totalTransactionVolume || '$0'}</p>
            </motion.div>
          </div>
        )}

        {/* Pending Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Pending Transaction Approvals</h2>
            <button
              onClick={fetchPendingTransactions}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
            >
              🔄 Refresh
            </button>
          </div>

          {pendingTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-white mb-2">No Pending Transactions</h3>
              <p className="text-slate-400">All transactions have been processed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingTransactions.map((transaction) => (
                <div key={transaction.id} className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">
                        {getTypeIcon(transaction.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{transaction.description}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                            {transaction.type}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-slate-400">User:</p>
                            <p className="text-white font-medium">
                              {transaction.user?.firstName || 'Unknown'} {transaction.user?.lastName || 'User'}
                            </p>
                            <p className="text-slate-400">{transaction.user?.email || 'No email'}</p>
                          </div>
                          
                          <div>
                            <p className="text-slate-400">Amount:</p>
                            <p className="text-2xl font-bold text-white">{transaction.amountFormatted}</p>
                          </div>
                          
                          <div>
                            <p className="text-slate-400">Requested:</p>
                            <p className="text-white">{new Date(transaction.createdAt).toLocaleString()}</p>
                          </div>
                          
                          {transaction.metadata && (
                            <div>
                              <p className="text-slate-400">Details:</p>
                              <div className="text-white">
                                {transaction.metadata.paymentMethod && (
                                  <p>Payment: {transaction.metadata.paymentMethod}</p>
                                )}
                                {transaction.metadata.paymentReference && (
                                  <p>Reference: {transaction.metadata.paymentReference}</p>
                                )}
                                {transaction.metadata.withdrawMethod && (
                                  <p>Method: {transaction.metadata.withdrawMethod}</p>
                                )}
                                {transaction.metadata.accountDetails && (
                                  <p className="text-xs bg-slate-800 p-2 rounded mt-1">
                                    {transaction.metadata.accountDetails}
                                  </p>
                                )}
                                {transaction.metadata.notes && (
                                  <p className="text-slate-300 italic mt-1">"{transaction.metadata.notes}"</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 ml-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleApproveTransaction(transaction.id)}
                        disabled={processingId === transaction.id}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50"
                      >
                        {processingId === transaction.id ? '⏳' : '✅'} Approve
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRejectTransaction(transaction.id)}
                        disabled={processingId === transaction.id}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50"
                      >
                        {processingId === transaction.id ? '⏳' : '❌'} Reject
                      </motion.button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
        </div>
      </div>
    </>
  )
}
