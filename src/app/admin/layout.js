'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b1320]">
        <div className="text-xl text-white">Loading...</div>
      </div>
    )
  }

  if (!user || user.role !== 'ADMIN') {
    return null
  }

  const isActive = (path) => {
    if (path === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-[#0b1320]">
      <nav className="bg-[#020d18] border-b border-[#233a50]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-white">Admin Panel</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/admin"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    isActive('/admin')
                      ? 'border-[#dd003f] text-white'
                      : 'border-transparent text-[#abb7c4] hover:border-[#405266] hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/users"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    isActive('/admin/users')
                      ? 'border-[#dd003f] text-white'
                      : 'border-transparent text-[#abb7c4] hover:border-[#405266] hover:text-white'
                  }`}
                >
                  Users
                </Link>
                <Link
                  href="/admin/films"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    isActive('/admin/films') && !pathname.includes('/stats')
                      ? 'border-[#dd003f] text-white'
                      : 'border-transparent text-[#abb7c4] hover:border-[#405266] hover:text-white'
                  }`}
                >
                  Films
                </Link>
                <Link
                  href="/admin/comments"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    isActive('/admin/comments')
                      ? 'border-[#dd003f] text-white'
                      : 'border-transparent text-[#abb7c4] hover:border-[#405266] hover:text-white'
                  }`}
                >
                  Comments
                </Link>
                <Link
                  href="/admin/films/stats"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    pathname.includes('/stats')
                      ? 'border-[#dd003f] text-white'
                      : 'border-transparent text-[#abb7c4] hover:border-[#405266] hover:text-white'
                  }`}
                >
                  Statistics
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <Link
                href="/"
                className="text-[#abb7c4] hover:text-white text-sm font-medium transition-colors"
              >
                Back to Site
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}