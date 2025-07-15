'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth'

export default function SuperAdminDashboard() {
  const { user } = useAuthStore()
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalInvestments: 0,
    totalAdmins: 0,
    totalBalance: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          console.error('No token found')
          return
        }

        const response = await fetch('http://localhost:3010/dashboard/admin-stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          setDashboardStats(data)
        } else {
          console.error('Failed to fetch admin stats:', response.statusText)
          // Fallback to hardcoded data if API fails
          setDashboardStats({
            totalUsers: 25,
            totalInvestments: 931649,
            totalAdmins: 3,
            totalBalance: 1250000
          })
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
        // Fallback to hardcoded data if API fails
        setDashboardStats({
          totalUsers: 25,
          totalInvestments: 931649,
          totalAdmins: 3,
          totalBalance: 1250000
        })
      }
    }

    fetchStats()
  }, [])

  const statsCards = [
    { title: 'Total Users', value: dashboardStats.totalUsers, color: 'bg-blue-500' },
    { title: 'Total Investments', value: `$${dashboardStats.totalInvestments.toLocaleString()}`, color: 'bg-green-500' },
    { title: 'Total Admins', value: dashboardStats.totalAdmins, color: 'bg-purple-500' },
    { title: 'Total Balance', value: `$${dashboardStats.totalBalance.toLocaleString()}`, color: 'bg-orange-500' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Super Admin Dashboard</h1>
          <p className="text-slate-300">Welcome back, {user?.name || 'Super Admin'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                <span className="text-white font-bold text-lg">{stat.title.charAt(0)}</span>
              </div>
              <h3 className="text-slate-300 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">User Management</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
                <span className="text-white font-medium">View All Users</span>
                <span className="text-slate-300 text-sm block">Manage user accounts and permissions</span>
              </button>
              <button className="w-full text-left p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
                <span className="text-white font-medium">User Analytics</span>
                <span className="text-slate-300 text-sm block">View user activity and statistics</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Investment Management</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
                <span className="text-white font-medium">View All Investments</span>
                <span className="text-slate-300 text-sm block">Monitor all investment activities</span>
              </button>
              <button className="w-full text-left p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
                <span className="text-white font-medium">Investment Analytics</span>
                <span className="text-slate-300 text-sm block">Analyze investment performance</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Admin Management</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
                <span className="text-white font-medium">Manage Admins</span>
                <span className="text-slate-300 text-sm block">Add, remove, or modify admin accounts</span>
              </button>
              <button className="w-full text-left p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
                <span className="text-white font-medium">Role Permissions</span>
                <span className="text-slate-300 text-sm block">Configure admin role permissions</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">System Settings</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
                <span className="text-white font-medium">Platform Settings</span>
                <span className="text-slate-300 text-sm block">Configure global platform settings</span>
              </button>
              <button className="w-full text-left p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
                <span className="text-white font-medium">Security Settings</span>
                <span className="text-slate-300 text-sm block">Manage security and authentication</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent System Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <div>
                <span className="text-white font-medium">New user registration</span>
                <span className="text-slate-300 text-sm block">john.doe@email.com registered</span>
              </div>
              <span className="text-slate-400 text-sm">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <div>
                <span className="text-white font-medium">Investment processed</span>
                <span className="text-slate-300 text-sm block">$5,000 investment approved</span>
              </div>
              <span className="text-slate-400 text-sm">4 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <div>
                <span className="text-white font-medium">Admin action</span>
                <span className="text-slate-300 text-sm block">User permissions updated</span>
              </div>
              <span className="text-slate-400 text-sm">6 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
