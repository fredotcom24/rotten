'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import axios from 'axios'

export default function FilmsListPage() {

  const [films, setFilms] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalFilms, setTotalFilms] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(5)

  const getImageUrl = (path, size = 'w185') => {
    if (!path) return null
    if (path.startsWith('/uploads')) return path
    if (path.startsWith('/')) return `https://image.tmdb.org/t/p/${size}${path}`
    return path
  }

  useEffect(() => {
    fetchFilms()
  }, [currentPage, perPage])

  const fetchFilms = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: perPage,
      })

      const response = await axios.get(`/api/films?${queryParams}`)

      setFilms(response.data.films || [])
      setTotalFilms(response.data.pagination?.total || response.data.films?.length || 0)
    } catch (error) {
      console.error('Error fetching films:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(totalFilms / perPage)

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="bg-linear-to-b from-[#020d18] to-[#0b1320] py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Movie Listing
            </h1>
            <nav className="flex items-center justify-center md:justify-start gap-2 text-sm">
              <Link href="/" className="text-[#dcf836] hover:text-[#e5ff3d] transition-colors">
                Home
              </Link>
              <svg className="w-4 h-4 text-[#abb7c4]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-[#abb7c4]">Movie Listing</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[#0b1320] min-h-screen py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Main Content Area */}
            <div className="w-full">

              {/* Loading State */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-white text-xl">Loading movies...</div>
                </div>
              ) : (
                <>
                  {/* Movies List */}
                  <div className="space-y-6">
                    {films.map((film) => {
                      // Build poster URL
                      const posterUrl = getImageUrl(film.posterPath, 'w342') || '/images/uploads/mv-item1.jpg'

                      return (
                        <div
                          key={film.id}
                          className="bg-[#020d18] rounded-lg overflow-hidden border border-[#233a50] hover:border-[#dd003f] transition-all duration-300 group"
                        >
                          <div className="flex flex-col sm:flex-row gap-0 sm:gap-6">

                            {/* Film Poster */}
                            <Link
                              href={`/movies/${film.id}`}
                              className="sm:w-48 w-full shrink-0"
                            >
                              <div className="relative aspect-2/3 sm:aspect-auto sm:h-full overflow-hidden">
                                <img
                                  src={posterUrl}
                                  alt={film.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent sm:hidden"></div>
                              </div>
                            </Link>

                            {/* Film Info */}
                            <div className="flex-1 p-4 sm:p-6 sm:py-4">

                              {/* Title */}
                              <h6 className="mb-3">
                                <Link
                                  href={`/movies/${film.id}`}
                                  className="text-white hover:text-[#dcf836] transition-colors text-xl font-bold"
                                >
                                  {film.title}
                                  {film.releaseDate && (
                                    <span className="text-[#abb7c4] font-normal ml-2">
                                      ({new Date(film.releaseDate).getFullYear()})
                                    </span>
                                  )}
                                </Link>
                              </h6>

                              {/* Rating */}
                              <div className="flex items-center gap-2 mb-3">
                                <svg className="w-5 h-5 text-[#f5b50a]" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-white font-semibold">{film.averageRating?.toFixed(1) || 'N/A'}</span>
                                <span className="text-[#abb7c4]">/5</span>
                              </div>

                              {/* Description */}
                              <p className="text-[#abb7c4] leading-relaxed mb-3 line-clamp-2 sm:line-clamp-3">
                                {film.overview || 'No description available.'}
                              </p>

                              {/* Meta Info */}
                              <div className="flex flex-wrap items-center gap-2 text-sm text-[#abb7c4] mb-3">
                                <span>Run Time: {film.runtime || 'N/A'}min</span>
                                {film.releaseDate && (
                                  <>
                                    <span>•</span>
                                    <span>
                                      Release: {new Date(film.releaseDate).toLocaleDateString('en-US', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                      })}
                                    </span>
                                  </>
                                )}
                              </div>

                              {/* Director */}
                              {film.director && (
                                <p className="text-[#abb7c4] text-sm mb-2">
                                  Director:
                                  <span className="text-white ml-1">
                                    {film.director}
                                  </span>
                                </p>
                              )}

                              {/* Genres */}
                              {film.genres && film.genres.length > 0 && (
                                <p className="text-[#abb7c4] text-sm">
                                  Genres:
                                  {film.genres.map((genre, i) => (
                                    <span key={i}>
                                      <span className="text-white ml-1">
                                        {genre}
                                      </span>
                                      {i < film.genres.length - 1 && ','}
                                    </span>
                                  ))}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Bottom Pagination */}
                  {totalPages > 1 && (
                    <div className="bg-[#020d18] rounded-lg p-4 md:p-6 mt-6 border border-[#233a50]">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                        {/* Per Page Selector */}
                        <div className="flex items-center gap-3">
                          <label className="text-[#abb7c4] text-sm whitespace-nowrap">Movies per page:</label>
                          <select
                            value={perPage}
                            onChange={(e) => {
                              setPerPage(Number(e.target.value))
                              setCurrentPage(1)
                            }}
                            className="bg-[#0b1320] text-white border border-[#233a50] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#dd003f]"
                          >
                            <option value="5">5 Movies</option>
                            <option value="10">10 Movies</option>
                            <option value="20">20 Movies</option>
                          </select>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center gap-2">
                          <span className="text-[#abb7c4] text-sm mr-2 hidden sm:inline">
                            Page {currentPage} of {totalPages}:
                          </span>

                          {/* Previous Button */}
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="w-10 h-10 flex items-center justify-center bg-[#233a50] text-white hover:bg-[#2d4a63] rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <svg className="w-5 h-5 rotate-180" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>

                          {/* Page Numbers */}
                          <div className="flex gap-2">
                            {[...Array(Math.min(totalPages, 6))].map((_, i) => {
                              const page = i + 1
                              return (
                                <button
                                  key={page}
                                  onClick={() => setCurrentPage(page)}
                                  className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
                                    currentPage === page
                                      ? 'bg-[#dd003f] text-white'
                                      : 'bg-[#233a50] text-white hover:bg-[#2d4a63]'
                                  }`}
                                >
                                  {page}
                                </button>
                              )
                            })}
                          </div>

                          {/* Next Button */}
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="w-10 h-10 flex items-center justify-center bg-[#233a50] text-white hover:bg-[#2d4a63] rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
