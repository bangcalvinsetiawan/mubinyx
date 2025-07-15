'use client'

import { useState } from 'react'
import { auth } from '@/lib/api'
import Navigation from '@/components/Navigation'

export default function TestPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  const testRegistration = async () => {
    setLoading(true)
    setResult('')
    
    try {
      const data = {
        name: 'Test User ' + Date.now(),
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        phone: '+1234567890'
      }
      
      console.log('Testing registration with:', data)
      
      const result = await auth.register(data)
      console.log('Registration result:', result)
      setResult('SUCCESS: ' + JSON.stringify(result, null, 2))
    } catch (error: any) {
      console.error('Registration error:', error)
      setResult('ERROR: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-2xl font-bold mb-8">Test Registration</h1>
        
        <button
          onClick={testRegistration}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Registration'}
        </button>
        
        {result && (
          <div className="mt-8 p-4 bg-gray-800 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Result:</h2>
            <pre className="text-sm whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>
    </>
  )
}
