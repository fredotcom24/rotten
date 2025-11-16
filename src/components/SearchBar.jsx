'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/films?search=${encodeURIComponent(query.trim())}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center w-full max-w-4xl mx-auto bg-[#0b1b2b] rounded-lg overflow-hidden border border-[#405266] focus-within:border-[#dcf836] transition-colors"
    >
      <input
        type="text"
        placeholder="Search for a movie, director, or keyword..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 px-6 py-3 bg-transparent text-white placeholder-[#7a8993] outline-none"
      />
      <button
        type="submit"
        className="cursor-pointer flex items-center justify-center px-6 py-4 bg-[#dd003f] hover:bg-[#ff0f4f] text-white font-medium transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </form>
  )
}