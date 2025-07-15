'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/auth'
import Navigation from './Navigation'

interface WalletData {
  id: string
  balance: number
  balanceFormatted: string
  lockedBalance: number
  lockedBalanceFormatted: string
  transactions: WalletTransaction[]
}

interface WalletTransaction {
  id: string
  type: string
  amount: number
  amountFormatted: string
  status: string
  description: string
  createdAt: string
}

export default function WalletManagement() {
  const { token } = useAuthStore()
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showTopUp, setShowTopUp] = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [topUpData, setTopUpData] = useState({
    amount: '',
    paymentMethod: 'bank_transfer',
    paymentReference: '',
    notes: ''
  })
  const [withdrawData, setWithdrawData] = useState({
    amount: '',
    withdrawMethod: 'bank_transfer',
    accountDetails: '',
    notes: ''
  })

  useEffect(() => {
    if (token) {
      fetchWalletData()
      fetchTransactions()
    }
  }, [token])

  const fetchWalletData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setWallet(data)
      }
    } catch (error) {
      console.error('Error fetching wallet:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet/transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setTransactions(data)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    }
  }

  const handleTopUp = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet/topup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(topUpData.amount),
          paymentMethod: topUpData.paymentMethod,
          paymentReference: topUpData.paymentReference,
          notes: topUpData.notes
        })
      })

      if (response.ok) {
        const result = await response.json()
        alert(result.message)
        setShowTopUp(false)
        setTopUpData({ amount: '', paymentMethod: 'bank_transfer', paymentReference: '', notes: '' })
        fetchWalletData()
        fetchTransactions()
      }
    } catch (error) {
      console.error('Error creating top up request:', error)
    }
  }

  const handleWithdraw = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(withdrawData.amount),
          withdrawMethod: withdrawData.withdrawMethod,
          accountDetails: withdrawData.accountDetails,
          notes: withdrawData.notes
        })
      })

      if (response.ok) {
        const result = await response.json()
        alert(result.message)
        setShowWithdraw(false)
        setWithdrawData({ amount: '', withdrawMethod: 'bank_transfer', accountDetails: '', notes: '' })
        fetchWalletData()
        fetchTransactions()
      }
    } catch (error) {
      console.error('Error creating withdrawal request:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-400 bg-green-400/20'
      case 'PENDING': return 'text-yellow-400 bg-yellow-400/20'
      case 'FAILED': return 'text-red-400 bg-red-400/20'
      default: return 'text-slate-400 bg-slate-400/20'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return 'text-green-400'
      case 'WITHDRAWAL': return 'text-red-400'
      case 'INVESTMENT': return 'text-blue-400'
      default: return 'text-slate-400'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading wallet...</div>
      </div>
    )
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Wallet Management</h1>

        {/* Wallet Balance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-2">Available Balance</h3>
            <p className="text-3xl font-bold text-green-400">{wallet?.balanceFormatted || '$0'}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-2">Locked Balance</h3>
            <p className="text-3xl font-bold text-orange-400">{wallet?.lockedBalanceFormatted || '$0'}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-2">Total Balance</h3>
            <p className="text-3xl font-bold text-cyan-400">
              ${((wallet?.balance || 0) + (wallet?.lockedBalance || 0)).toLocaleString()}
            </p>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTopUp(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300"
          >
            💳 Top Up Wallet
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowWithdraw(true)}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300"
          >
            💸 Withdraw
          </motion.button>
        </div>

        {/* Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6">Recent Transactions</h3>
          
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`text-2xl ${getTypeColor(tx.type)}`}>
                    {tx.type === 'DEPOSIT' ? '⬇️' : tx.type === 'WITHDRAWAL' ? '⬆️' : '💰'}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{tx.description}</p>
                    <p className="text-slate-400 text-sm">{new Date(tx.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-bold text-lg ${getTypeColor(tx.type)}`}>
                    {tx.type === 'WITHDRAWAL' ? '-' : '+'}{tx.amountFormatted}
                  </p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Up Modal */}
        {showTopUp && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold text-white mb-4">Top Up Wallet</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Amount (USD)</label>
                  <input
                    type="number"
                    value={topUpData.amount}
                    onChange={(e) => setTopUpData({...topUpData, amount: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400"
                    placeholder="Enter amount"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Payment Method</label>
                  <select
                    value={topUpData.paymentMethod}
                    onChange={(e) => setTopUpData({...topUpData, paymentMethod: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="crypto">Cryptocurrency</option>
                    <option value="paypal">PayPal</option>
                    <option value="credit_card">Credit Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Payment Reference</label>
                  <input
                    type="text"
                    value={topUpData.paymentReference}
                    onChange={(e) => setTopUpData({...topUpData, paymentReference: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400"
                    placeholder="Transaction ID or reference"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Notes (Optional)</label>
                  <textarea
                    value={topUpData.notes}
                    onChange={(e) => setTopUpData({...topUpData, notes: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400"
                    placeholder="Additional notes"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleTopUp}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300"
                >
                  Submit Request
                </button>
                <button
                  onClick={() => setShowTopUp(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Withdraw Modal */}
        {showWithdraw && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold text-white mb-4">Withdraw Funds</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Amount (USD)</label>
                  <input
                    type="number"
                    value={withdrawData.amount}
                    onChange={(e) => setWithdrawData({...withdrawData, amount: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400"
                    placeholder="Enter amount"
                    max={wallet?.balance || 0}
                  />
                  <p className="text-slate-400 text-xs mt-1">Available: {wallet?.balanceFormatted}</p>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Withdrawal Method</label>
                  <select
                    value={withdrawData.withdrawMethod}
                    onChange={(e) => setWithdrawData({...withdrawData, withdrawMethod: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="crypto">Cryptocurrency</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Account Details</label>
                  <textarea
                    value={withdrawData.accountDetails}
                    onChange={(e) => setWithdrawData({...withdrawData, accountDetails: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400"
                    placeholder="Bank account number, crypto address, etc."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Notes (Optional)</label>
                  <textarea
                    value={withdrawData.notes}
                    onChange={(e) => setWithdrawData({...withdrawData, notes: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400"
                    placeholder="Additional notes"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleWithdraw}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300"
                >
                  Submit Request
                </button>
                <button
                  onClick={() => setShowWithdraw(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
        </div>
      </div>
    </>
  )
}
