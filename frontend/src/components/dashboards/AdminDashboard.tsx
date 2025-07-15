import { useState } from 'react'
// import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/auth'

export default function AdminDashboard() {
  const { user, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState('overview')

  const pendingUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', submitDate: '2025-07-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', submitDate: '2025-07-14' },
  ]

  const pendingTransactions = [
    { id: 1, user: 'Alice Johnson', type: 'Deposit', amount: 50000000, date: '2025-07-15' },
    { id: 2, user: 'Bob Wilson', type: 'Withdrawal', amount: 25000000, date: '2025-07-15' },
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'Verifikasi User', icon: '👥' },
    { id: 'transactions', label: 'Transaksi', icon: '💰' },
    { id: 'reports', label: 'Laporan', icon: '📈' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Mubinyx Admin
              </h1>
              {/* <span className="ml-4 text-slate-400">Dashboard</span> */}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-medium">{user?.name}</p>
                <p className="text-amber-400 text-sm">Admin</p>
              </div>
              <button
                onClick={logout}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1 rounded-lg text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-slate-800/30 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'User Pending', value: '12', color: 'text-yellow-400' },
                { label: 'Transaksi Pending', value: '8', color: 'text-amber-400' },
                { label: 'Total User Aktif', value: '1,245', color: 'text-green-400' },
                { label: 'Volume Hari Ini', value: 'Rp 2.5M', color: 'text-blue-400' },
              ].map((stat, index) => (
                <div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
                >
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                  <p className={`text-2xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Verifikasi User', icon: '✅' },
                  { label: 'Review Transaksi', icon: '💳' },
                  { label: 'Generate Report', icon: '📊' },
                  { label: 'Send Notification', icon: '📢' },
                ].map((action, index) => (
                  <button
                    key={index}
                    className="flex flex-col items-center p-4 bg-slate-700/50 hover:bg-slate-700/70 rounded-lg transition-colors"
                  >
                    <span className="text-2xl mb-2">{action.icon}</span>
                    <span className="text-white text-sm">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white">User Verification</h2>
            
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Pending Verifications</h3>
              
              <div className="space-y-4">
                {pendingUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex justify-between items-center p-4 bg-slate-700/30 rounded-lg"
                  >
                    <div>
                      <h4 className="text-white font-medium">{user.name}</h4>
                      <p className="text-slate-400 text-sm">{user.email}</p>
                      <p className="text-slate-500 text-xs">Submitted: {user.submitDate}</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-lg text-sm transition-colors">
                        ✅ Approve
                      </button>
                      <button className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm transition-colors">
                        ❌ Reject
                      </button>
                      <button className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2 rounded-lg text-sm transition-colors">
                        👁️ Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white">Transaction Management</h2>
            
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Pending Transactions</h3>
              
              <div className="space-y-4">
                {pendingTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex justify-between items-center p-4 bg-slate-700/30 rounded-lg"
                  >
                    <div>
                      <h4 className="text-white font-medium">{tx.user}</h4>
                      <p className="text-slate-400 text-sm">{tx.type}</p>
                      <p className="text-slate-500 text-xs">{tx.date}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-white font-semibold">
                        Rp {tx.amount.toLocaleString('id-ID')}
                      </p>
                      <div className="flex space-x-2 mt-2">
                        <button className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-1 rounded text-xs transition-colors">
                          Approve
                        </button>
                        <button className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1 rounded text-xs transition-colors">
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white">Reports & Analytics</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Daily Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">New Users</span>
                    <span className="text-white font-medium">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Deposits</span>
                    <span className="text-green-400 font-medium">Rp 125M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Withdrawals</span>
                    <span className="text-red-400 font-medium">Rp 45M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Investments</span>
                    <span className="text-blue-400 font-medium">1,847</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">API Status</span>
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">Online</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Database</span>
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">Healthy</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Last Backup</span>
                    <span className="text-white text-sm">2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
