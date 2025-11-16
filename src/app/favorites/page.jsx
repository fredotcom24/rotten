'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import axios from 'axios'
import Swal from 'sweetalert2'

export default function FavoritesPage() {
  const router = useRouter()
  const { user, getToken } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState(null)

  const getImageUrl = (path, size = 'w185') => {
    if (!path) return null
    if (path.startsWith('/uploads')) return path
    if (path.startsWith('/')) return `https://image.tmdb.org/t/p/${size}${path}`
    return path
  }

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    fetchFavorites()
  }, [user])

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('/api/favorites', {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      })
      setFavorites(response.data)
    } catch (error) {
      console.error('Error fetching favorites:', error)
      Swal.fire({
        title: "Ooops... Something goes wrong",
        text: "Failed to load favorites. Please try again",
        icon: "warning",
        confirmButtonColor: "#DD003F"
      }); 
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (filmId) => {
    if (!confirm('Are you sure you want to remove this film from your favorites?')) {
      return
    }

    setRemovingId(filmId)

    try {
      await axios.delete('/api/favorites', {
        data: { filmId },
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      })

      setFavorites(favorites.filter(fav => fav.filmId !== filmId))
      Swal.fire({
        title: "Removed successfully",
        text: "Removed from favorites!",
        icon: "Success",
        confirmButtonColor: "#5ac90fff"
      });
    } catch (error) {
      console.error('Error:', error)
      Swal.fire({
        title: "Removed failed",
        text: "Failed to remove from favorites. Try again",
        icon: "warning",
        confirmButtonColor: "#DD003F"
      }); 
    } finally {
      setRemovingId(null)
    }
  }

  const handleViewDetails = (filmId) => {
    router.push(`/movies/${filmId}`)
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0b1320] flex items-center justify-center">
          <div className="text-white text-2xl">Loading your favorites...</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-linear-to-b from-[#020d18] to-[#0b1320] py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          <div className="text-center">
            <h1 className="text-3xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              My favorites movies
            </h1>
            <p className="text-[#abb7c4] text-lg md:text-xl">
              {favorites.length} {favorites.length === 1 ? 'movie' : 'movies'} in your favorites
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-[#0b1320] min-h-screen py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          {favorites.length === 0 ? (
            // Empty State
            <div className="text-center py-20">
              <svg
                className="w-24 h-24 mx-auto mb-6 text-[#233a50]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                No favorites yet
              </h2>
              <p className="text-[#abb7c4] mb-8 max-w-md mx-auto">
                Start adding films to your favorites to see them here.
              </p>
              <button
                onClick={() => router.push('/movies')}
                className="bg-[#dd003f] hover:bg-[#ff0050] text-white px-8 py-3 rounded-md font-semibold transition-all transform hover:scale-105"
              >
                Browse movies
              </button>
            </div>
          ) : (
            // Favorites Grid
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {favorites.map((favorite) => {
                const film = favorite.film
                const posterUrl = getImageUrl(film.posterPath, 'w500') || '/images/uploads/mv-item1.jpg'

                return (
                  <div
                    key={favorite.id}
                    className="group relative bg-[#020d18] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    {/* Poster Image */}
                    <div className="relative aspect-2/3 overflow-hidden">
                      <img
                        src={posterUrl}
                        alt={film.title}
                        className="w-full h-full object-cover"
                      />

                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-4">
                        <button
                          onClick={() => handleViewDetails(film.id)}
                          className="cursor-pointer w-full bg-[#f5b50a] hover:bg-[#f5b50a] text-white py-2 px-4 rounded-md font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Details
                        </button>

                        <button
                          onClick={() => handleRemoveFavorite(film.id)}
                          disabled={removingId === film.id}
                          className="cursor-pointer w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          {removingId === film.id ? 'Removing...' : 'Remove'}
                        </button>
                      </div>

                      {/* Rating Badge */}
                      {film.averageRating > 0 && (
                        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
                          <svg className="w-4 h-4 text-[#f5b50a]" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-white text-sm font-semibold">
                            {film.averageRating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Film Info */}
                    <div className="p-4">
                      <h3 className="text-white font-semibold text-base mb-2 line-clamp-2 min-h-12">
                        {film.title}
                      </h3>

                      <div className="flex items-center justify-between text-sm text-[#abb7c4]">
                        <span>
                          {film.releaseDate
                            ? new Date(film.releaseDate).getFullYear()
                            : 'N/A'}
                        </span>
                        {film.runtime && (
                          <span>{film.runtime} min</span>
                        )}
                      </div>

                      {film.genres && film.genres.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {film.genres.slice(0, 2).map((genre, index) => (
                            <span
                              key={index}
                              className="text-xs bg-[#233a50] text-[#dcf836] px-2 py-1 rounded"
                            >
                              {genre}
                            </span>
                          ))}
                          {film.genres.length > 2 && (
                            <span className="text-xs text-[#abb7c4] px-2 py-1">
                              +{film.genres.length - 2}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="mt-3 text-xs text-[#abb7c4]">
                        Added {new Date(favorite.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}
