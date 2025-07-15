'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import CryptoPaymentModal from '@/components/CryptoPaymentModal'
import Navigation from '@/components/Navigation'

interface ProjectDetail {
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
  startDate: string
  endDate: string
  riskLevel: string
  status: string
  progressPercentage: number
  remainingAmount: number
  daysRemaining: number
  totalInvestors: number
  averageInvestment: number
  minInvestmentFormatted: string
  maxInvestmentFormatted: string
  targetAmountFormatted: string
  collectedAmountFormatted: string
  remainingAmountFormatted: string
  averageInvestmentFormatted: string
  riskAnalysis: any
  financialData: any
  documents: string
  investments: any[]
  updates: any[]
  reports: any[]
}

export default function InvestmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [investmentAmount, setInvestmentAmount] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const fetchProjectDetail = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${params.slug}`)
      if (!response.ok) {
        throw new Error('Project not found')
      }
      const data = await response.json()
      setProject(data)
    } catch (error) {
      console.error('Error fetching project:', error)
      router.push('/investments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params.slug) {
      fetchProjectDetail()
    }
  }, [params.slug])

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

  const handleInvestment = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Redirect to home page with login parameter to show login form
      router.push('/?login=true')
      return
    }
    
    // Validate investment amount
    if (!investmentAmount || !project) {
      alert('Please enter a valid investment amount')
      return
    }
    
    const amount = parseFloat(investmentAmount)
    if (amount < project.minInvestment) {
      alert(`Minimum investment amount is $${project.minInvestment.toLocaleString()}`)
      return
    }
    
    if (amount > project.maxInvestment) {
      alert(`Maximum investment amount is $${project.maxInvestment.toLocaleString()}`)
      return
    }
    
    // If authenticated and amount is valid, proceed with crypto payment
    setShowPaymentModal(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading project details...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Project not found</div>
      </div>
    )
  }

  const documents = project.documents ? JSON.parse(project.documents) : []

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/investments">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mb-6 flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            ← Back to Investment List
          </motion.button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
            >
              {project.imageUrl && (
                <div className="h-64 mb-6 rounded-lg overflow-hidden">
                  <img
                    src={project.imageUrl}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <span className="text-cyan-400 font-medium flex items-center">
                  <span className="mr-2">{project.category.icon}</span>
                  {project.category.name}
                </span>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(project.riskLevel)}`}>
                    {project.riskLevel.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-white mb-4">
                {project.name}
              </h1>

              <p className="text-slate-300 leading-relaxed">
                {project.description}
              </p>
            </motion.div>

            {/* Project Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">Statistik Proyek</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-slate-400 text-sm mb-1">ROI Proyeksi</p>
                  <p className="text-green-400 font-bold text-2xl">
                    {project.roiPercentage}%
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Durasi</p>
                  <p className="text-white font-bold text-xl">
                    {project.durationMonths} bulan
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Total Investor</p>
                  <p className="text-white font-bold text-xl">
                    {project.totalInvestors}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Rata-rata Investasi</p>
                  <p className="text-white font-bold text-lg">
                    {project.averageInvestmentFormatted}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Progress Funding</span>
                  <span className="text-white font-semibold">
                    {project.progressPercentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(project.progressPercentage, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-slate-400">
                    Terkumpul: {project.collectedAmountFormatted}
                  </span>
                  <span className="text-slate-400">
                    Target: {project.targetAmountFormatted}
                  </span>
                </div>
              </div>

              {project.daysRemaining > 0 && (
                <div className="mt-4 text-center">
                  <span className="text-orange-400 font-semibold">
                    {project.daysRemaining} hari tersisa
                  </span>
                </div>
              )}
            </motion.div>

            {/* Risk Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">Risk Analysis</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(project.riskAnalysis || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-slate-400 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                    </span>
                    <span className={`font-semibold ${
                      value === 'low' ? 'text-green-400' :
                      value === 'medium' ? 'text-yellow-400' :
                      value === 'high' ? 'text-red-400' : 'text-white'
                    }`}>
                      {typeof value === 'string' ? value.toUpperCase() : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Documents */}
            {documents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
              >
                <h2 className="text-xl font-bold text-white mb-6">Documents</h2>
                
                <div className="space-y-2">
                  {documents.map((doc: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">{doc.name}</span>
                      <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Investment Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sticky top-8"
            >
              <h3 className="text-xl font-bold text-white mb-6">Start Investment</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Minimum Investment</p>
                  <p className="text-white font-bold text-lg">
                    {project.minInvestmentFormatted}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Maximum Investment</p>
                  <p className="text-white font-bold text-lg">
                    {project.maxInvestmentFormatted}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Investment Amount
                  </label>
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    placeholder={`Min. ${project.minInvestment.toLocaleString()}`}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleInvestment}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all duration-300"
                >
                  {isAuthenticated ? 'Invest Now' : 'Login to Invest'}
                </motion.button>

                <p className="text-slate-400 text-xs text-center">
                  {isAuthenticated 
                    ? '* Investment can be made after account verification'
                    : '* Please login first to make an investment'
                  }
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Crypto Payment Modal */}
      {showPaymentModal && project && (
        <CryptoPaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          project={project}
          investmentAmount={investmentAmount}
        />
      )}
      </div>
    </>
  )
}
