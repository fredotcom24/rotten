'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const { register } = useAuth()
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email requis'
    }

    if (!formData.password) {
      newErrors.password = 'Mot de passe requis'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSuccess(false)
    setLoading(true)

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setLoading(false)
      return
    }

    // Appel API
    const result = await register(
      formData.email,
      formData.password,
      formData.name || undefined
    )

    if (result.success) {
      // Show success message instead of redirecting
      setSuccess(true)
      setSuccessMessage(result.message || 'Registration successful! Please check your email to verify your account.')
      setLoading(false)
    } else {
      if (typeof result.error === 'string') {
        setErrors({ general: result.error })
      } else {
        setErrors(result.error)
      }
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1320] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-[#020d18] border border-[#233a50] p-10 rounded-lg space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm text-[#abb7c4]">
            Or{' '}
            <Link href="/auth/login" className="font-bold text-[#dcf836] hover:text-[#e5ff3d] transition-colors">
              login in existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {success && (
            <div className="rounded-md bg-green-500/10 border border-green-500 p-4">
              <div className="text-sm text-green-400">
                <p className="font-semibold mb-2">{successMessage}</p>
                <p className="mt-2">
                  <Link href="/auth/login" className="font-medium text-green-400 hover:text-green-300 underline">
                    Go to Login
                  </Link>
                </p>
              </div>
            </div>
          )}

          {errors.general && (
            <div className="rounded-md bg-red-500/10 border border-red-500 p-4">
              <div className="text-sm text-red-400">{errors.general}</div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#abb7c4]">
                Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 appearance-none bg-[#0b1320] relative block w-full px-3 py-2 border border-[#233a50] placeholder-[#405266] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#dd003f] focus:border-[#dd003f] sm:text-sm"
                placeholder="Your name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#abb7c4]">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 appearance-none bg-[#0b1320] relative block w-full px-3 py-2 border border-[#233a50] placeholder-[#405266] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#dd003f] focus:border-[#dd003f] sm:text-sm"
                placeholder="email@exemple.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#abb7c4]">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 appearance-none bg-[#0b1320] relative block w-full px-3 py-2 border border-[#233a50] placeholder-[#405266] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#dd003f] focus:border-[#dd003f] sm:text-sm"
                placeholder="Min 6 chars"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#abb7c4]">
                Confirm passsword *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 appearance-none bg-[#0b1320] relative block w-full px-3 py-2 border border-[#233a50] placeholder-[#405266] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#dd003f] focus:border-[#dd003f] sm:text-sm"
                placeholder="Confirm password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#dd003f] hover:bg-[#ff0050] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dd003f] disabled:opacity-50 transition-colors"
            >
              {loading ? 'Register...' : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}