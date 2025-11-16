'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showResendButton, setShowResendButton] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState('')

  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setShowResendButton(false)
    setResendMessage('')
    setLoading(true)

    const result = await login(email, password)

    if (result.success) {
      router.push('/')
    } else {
      setError(result.error)
      setLoading(false)

      // Check if error is about email verification
      if (result.error.includes('verify your email')) {
        setShowResendButton(true)
      }
    }
  }

  const handleResendVerification = async () => {
    setResendLoading(true)
    setResendMessage('')

    try {
      const response = await axios.post('/api/auth/resend-verification', { email })
      setResendMessage(response.data.message)
      setShowResendButton(false)
    } catch (error) {
      setResendMessage(error.response?.data?.error || 'Failed to resend verification email')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1320] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-[#020d18] border border-[#233a50] p-10 rounded-lg space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Login
          </h2>
          <p className="mt-2 text-center text-sm text-[#abb7c4]">
            Or{' '}
            <Link href="/auth/register" className="font-bold text-[#dcf836] hover:text-[#e5ff3d] transition-colors">
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-500/10 border border-red-500 p-4">
              <div className="text-sm text-red-400">{error}</div>
              {showResendButton && (
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                  className="cursor-pointer mt-3 w-full bg-[#dd003f] text-white py-2 px-4 rounded-md hover:bg-[#ff0050] disabled:opacity-50 text-sm transition-colors"
                >
                  {resendLoading ? 'Sending...' : 'Resend Verification Email'}
                </button>
              )}
            </div>
          )}

          {resendMessage && (
            <div className="rounded-md bg-green-500/10 border border-green-500 p-4">
              <div className="text-sm text-green-400">{resendMessage}</div>
            </div>
          )}

          <div className="rounded-md space-y-5">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none bg-[#0b1320] rounded-lg relative block w-full px-3 py-2 border border-[#233a50] placeholder-[#405266] text-white focus:outline-none focus:ring-2 focus:ring-[#dd003f] focus:border-[#dd003f] sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none bg-[#0b1320] rounded-lg relative block w-full px-3 py-2 border border-[#233a50] placeholder-[#405266] text-white focus:outline-none focus:ring-2 focus:ring-[#dd003f] focus:border-[#dd003f] sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#dd003f] hover:bg-[#ff0050] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dd003f] disabled:opacity-50 transition-colors"
            >
              {loading ? 'Login...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}