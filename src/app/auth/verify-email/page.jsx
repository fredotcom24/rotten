'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('verifying')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setStatus('error')
      setMessage('Invalid verification link')
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await axios.post('/api/auth/verify-email', { token })

        setStatus('success')
        setMessage(response.data.message)

        // Store the token if provided
        if (response.data.token) {
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('user', JSON.stringify(response.data.user))
        }

        // Redirect to home page after 3 seconds
        setTimeout(() => {
          router.push('/')
        }, 3000)
      } catch (error) {
        setStatus('error')
        setMessage(
          error.response?.data?.error || 'Failed to verify email. Please try again.'
        )
      }
    }

    verifyEmail()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Email Verification
          </h2>
        </div>

        <div className="bg-[#2a2a2a] p-8 rounded-lg shadow-md">
          {status === 'verifying' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e50914] mx-auto"></div>
              <p className="mt-4 text-gray-300">Verifying your email...</p>
            </div>
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
                Redirecting to home page...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900/30">
                <svg
                  className="h-6 w-6 text-[#e50914]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <p className="mt-4 text-[#e50914] font-semibold">{message}</p>
              <button
                onClick={() => router.push('/auth/login')}
                className="cursor-pointer mt-6 w-full bg-[#e50914] text-white py-2 px-4 rounded-md hover:bg-[#b8070f] transition-colors"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                Email Verification
              </h2>
            </div>
            <div className="bg-[#2a2a2a] p-8 rounded-lg shadow-md">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e50914] mx-auto"></div>
                <p className="mt-4 text-gray-300">Loading...</p>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
