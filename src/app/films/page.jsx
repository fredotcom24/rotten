'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function FilmsPage({ movie }) {
  const [films, setFilms] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalFilms, setTotalFilms] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const searchParams = useSearchParams()
  const router = useRouter()
  const filmsPerPage = 16

  const getImageUrl = (path, size = 'w185') => {
    if (!path) return null
    if (path.startsWith('/uploads')) return path
    if (path.startsWith('/')) return `https://image.tmdb.org/t/p/${size}${path}`
    return path
  }

  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1')
    setCurrentPage(page)
  }, [searchParams])

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams(searchParams)
        params.set('limit', filmsPerPage.toString())
        params.set('page', currentPage.toString())

        const res = await fetch(`/api/films?${params.toString()}`)
        const data = await res.json()
        setFilms(data.films || [])
        setTotalFilms(data.total || 0)
      } catch (error) {
        console.error('Error fetching films:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFilms()
  }, [searchParams, currentPage])

  const totalPages = Math.ceil(totalFilms / filmsPerPage)

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    router.push(`/films?${params.toString()}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020d18] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-[#020d18] text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Movie Results</h1>

      {films.length === 0 ? (
        <p className="text-center text-gray-400">No films found.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {films.map((film) => (
              <Link
                key={film.id}
                href={`/movies/${film.id}`}
                className="flex items-center gap-2 text-white text-sm font-medium hover:text-[#dcf836] transition-colors"
              >
                <div className="bg-[#0b1b2b] rounded-lg p-3">
                  <img
                    src={getImageUrl(film.posterPath, 'w342') || '/images/uploads/mv-item1.jpg'}
                    alt={film.title}
                    className="w-full rounded-md mb-3"
                  />
                  <h2 className="text-lg font-semibold">{film.title}</h2>
                  <p className="text-sm text-gray-400">{film.releaseDate?.split('T')[0]}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="cursor-pointer px-4 py-2 bg-[#233a50] text-white rounded-md hover:bg-[#2d4a63] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`cursor-pointer px-4 py-2 rounded-md transition-colors ${
                          currentPage === page
                            ? 'bg-[#dd003f] text-white'
                            : 'bg-[#233a50] text-white hover:bg-[#2d4a63]'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return <span key={page} className="px-2 text-gray-400">...</span>
                  }
                  return null
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="cursor-pointer px-4 py-2 bg-[#233a50] text-white rounded-md hover:bg-[#2d4a63] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
    </>
  )
}
