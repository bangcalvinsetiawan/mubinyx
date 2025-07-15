'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

interface Project {
  id: string
  name: string
  slug: string
  description: string
  imageUrl?: string
  category: {
    name: string
    icon: string
  }
  minInvestment: number
  maxInvestment: number
  targetAmount: number
  collectedAmount: number
  roiPercentage: number
  durationMonths: number
  riskLevel: string
  status: string
  progressPercentage: number
  remainingAmount: number
  daysRemaining: number
  totalInvestors: number
  minInvestmentFormatted: string
  maxInvestmentFormatted: string
  targetAmountFormatted: string
  collectedAmountFormatted: string
  remainingAmountFormatted: string
}

interface ProjectsResponse {
  data: Project[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function InvestmentsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    category: '',
    riskLevel: '',
    status: 'ACTIVE'
  })

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filter.category) params.append('category', filter.category)
      if (filter.riskLevel) params.append('riskLevel', filter.riskLevel)
      if (filter.status) params.append('status', filter.status)
      params.append('limit', '20')

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects?${params}`)
      const data: ProjectsResponse = await response.json()
      setProjects(data.data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [filter])

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-400 bg-green-400/20'
      case 'medium': return 'text-yellow-400 bg-yellow-400/20'
      case 'high': return 'text-red-400 bg-red-400/20'
      default: return 'text-slate-400 bg-slate-400/20'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-400 bg-green-400/20'
      case 'FUNDED': return 'text-blue-400 bg-blue-400/20'
      case 'COMPLETED': return 'text-purple-400 bg-purple-400/20'
      default: return 'text-slate-400 bg-slate-400/20'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading investments...</div>
      </div>
    )
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          {/* Back to Home Button */}
          <div className="mb-6">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors duration-300 group"
            >
              <svg 
                className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            Investment Opportunities
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Explore various investment opportunities with attractive returns and measured risks
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4 mb-8 justify-center"
        >
          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500"
          >
            <option value="">All Categories</option>
            <option value="technology">Technology</option>
            <option value="cryptocurrency">Cryptocurrency</option>
            <option value="real-estate">Real Estate</option>
          </select>

          <select
            value={filter.riskLevel}
            onChange={(e) => setFilter({ ...filter, riskLevel: e.target.value })}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500"
          >
            <option value="">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
          </select>

          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="FUNDED">Funded</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden hover:border-cyan-500 transition-all duration-300 hover:scale-105"
            >
              {/* Project Image */}
              {project.imageUrl && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={project.imageUrl}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6">
                {/* Category & Risk */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-cyan-400 text-sm font-medium flex items-center">
                    <span className="mr-1">{project.category.icon}</span>
                    {project.category.name}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(project.riskLevel)}`}>
                    {project.riskLevel.toUpperCase()}
                  </span>
                </div>

                {/* Project Name */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {project.name}
                </h3>

                {/* Description */}
                <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-slate-400 text-xs">ROI</p>
                    <p className="text-green-400 font-bold text-lg">
                      {project.roiPercentage}%
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Duration</p>
                    <p className="text-white font-semibold">
                      {project.durationMonths} months
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Min. Investment</p>
                    <p className="text-white font-semibold text-sm">
                      {project.minInvestmentFormatted}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Investors</p>
                    <p className="text-white font-semibold">
                      {project.totalInvestors}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-white font-semibold">
                      {project.progressPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(project.progressPercentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-slate-400">
                      {project.collectedAmountFormatted}
                    </span>
                    <span className="text-slate-400">
                      {project.targetAmountFormatted}
                    </span>
                  </div>
                </div>

                {/* Status & Days Remaining */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  {project.daysRemaining > 0 && (
                    <span className="text-orange-400 text-xs">
                      {project.daysRemaining} days remaining
                    </span>
                  )}
                </div>

                {/* Action Button */}
                <Link href={`/investments/${project.slug}`}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all duration-300"
                  >
                    View Details
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">
              No investment projects found
            </p>
          </div>
        )}
        </div>
      </div>
    </>
  )
}
