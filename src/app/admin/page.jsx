'use client'

import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const { user, getToken } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      })

      if (response.ok) {
        const data = await response.json()
        const users = data.users || []

        setStats({
          totalUsers: users.length,
          adminUsers: users.filter(u => u.role === 'ADMIN').length,
          regularUsers: users.filter(u => u.role === 'USER').length,
          verifiedUsers: users.filter(u => u.emailVerified).length
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b1320]">
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-[#abb7c4]">Manage your Rotten Tomatoes platform</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#020d18] border border-[#233a50] rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-[#abb7c4]">Total Users</div>
                  <div className="mt-2 text-3xl font-bold text-white">
                    {loading ? '...' : stats?.totalUsers || 0}
                  </div>
                </div>
                <div className="p-3 bg-[#dd003f] rounded-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-[#020d18] border border-[#233a50] rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-[#abb7c4]">Admins</div>
                  <div className="mt-2 text-3xl font-bold text-[#dcf836]">
                    {loading ? '...' : stats?.adminUsers || 0}
                  </div>
                </div>
                <div className="p-3 bg-[#dcf836] rounded-lg">
                  <svg className="w-8 h-8 text-[#020d18]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-[#020d18] border border-[#233a50] rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-[#abb7c4]">Regular Users</div>
                  <div className="mt-2 text-3xl font-bold text-white">
                    {loading ? '...' : stats?.regularUsers || 0}
                  </div>
                </div>
                <div className="p-3 bg-[#233a50] rounded-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-[#020d18] border border-[#233a50] rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-[#abb7c4]">Verified Users</div>
                  <div className="mt-2 text-3xl font-bold text-white">
                    {loading ? '...' : stats?.verifiedUsers || 0}
                  </div>
                </div>
                <div className="p-3 bg-green-600 rounded-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Management Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/admin/users" className="block group">
              <div className="bg-[#020d18] border border-[#233a50] hover:border-[#dd003f] rounded-lg p-6 transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-[#dd003f] rounded-lg group-hover:bg-[#ff0050] transition-colors">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-white">Users</h2>
                </div>
                <p className="text-[#abb7c4]">
                  Manage users and admin roles
                </p>
              </div>
            </Link>

            <Link href="/admin/films" className="block group">
              <div className="bg-[#020d18] border border-[#233a50] hover:border-[#dd003f] rounded-lg p-6 transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-[#dd003f] rounded-lg group-hover:bg-[#ff0050] transition-colors">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-white">Films</h2>
                </div>
                <p className="text-[#abb7c4]">
                  Manage and import films
                </p>
              </div>
            </Link>

            <Link href="/admin/comments" className="block group">
              <div className="bg-[#020d18] border border-[#233a50] hover:border-[#dd003f] rounded-lg p-6 transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-[#dd003f] rounded-lg group-hover:bg-[#ff0050] transition-colors">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-white">Comments</h2>
                </div>
                <p className="text-[#abb7c4]">
                  Moderate user comments
                </p>
              </div>
            </Link>

            <Link href="/admin/films/stats" className="block group">
              <div className="bg-[#020d18] border border-[#233a50] hover:border-[#dd003f] rounded-lg p-6 transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-[#dd003f] rounded-lg group-hover:bg-[#ff0050] transition-colors">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-white">Statistics</h2>
                </div>
                <p className="text-[#abb7c4]">
                  View film analytics
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
