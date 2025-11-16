'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'

export default function VerifyPasswordChangePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState('form')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const token = searchParams.get('token')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!token) {
      setMessage('Invalid verification link')
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await axios.post('/api/user/verify-password-change', {
        token,
        newPassword
      })

      setStatus('success')
      setMessage(response.data.message)

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)
    } catch (error) {
      setMessage(
        error.response?.data?.error || 'Failed to change password. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">Invalid link</h2>
            <p className="mt-2 text-[#e50914]">
              This password change link has expired.
            </p>
            <button
              onClick={() => router.push('/')}
              className="cursor-pointer mt-6 bg-[#e50914] text-white py-2 px-4 rounded-md hover:bg-[#b8070f] transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Set New Password
          </h2>
        </div>

        <div className="bg-[#2a2a2a] p-8 rounded-lg shadow-md">
          {status === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {message && (
                <div className="bg-red-900/30 border border-[#e50914] text-[#e50914] px-4 py-3 rounded">
                  {message}
                </div>
              )}

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-[#1a1a1a] border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-[#e50914] focus:border-[#e50914]"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-[#1a1a1a] border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-[#e50914] focus:border-[#e50914]"
                  placeholder="Confirm new password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#e50914] hover:bg-[#b8070f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e50914] disabled:opacity-50 transition-colors"
              >
                {loading ? 'Changing Password...' : 'Change Password'}
              </button>
            </form>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-900/30">
                <svg
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="mt-4 text-green-500 font-semibold">{message}</p>
              <p className="mt-2 text-gray-400 text-sm">
                Redirecting to login page...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}