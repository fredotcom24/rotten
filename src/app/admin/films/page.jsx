'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'

export default function AdminFilmsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [films, setFilms] = useState([])
  const [loadingFilms, setLoadingFilms] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const [showImportModal, setShowImportModal] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [tmdbResults, setTmdbResults] = useState([])
  const [searchingTmdb, setSearchingTmdb] = useState(false)

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchFilms()
    }
  }, [user])

  const fetchFilms = async () => {
    try {
      setLoadingFilms(true)
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/admin/films', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setFilms(response.data.films)
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setLoadingFilms(false)
    }
  }

  const handleSearchTmdb = async () => {
    if (!searchQuery.trim()) return

    try {
      setSearchingTmdb(true)
      setError(null)
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/admin/films/search-tmdb', {
        params: { query: searchQuery },
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setTmdbResults(response.data.results)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to search TMDB')
    } finally {
      setSearchingTmdb(false)
    }
  }

  const handleImportFromTmdb = async (tmdbId) => {
    try {
      setError(null)
      const token = localStorage.getItem('token')
      const response = await axios.post('/api/admin/films/import-tmdb',
        { tmdbId },
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      setSuccessMessage('Film imported successfully from TMDB')
      setShowImportModal(false)
      setTmdbResults([])
      setSearchQuery('')
      fetchFilms()
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to import film')
    }
  }

  const handleDeleteFilm = async (filmId) => {
    if (!confirm('Are you sure you want to delete this film? This will also delete all associated ratings, comments, and favorites.')) return

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`/api/admin/films/${filmId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      setSuccessMessage('Film deleted successfully')
      fetchFilms()
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete film')
    }
  }

  const getImageUrl = (path, size = 'w185') => {
    if (!path) return null

    if (path.startsWith('/uploads')) {
      return path
    }

    if (path.startsWith('/')) {
      return `https://image.tmdb.org/t/p/${size}${path}`
    }
    return path
  }

  if (loading || loadingFilms) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b1320]">
        <div className="text-xl text-white">Loading...</div>
      </div>
    )
  }

  if (!user || user.role !== 'ADMIN') return null

  return (
    <div className="min-h-screen bg-[#0b1320] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Film Management</h1>
          <div className="flex gap-3">
            <button onClick={() => setShowImportModal(true)} className="cursor-pointer bg-[#dcf836] hover:bg-[#e5ff3d] text-[#020d18] px-6 py-2 rounded-lg transition-colors font-semibold">
              Import from TMDB
            </button>
            <Link href="/admin/films/new" className="cursor-pointer bg-[#dd003f] hover:bg-[#ff0050] text-white px-6 py-2 rounded-lg transition-colors inline-block font-semibold">
              Create Manually
            </Link>
          </div>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">{error}</div>}
        {successMessage && <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded mb-4">{successMessage}</div>}

        <div className="bg-[#020d18] border border-[#233a50] shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-[#233a50]">
            <thead className="bg-[#0b1320]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Genres</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Director</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Release Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Stats</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-[#020d18] divide-y divide-[#233a50]">
              {films.map((film) => (
                <tr key={film.id} className="hover:bg-[#0b1320] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {film.posterPath && (
                        <img src={getImageUrl(film.posterPath, 'w92')} alt={film.title} className="w-12 h-16 object-cover rounded mr-3" />
                      )}
                      <div className="text-sm font-medium text-white">{film.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {film.genres && film.genres.length > 0 ? (
                        film.genres.slice(0, 3).map(genre => (
                          <span key={genre} className="text-xs px-2 py-1 bg-[#233a50] text-white rounded-full">
                            {genre}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-[#abb7c4]">-</span>
                      )}
                      {film.genres && film.genres.length > 3 && (
                        <span className="text-xs text-[#abb7c4]">+{film.genres.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{film.director || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#abb7c4]">
                    {film.releaseDate ? new Date(film.releaseDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{film.averageRating?.toFixed(1) || '0.0'} / 5</div>
                    <div className="text-xs text-[#abb7c4]">{film.totalRatings} ratings</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#abb7c4]">
                    <div className="flex gap-2">
                      <span>C:{film._count.comments}</span>
                      <span>F:{film._count.favorites}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/films/${film.id}/edit`} className="cursor-pointer text-[#dcf836] hover:text-[#e5ff3d] transition-colors">Edit</Link>
                      <button onClick={() => handleDeleteFilm(film.id)} className="cursor-pointer text-red-500 hover:text-red-400 transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showImportModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#020d18] border border-[#233a50] rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6 text-white">Import from TMDB</h2>

              <div className="mb-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Search for a movie..."
                    className="flex-1 px-4 py-2 bg-[#0b1320] border border-[#233a50] rounded-lg text-white placeholder-[#405266] focus:outline-none focus:border-[#dd003f]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchTmdb()}
                  />
                  <button onClick={handleSearchTmdb} disabled={searchingTmdb} className="cursor-pointer bg-[#dd003f] hover:bg-[#ff0050] text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {searchingTmdb ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </div>

              {tmdbResults.length > 0 && (
                <div className="space-y-3">
                  {tmdbResults.map((movie) => (
                    <div key={movie.id} className="flex items-start gap-4 p-4 border border-[#233a50] rounded-lg hover:bg-[#0b1320] transition-colors">
                      {movie.poster_path && (
                        <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt={movie.title} className="w-16 h-24 object-cover rounded" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{movie.title}</h3>
                        <p className="text-sm text-[#abb7c4]">{movie.release_date}</p>
                        <p className="text-sm text-[#abb7c4] mt-1 line-clamp-2">{movie.overview}</p>
                      </div>
                      <button onClick={() => handleImportFromTmdb(movie.id)} className="cursor-pointer bg-[#dcf836] hover:bg-[#e5ff3d] text-[#020d18] px-4 py-2 rounded font-semibold transition-colors whitespace-nowrap">
                        Import
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <button onClick={() => { setShowImportModal(false); setTmdbResults([]); setSearchQuery(''); setError(null) }} className="cursor-pointer w-full bg-[#233a50] hover:bg-[#2d4a63] text-white py-2 rounded-lg transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
