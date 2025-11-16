'use client'

import Link from 'next/link'
import {useAuth} from '@/contexts/AuthContext'
import Image from 'next/image';


export default function Navbar() {
  const {user, logout, loading} = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="bg-[#020d18] border-b border-[#405266]">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
               <Link href="/" className="block">
              <Image 
                src="/uploads/logo.png" 
                alt="Open Pediatrics" 
                width={119} 
                height={58}
                className="w-[119px] h-[58px]"
              />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden flex flex-col gap-1 w-8 h-8 items-center justify-center"
            aria-label="Toggle navigation"
          >
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            {/* Left Menu */}
            <ul className="flex items-center gap-6">
              <li>
                <Link href="/films" className="text-white hover:text-[#dcf836] transition-colors text-sm uppercase font-medium">
                  Movies
                </Link>
              </li>

              {user && (
                <li>
                  <Link href="/favorites" className="text-white hover:text-[#dcf836] transition-colors text-sm uppercase font-medium">
                    My Favorites
                  </Link>
                </li>
              )}

              {user?.role === 'ADMIN' && (
                <li>
                  <Link href="/admin" className="text-[#dcf836] hover:text-[#fbbf24] transition-colors text-sm uppercase font-medium">
                    Admin Panel
                  </Link>
                </li>
              )}
            </ul>

            {/* Right Menu */}
            <ul className="flex items-center gap-4">
              {loading ? (
                <li className="text-white text-sm">Loading...</li>
              ) : user ? (
                <>
                  <li className="text-white text-sm">
                    Welcome, {user.name || user.email}
                    {user.role === 'ADMIN' && (
                      <span className="ml-2 px-2 py-0.5 bg-[#dcf836] text-[#020d18] rounded text-xs font-semibold uppercase">
                        Admin
                      </span>
                    )}
                  </li>
                  <li>
                    <Link
                      href="/profile"
                      className="text-white hover:text-[#dcf836] transition-colors text-sm uppercase font-medium"
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="cursor-pointer bg-[#dd003f] hover:bg-[#ff0f4f] text-white px-6 py-2 rounded-full text-sm uppercase font-medium transition-colors"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/auth/login"
                      className="text-white hover:text-[#dcf836] transition-colors text-sm uppercase font-medium"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/auth/register"
                      className="bg-[#dd003f] hover:bg-[#ff0f4f] text-white px-6 py-2 rounded-full text-sm uppercase font-medium transition-colors"
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  )
}