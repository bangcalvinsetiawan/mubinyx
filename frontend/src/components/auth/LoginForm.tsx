import { useState } from 'react'
import { motion } from 'framer-motion'
import { auth } from '@/lib/api'
import { useAuthStore } from '@/store/auth'

interface LoginFormProps {
  onSuccess: () => void
  onToggleForm: () => void
}

export default function LoginForm({ onSuccess, onToggleForm }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await auth.login(formData)
      const { user, token } = result.data
      
      login(user, token)
      onSuccess()
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-8 w-full max-w-md"
    >
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
            placeholder="Enter your password"
          />
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </motion.button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-slate-400">
          Don't have an account?{' '}
          <button
            onClick={onToggleForm}
            className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            Register here
          </button>
        </p>
      </div>
    </motion.div>
  )
}
