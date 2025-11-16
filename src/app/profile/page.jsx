'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import axios from 'axios'
import Link from 'next/link'

export default function ProfilePage() {
  const router = useRouter()
  const { user, getToken, loading: authLoading } = useAuth()

  // Name change state
  const [userName, setUserName] = useState('')
  const [nameLoading, setNameLoading] = useState(false)
  const [nameMessage, setNameMessage] = useState({ type: '', text: '' })

  // Email change state
  const [newEmail, setNewEmail] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailMessage, setEmailMessage] = useState({ type: '', text: '' })

  // Password change state
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' })
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      setUserName(user.name || '')
    }
  }, [user])

  const handleEmailChange = async (e) => {
    e.preventDefault()
    setEmailMessage({ type: '', text: '' })

    if (!newEmail) {
      setEmailMessage({ type: 'error', text: 'Please enter a new email' })
      return
    }

    setEmailLoading(true)

    try {
      const response = await axios.post(
        '/api/user/change-email',
        { newEmail },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      )

      setEmailMessage({ type: 'success', text: response.data.message })
      setNewEmail('')
    } catch (error) {
      setEmailMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to request email change'
      })
    } finally {
      setEmailLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPasswordMessage({ type: '', text: '' })

    if (!newPassword) {
      setPasswordMessage({ type: 'error', text: 'Please enter a new password' })
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }

    setPasswordLoading(true)

    try {
      const response = await axios.post(
        '/api/user/change-password',
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      )

      setPasswordMessage({ type: 'success', text: response.data.message })
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      setPasswordMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to request password change'
      })
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleNameUpdate = async (e) => {
    e.preventDefault()
    setNameMessage({ type: '', text: '' })

    if (!userName || userName.trim() === '') {
      setNameMessage({ type: 'error', text: 'Name cannot be empty' })
      return
    }

    setNameLoading(true)

    try {
      const response = await axios.patch(
        '/api/user/profile',
        { name: userName },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      )

      setNameMessage({ type: 'success', text: 'Name updated successfully!' })

      setTimeout(() => {
        setNameMessage({ type: '', text: '' })
      }, 3000)
    } catch (error) {
      setNameMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to update name'
      })
    } finally {
      setNameLoading(false)
    }
  }

  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b1320]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#dd003f]"></div>
      </div>
    )
  }


  return (
    <div className="flex min-h-screen bg-black text-gray-200">
      {/* Sidebar */}
      <aside className="w-64 hidden lg:block bg-zinc-900 border-r border-gray-800 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-10">My Profile</h1>
          <nav className="space-y-4">
          </nav>
        </div>
 
        <div className="flex items-center space-x-3 pt-8">
          <img src="uploads/logo.png" alt="User avatar" className="w-10 h-10 rounded-full" />
          <div>
            <p className="text-white">
              <span className="font-medium"></span> {user?.name || 'Not set'}
            </p>
            <p className="text-sm text-white">{user.email}</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="flex justify-between items-center p-4 bg-zinc-950 border-b border-gray-800 shadow-md">
          <div>
            <h2 className="font-semibold text-lg text-white">Hello, {user.name} </h2>
            <p className="text-sm text-gray-500">Welcome back to your dashboard</p>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="p-1.5 cursor-pointer rounded-lg border border-white text-white hover:text-green text-sm font-medium"
            >
              Back to Site
            </Link>

            <button
              onClick={handleLogout}
              className="cursor-pointer bg-[#dd003f] hover:bg-[#ff0f4f] text-white px-6 py-2 rounded-lg text-sm uppercase font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Settings */}
        <div className="p-8 w-full justify-center items-center md:justify-center mx-auto px-[10%]">
          <h2 className="text-3xl font-bold text-white mb-6">Settings Page</h2>
          <p className="text-gray-400 mb-10">Manage your account, update your profile and secure your password.</p>

          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            {/* Left: Account Info */}
            <div className="w-full md:w-1/2 bg-zinc-900 border border-gray-800 rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Account Information</h3>
              <p className="text-sm text-gray-400 mb-4">Edit your name quickly</p>

              <form onSubmit={handleNameUpdate} className="space-y-4">
                {nameMessage.text && (
                  <div
                    className={`px-4 py-3 rounded-md ${nameMessage.type === "success"
                      ? "bg-green-900/30 text-green-400 border border-green-700"
                      : "bg-red-900/30 text-red-400 border border-red-700"
                      }`}
                  >
                    {nameMessage.text}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-400">Name</label>
                  <input
                    type="text"
                    className="w-full bg-zinc-800 border border-gray-700 rounded-md px-3 py-2 text-gray-200 focus:ring-2 focus:ring-blue-600"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Email Address</label>
                  <input
                    type="email"
                    className="w-full bg-zinc-800 border border-gray-700 rounded-md px-3 py-2 text-gray-400"
                    value={user.email}
                    readOnly
                  />
                </div>
                <button
                  type="submit"
                  disabled={nameLoading}
                  className="cursor-pointer w-full bg-[#dd003f] text-white py-2 rounded-md hover:bg-[#ff0f4f] transition disabled:opacity-50"
                >
                  {nameLoading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </div>

            {/* Right: Change Email + Password */}
            <div className="w-full md:w-1/2 flex flex-col gap-8">
              {/* Email */}
              <div className="bg-zinc-900 border border-gray-800 rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Change Email</h3>
                <form onSubmit={handleEmailChange} className="space-y-4">
                  {emailMessage.text && (
                    <div
                      className={`px-4 py-3 rounded-md ${emailMessage.type === "success"
                        ? "bg-green-900/30 text-green-400 border border-green-700"
                        : "bg-red-900/30 text-red-400 border border-red-700"
                        }`}
                    >
                      {emailMessage.text}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Current Email</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full mt-1 bg-zinc-800 border border-gray-700 rounded-md px-3 py-2 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">New Email</label>
                    <input
                      type="email"
                      required
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full mt-1 bg-zinc-800 border border-gray-700 rounded-md px-3 py-2 text-gray-200 focus:ring-2 focus:ring-blue-600"
                      placeholder="Enter new email"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loadingEmail}
                    className="cursor-pointer w-full bg-[#dd003f] text-white py-2 rounded-md hover:bg-[#ff0f4f] transition disabled:opacity-50"
                  >
                    {loadingEmail ? "Updating..." : "Change Email"}
                  </button>
                </form>
              </div>

              {/* Password */}
              <div className="bg-zinc-900 border border-gray-800 rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Change Password</h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  {passwordMessage.text && (
                    <div
                      className={`px-4 py-3 rounded-md ${passwordMessage.type === "success"
                        ? "bg-green-900/30 text-green-400 border border-green-700"
                        : "bg-red-900/30 text-red-400 border border-red-700"
                        }`}
                    >
                      {passwordMessage.text}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-400">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full mt-1 bg-zinc-800 border border-gray-700 rounded-md px-3 py-2 text-gray-200 focus:ring-2 focus:ring-blue-600"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full mt-1 bg-zinc-800 border border-gray-700 rounded-md px-3 py-2 text-gray-200 focus:ring-2 focus:ring-blue-600"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loadingPassword}
                    className="cursor-pointer w-full bg-[#dd003f] text-white py-2 rounded-md hover:bg-[#ff0f4f] transition disabled:opacity-50"
                  >
                    {loadingPassword ? "Saving..." : "Change Password"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
