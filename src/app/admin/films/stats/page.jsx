'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'

export default function FilmStatsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchStats()
    }
  }, [user])

  const fetchStats = async () => {
    try {
      setLoadingStats(true)
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/admin/films/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setStats(response.data)
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setLoadingStats(false)
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

  if (loading || loadingStats) {
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
          <h1 className="text-3xl font-bold text-white">Movies Statistics</h1>
          <Link href="/admin/films" className="text-[#dcf836] hover:text-[#e5ff3d] transition-colors">
            Back to Films
          </Link>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">{error}</div>}

        {stats && (
          <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[#020d18] border border-[#233a50] rounded-lg p-6">
                <div className="text-sm font-medium text-[#abb7c4]">Total Movies</div>
                <div className="mt-2 text-3xl font-bold text-white">{stats.overview.totalFilms}</div>
              </div>
              <div className="bg-[#020d18] border border-[#233a50] rounded-lg p-6">
                <div className="text-sm font-medium text-[#abb7c4]">Total Ratings</div>
                <div className="mt-2 text-3xl font-bold text-[#dd003f]">{stats.overview.totalRatings}</div>
              </div>
              <div className="bg-[#020d18] border border-[#233a50] rounded-lg p-6">
                <div className="text-sm font-medium text-[#abb7c4]">Total Comments</div>
                <div className="mt-2 text-3xl font-bold text-[#dcf836]">{stats.overview.totalComments}</div>
              </div>
              <div className="bg-[#020d18] border border-[#233a50] rounded-lg p-6">
                <div className="text-sm font-medium text-[#abb7c4]">Avg Ratings/Movie</div>
                <div className="mt-2 text-3xl font-bold text-white">{stats.overview.averageRatingsPerFilm}</div>
              </div>
            </div>

            {/* Top Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Rated Films */}
              <div className="bg-[#020d18] border border-[#233a50] rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Top 5 most rated films</h2>
                <div className="space-y-3">
                  {stats.topRatedFilms.map((film, index) => (
                    <div key={film.id} className="flex items-center gap-3 p-3 border border-[#233a50] rounded hover:bg-[#0b1320] transition-colors">
                      <div className="text-lg font-bold text-[#dd003f] w-8">#{index + 1}</div>
                      {film.posterPath && (
                        <img src={getImageUrl(film.posterPath, 'w92')} alt={film.title} className="w-12 h-16 object-cover rounded" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-white">{film.title}</div>
                        <div className="text-sm text-[#abb7c4]">{film.totalRatings} ratings - Avg: {film.averageRating?.toFixed(1)}/5</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Most Commented Films */}
              <div className="bg-[#020d18] border border-[#233a50] rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Top 5 Most Commented Films</h2>
                <div className="space-y-3">
                  {stats.mostCommentedFilms.map((film, index) => (
                    <div key={film.id} className="flex items-center gap-3 p-3 border border-[#233a50] rounded hover:bg-[#0b1320] transition-colors">
                      <div className="text-lg font-bold text-[#dcf836] w-8">#{index + 1}</div>
                      {film.posterPath && (
                        <img src={getImageUrl(film.posterPath, 'w92')} alt={film.title} className="w-12 h-16 object-cover rounded" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-white">{film.title}</div>
                        <div className="text-sm text-[#abb7c4]">{film._count.comments} comments</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Most Favorited Films */}
              <div className="bg-[#020d18] border border-[#233a50] rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Top 5 Most Favorited Films</h2>
                <div className="space-y-3">
                  {stats.mostFavoritedFilms.map((film, index) => (
                    <div key={film.id} className="flex items-center gap-3 p-3 border border-[#233a50] rounded hover:bg-[#0b1320] transition-colors">
                      <div className="text-lg font-bold text-[#dd003f] w-8">#{index + 1}</div>
                      {film.posterPath && (
                        <img src={getImageUrl(film.posterPath, 'w92')} alt={film.title} className="w-12 h-16 object-cover rounded" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-white">{film.title}</div>
                        <div className="text-sm text-[#abb7c4]">{film._count.favorites} favorites</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recently Added Movies */}
            <div className="bg-[#020d18] border border-[#233a50] rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Recently Added Movies</h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {stats.recentFilms.map((film) => (
                  <div key={film.id} className="border border-[#233a50] rounded p-3 hover:bg-[#0b1320] transition-colors">
                    {film.posterPath && (
                      <img src={getImageUrl(film.posterPath, 'w185')} alt={film.title} className="w-full h-48 object-cover rounded mb-2" />
                    )}
                    <div className="font-medium text-sm text-white line-clamp-2">{film.title}</div>
                    <div className="text-xs text-[#abb7c4] mt-1">{new Date(film.createdAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
