import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/auth'
import Link from 'next/link'

export default function UserDashboard() {
  const { user, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState('overview')

  const stats = [
    { label: 'Total Investment', value: '$150,000', change: '+12.5%', positive: true },
    { label: 'Monthly Profit', value: '$8,500', change: '+18.2%', positive: true },
    { label: 'Total Projects', value: '5 Projects', change: '+2', positive: true },
    { label: 'Wallet Balance', value: '$25,000', change: '-5.2%', positive: false },
  ]

  const projects = [
    { id: 1, name: 'Green Energy Project', invested: 50000, roi: 12.5, status: 'Active' },
    { id: 2, name: 'Tech Startup Fund', invested: 75000, roi: 18.2, status: 'Active' },
    { id: 3, name: 'Real Estate Portfolio', invested: 25000, roi: 8.7, status: 'Completed' },
  ]

  const transactions = [
    { id: 1, type: 'Investment', project: 'Green Energy Project', amount: 50000, date: '2024-01-15' },
    { id: 2, type: 'Profit', project: 'Tech Startup Fund', amount: 8500, date: '2024-01-10' },
    { id: 3, type: 'Withdrawal', project: 'Real Estate Portfolio', amount: 5000, date: '2024-01-05' },
  ]

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'projects', label: 'My Projects' },
    { id: 'wallet', label: 'Wallet' },
    { id: 'profile', label: 'Profile' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome back, {user?.name || 'User'}!</h1>
            <p className="text-slate-300 mt-2">Here's your investment overview</p>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/investments" 
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Explore Projects
            </Link>
            <button 
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
                >
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                  <p className={`text-sm mt-2 ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: 'Invest in New Project', desc: 'Browse available investment opportunities', action: 'Browse Projects' },
                  { title: 'Add Funds', desc: 'Top up your wallet balance', action: 'Add Funds' },
                  { title: 'Withdraw Profits', desc: 'Transfer earnings to your bank account', action: 'Withdraw' }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 hover:bg-slate-600/50 transition-colors cursor-pointer"
                  >
                    <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-300 text-sm mb-4">{item.desc}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      {item.action}
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'projects' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white">My Investment Projects</h2>
            
            <div className="grid gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                      <p className="text-slate-300">Investment: ${project.invested.toLocaleString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      project.status === 'Active' 
                        ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                        : 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-slate-400 text-sm">ROI</p>
                      <p className="text-xl font-bold text-green-400">+{project.roi}%</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Current Value</p>
                      <p className="text-xl font-bold text-white">
                        ${(project.invested * (1 + project.roi / 100)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg transition-colors">
                      View Details
                    </button>
                    <button className="bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors">
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'wallet' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white">Wallet Management</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Wallet Balance</h3>
                <p className="text-3xl font-bold text-cyan-400">$25,000</p>
                
                <div className="flex gap-3 mt-6">
                  <button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg transition-colors">
                    Add Funds
                  </button>
                  <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors">
                    Withdraw
                  </button>
                </div>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center py-2 border-b border-slate-700 last:border-b-0">
                      <div>
                        <p className="text-white font-medium">{transaction.type}</p>
                        <p className="text-slate-400 text-sm">{transaction.project}</p>
                        <p className="text-slate-500 text-xs">{transaction.date}</p>
                      </div>
                      <p className={`font-bold ${
                        transaction.type === 'Withdrawal' ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {transaction.type === 'Withdrawal' ? '-' : '+'}${transaction.amount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white">My Profile</h2>
            
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-400 text-sm mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={user?.name || ''} 
                        className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-cyan-400"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-sm mb-1">Email</label>
                      <input 
                        type="email" 
                        value={user?.email || ''} 
                        className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-cyan-400"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-sm mb-1">Phone</label>
                      <input 
                        type="tel" 
                        value="+1 (555) 123-4567" 
                        className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-cyan-400"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Investment Preferences</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-400 text-sm mb-1">Risk Tolerance</label>
                      <select className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-cyan-400">
                        <option>Moderate</option>
                        <option>Conservative</option>
                        <option>Aggressive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 text-sm mb-1">Investment Goals</label>
                      <select className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-cyan-400">
                        <option>Long-term Growth</option>
                        <option>Income Generation</option>
                        <option>Capital Preservation</option>
                      </select>
                    </div>
                    <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg transition-colors">
                      Update Preferences
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
