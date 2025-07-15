import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store/auth'

interface CryptoPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  project: any
  investmentAmount: string
}

export default function CryptoPaymentModal({ 
  isOpen, 
  onClose, 
  project, 
  investmentAmount 
}: CryptoPaymentModalProps) {
  const { user } = useAuthStore()
  const [selectedCrypto, setSelectedCrypto] = useState('BTC')
  const [exchangeRates, setExchangeRates] = useState({
    BTC: 45000,
    ETH: 2500,
    USDT: 1,
    BNB: 320
  })
  const [paymentStep, setPaymentStep] = useState<'select' | 'payment' | 'processing' | 'success'>('select')
  const [cryptoAmount, setCryptoAmount] = useState('0')
  const [walletAddress, setWalletAddress] = useState('')
  const [countdown, setCountdown] = useState(900) // 15 minutes

  // Convert USD to crypto
  useEffect(() => {
    if (investmentAmount && exchangeRates[selectedCrypto as keyof typeof exchangeRates]) {
      const usdAmount = parseFloat(investmentAmount)
      const rate = exchangeRates[selectedCrypto as keyof typeof exchangeRates]
      const crypto = (usdAmount / rate).toFixed(8)
      setCryptoAmount(crypto)
    }
  }, [investmentAmount, selectedCrypto, exchangeRates])

  // Countdown timer for payment
  useEffect(() => {
    if (paymentStep === 'payment' && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [paymentStep, countdown])

  // Generate wallet address (mock)
  useEffect(() => {
    if (paymentStep === 'payment') {
      const addresses = {
        BTC: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        ETH: '0x742d35Cc6634C0532925a3b8D3Ac6CB1e60f008e',
        USDT: '0x742d35Cc6634C0532925a3b8D3Ac6CB1e60f008e',
        BNB: '0x742d35Cc6634C0532925a3b8D3Ac6CB1e60f008e'
      }
      setWalletAddress(addresses[selectedCrypto as keyof typeof addresses])
    }
  }, [paymentStep, selectedCrypto])

  const cryptoOptions = [
    { symbol: 'BTC', name: 'Bitcoin', icon: '₿', color: 'text-orange-400' },
    { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', color: 'text-blue-400' },
    { symbol: 'USDT', name: 'Tether USD', icon: '₮', color: 'text-green-400' },
    { symbol: 'BNB', name: 'Binance Coin', icon: 'B', color: 'text-yellow-400' }
  ]

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleProceedToPayment = () => {
    setPaymentStep('payment')
  }

  const handlePaymentComplete = () => {
    setPaymentStep('processing')
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStep('success')
    }, 3000)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}                className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">
              {paymentStep === 'select' && 'Select Payment Method'}
              {paymentStep === 'payment' && 'Complete Payment'}
              {paymentStep === 'processing' && 'Processing Payment'}
              {paymentStep === 'success' && 'Payment Successful'}
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Investment Summary */}
          <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
            <h4 className="text-white font-semibold mb-2">{project?.name}</h4>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Investment Amount:</span>
              <span className="text-green-400 font-semibold">${investmentAmount}</span>
            </div>
          </div>

          {/* Step: Select Crypto */}
          {paymentStep === 'select' && (
            <div className="space-y-4">
              <h4 className="text-white font-semibold mb-4">Choose Cryptocurrency</h4>
              <div className="grid grid-cols-2 gap-3">
                {cryptoOptions.map((crypto) => (
                  <button
                    key={crypto.symbol}
                    onClick={() => setSelectedCrypto(crypto.symbol)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedCrypto === crypto.symbol
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    <div className={`text-2xl mb-2 ${crypto.color}`}>
                      {crypto.icon}
                    </div>
                    <div className="text-white font-semibold text-sm">{crypto.name}</div>
                    <div className="text-slate-400 text-xs">{crypto.symbol}</div>
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">You will pay:</span>
                  <div className="text-right">
                    <div className="text-white font-bold">
                      {cryptoAmount} {selectedCrypto}
                    </div>
                    <div className="text-slate-400 text-sm">
                      ≈ ${investmentAmount} USD
                    </div>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProceedToPayment}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-3 rounded-lg font-semibold mt-6"
              >
                Proceed to Payment
              </motion.button>
            </div>
          )}

          {/* Step: Payment */}
          {paymentStep === 'payment' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-red-400 font-semibold mb-2">
                  Time remaining: {formatTime(countdown)}
                </div>
                <div className="text-slate-400 text-sm">
                  Payment must be completed within 15 minutes
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <h5 className="text-white font-semibold mb-3">Payment Details</h5>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Amount:</span>
                    <span className="text-white font-mono">{cryptoAmount} {selectedCrypto}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-400">Network:</span>
                    <span className="text-white">
                      {selectedCrypto === 'BTC' ? 'Bitcoin' : 
                       selectedCrypto === 'ETH' ? 'Ethereum (ERC-20)' :
                       selectedCrypto === 'USDT' ? 'Ethereum (ERC-20)' :
                       'Binance Smart Chain (BEP-20)'}
                    </span>
                  </div>
                  
                  <div className="border-t border-slate-600 pt-3">
                    <div className="text-slate-400 text-sm mb-2">Send to this address:</div>
                    <div className="bg-slate-900/50 p-3 rounded border">
                      <div className="text-white font-mono text-sm break-all">
                        {walletAddress}
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(walletAddress)}
                        className="text-cyan-400 text-xs mt-2 hover:text-cyan-300"
                      >
                        📋 Copy Address
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="text-yellow-400 text-sm">
                  ⚠️ <strong>Important:</strong> Send exactly {cryptoAmount} {selectedCrypto} to the address above. 
                  Sending a different amount may result in loss of funds.
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setPaymentStep('select')}
                  className="flex-1 bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-600 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePaymentComplete}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  I've Sent Payment
                </button>
              </div>
            </div>
          )}

          {/* Step: Processing */}
          {paymentStep === 'processing' && (
            <div className="text-center py-8">
              <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h4 className="text-white font-semibold mb-2">Processing Payment</h4>
              <p className="text-slate-400 text-sm">
                Please wait while we confirm your transaction on the blockchain...
              </p>
            </div>
          )}

          {/* Step: Success */}
          {paymentStep === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">✓</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Investment Successful!</h4>
              <p className="text-slate-400 text-sm mb-6">
                Your investment of ${investmentAmount} in {project?.name} has been confirmed.
              </p>
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold"
              >
                View Portfolio
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
