'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import Swal from 'sweetalert2'

export default function HeroSlider() {
  const { user, getToken } = useAuth()
  const [films, setFilms] = useState([])
  const [loading, setLoading] = useState(true)
  const [favoriteStates, setFavoriteStates] = useState({})
  const [favoriteLoading, setFavoriteLoading] = useState({})

  const getImageUrl = (path, size = 'w185') => {
    if (!path) return null
    if (path.startsWith('/uploads')) return path
    if (path.startsWith('/')) return `https://image.tmdb.org/t/p/${size}${path}`
    return path
  }

  useEffect(() => {
    fetchFeaturedFilm()
  }, [])

  useEffect(() => {
    if (user && films.length > 0) {
      films.forEach(film => {
        checkFavoriteStatus(film.id)
      })
    }
  }, [user, films])

  const fetchFeaturedFilm = async () => {
    try {
      // Fetch the most recent film with high rating
      const response = await axios.get('/api/films?limit=1&sortBy=createdAt&order=desc')
      setFilms(response.data.films)
    } catch (error) {
      console.error('Error fetching featured film:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkFavoriteStatus = async (filmId) => {
    if (!user) return

    try {
      const response = await axios.get(`/api/favorites/check?filmId=${filmId}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      })
      setFavoriteStates(prev => ({
        ...prev,
        [filmId]: response.data.isFavorite
      }))
    } catch (error) {
      console.error('Error checking favorite status:', error)
    }
  }

  const handleFavorite = async (filmId) => {
    if (!user) {
      Swal.fire({
        title: "Unauthorized",
        text: "Please login to add to favorites",
        icon: "alert",
        confirmButtonColor: "#ff3535d3"
    });
      return
    }

    setFavoriteLoading(prev => ({ ...prev, [filmId]: true }))

    try {
      const isFavorite = favoriteStates[filmId]

      if (isFavorite) {
        // Remove from favorites
        await axios.delete('/api/favorites', {
          data: { filmId },
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        })
        setFavoriteStates(prev => ({ ...prev, [filmId]: false }))
        Swal.fire({
          title: "Great... Success",
          text: "Removed from favorites!",
          icon: "Success",
          confirmButtonColor: "#5ac90fff"
        });
      } else {
        // Add to favorites
        await axios.post('/api/favorites', {
          filmId
        }, {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        })
        setFavoriteStates(prev => ({ ...prev, [filmId]: true }))
        Swal.fire({
          title: "Great... Success",
          text: "Added to favorites!",
          icon: "Success",
          confirmButtonColor: "#5ac90fff"
        });
      }
    } catch (error) {
      console.error('Error:', error)
        Swal.fire({
          title: "Ooops...something goes wrong",
          text: "Failed to update favorites. Try again",
          icon: "warning",
          confirmButtonColor: "#DD003F"
        }); 
      // alert(error.response?.data?.error)
    } finally {
      setFavoriteLoading(prev => ({ ...prev, [filmId]: false }))
    }
  }

  if (loading) {
    return (
      <section className="relative bg-[#020d18] py-12 md:py-20">
        <div className="container mx-auto px-4 text-center text-white">
          Loading...
        </div>
      </section>
    )
  }

  if (films.length === 0) {
    return null
  }

  return (
    <section className="relative bg-[#020d18] py-12 md:py-20">
      <div className="container mx-auto px-4">
        {films.map((film) => {
          const releaseYear = film.releaseDate ? new Date(film.releaseDate).getFullYear() : 'N/A'
          const runtime = film.runtime ? `${Math.floor(film.runtime / 60)}h ${film.runtime % 60}'` : 'N/A'
          const releaseFormatted = film.releaseDate ? new Date(film.releaseDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'

          return (
            <div key={film.id} className="relative">
              {/* Background Image */}
              {film.backdropPath && (
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-20 -z-10"
                  style={{ backgroundImage: `url(${getImageUrl(film.backdropPath, 'original')})` }}
                />
              )}

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 text-white">
                  {/* Categories */}
                  {film.genres && film.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {film.genres.map((genre, index) => (
                        <Link
                          key={index}
                          href={`/films?genre=${genre.toLowerCase()}`}
                          className="inline-block px-4 py-1 text-xs md:text-sm uppercase font-medium rounded-full transition-colors
                                   bg-[#dcf836] text-[#020d18] hover:bg-white"
                        >
                          {genre}
                        </Link>
                      ))}
                    </div>
                  )}

                <div className="flex flex-col sm:flex-row gap-0 sm:gap-6">

                  <div className="relative aspect-2/3 sm:aspect-auto sm:h-full overflow-hidden">
                    <img
                      src={getImageUrl(film.backdropPath, 'w342') || '/images/uploads/mv-item1.jpg'}
                      alt={film.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 "
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent sm:hidden"></div>
                  </div>

                  <div className='flex-col'>
                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                      <Link href={`/movies/${film.id}`} className="hover:text-[#dcf836] transition-colors">
                        {film.title} <span className="text-[#abb7c4] font-normal">({releaseYear})</span>
                      </Link>
                    </h1>

                    {/* Overview */}
                    {film.overview && (
                      <p className="text-[#abb7c4] text-sm md:text-base mb-6 line-clamp-3">
                        {film.overview}
                      </p>
                    )}
                  </div>
                </div>
                  {/* Action Buttons */}
                  <div className="flex py-4 flex-wrap gap-4 mb-6">
                    <Link
                      href={`/movies/${film.id}`}
                      className="flex items-center gap-2 bg-[#dd003f] hover:bg-[#ff0f4f] text-white px-6 py-3 rounded-full transition-colors text-sm md:text-base font-medium"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      View Details
                    </Link>

                    <button
                      onClick={() => handleFavorite(film.id)}
                      disabled={favoriteLoading[film.id]}
                      className={`cursor-pointer flex items-center gap-2 px-6 py-3 rounded-full transition-all text-sm md:text-base font-medium ${
                        favoriteStates[film.id]
                          ? 'bg-red-600 border-2 border-red-600 hover:bg-red-700 hover:border-red-700 text-white'
                          : 'bg-transparent border-2 border-white hover:bg-white hover:text-[#020d18] text-white'
                      } ${favoriteLoading[film.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {favoriteStates[film.id] ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      )}
                      {favoriteLoading[film.id] ? 'Loading...' : favoriteStates[film.id] ? 'Remove from favorite' : 'Add to favorite'}
                    </button>
                  </div>
                

                  {/* Movie Details */}
                  <div className="flex flex-wrap items-center gap-4 md:gap-6">
                    {/* Rating */}
                    {film.averageRating > 0 && (
                      <>
                        <div className="flex items-center gap-2">
                          <svg className="w-6 h-6 text-[#f5b50a]" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <p className="text-lg md:text-xl">
                            <span className="font-bold text-white">{film.averageRating.toFixed(1)}</span>
                            <span className="text-[#abb7c4]"> /5</span>
                          </p>
                        </div>

                        {/* Separator */}
                        <span className="text-[#4b5661] hidden md:inline">|</span>
                      </>
                    )}

                    {/* Info Items */}
                    <ul className="flex flex-wrap items-center gap-4 text-sm md:text-base text-[#abb7c4]">
                      {runtime !== 'N/A' && <li>Run Time: <span className="text-white">{runtime}</span></li>}
                      {film.originalLanguage && <li>Language: <span className="text-white uppercase">{film.originalLanguage}</span></li>}
                      {releaseFormatted !== 'N/A' && <li>Release: <span className="text-white">{releaseFormatted}</span></li>}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}