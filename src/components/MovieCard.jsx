'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import axios from 'axios'
import Swal from 'sweetalert2'

export default function MovieCard({ movie, onRatingUpdate }) {
  const { user, getToken } = useAuth()
  const [hoverRating, setHoverRating] = useState(0)
  const [userRating, setUserRating] = useState(0)

  const getImageUrl = (path, size = 'w185') => {
    if (!path) return null
    if (path.startsWith('/uploads')) return path
    if (path.startsWith('/')) return `https://image.tmdb.org/t/p/${size}${path}`
    return path
  }

  // Handle TMDB poster path or fallback
  const posterUrl = getImageUrl(movie.posterPath, 'w342') || movie.image || '/images/uploads/mv-item1.jpg'

  const rating = movie.averageRating || movie.rating || 0

  const handleRating = async (ratingValue, e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      Swal.fire({
        title: "Unauthorized",
        text: "Please login to rate this movie",
        icon: "warning",
        confirmButtonColor: "#DD003F"
      })
      return
    }

    try {
      await axios.post('/api/ratings', {
        filmId: movie.id,
        value: ratingValue
      }, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      })

      setUserRating(ratingValue)

      Swal.fire({
        title: "Success!",
        text: `You rated this movie ${ratingValue}/5`,
        icon: "success",
        confirmButtonColor: "#5ac90fff",
        timer: 2000
      })

      // Call callback to refresh movie data if provided
      if (onRatingUpdate) {
        onRatingUpdate()
      }
    } catch (error) {
      console.error('Error:', error)
      Swal.fire({
        title: "Oops...",
        text: error.response?.data?.error || "Failed to rate movie. Try again",
        icon: "error",
        confirmButtonColor: "#DD003F"
      })
    }
  }

  return (
    <div className="group bg-[#020d18] rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105">
      {/* Movie Poster */}
      <div className="relative w-full h-100 rounded-full overflow-hidden">
        <Image
          src={posterUrl}
          alt={movie.title}
          fill
          className="object-contain"
        />

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-linear-to-t from-[#020d18] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
          <Link
            href={`/movies/${movie.id}`}
            className="flex items-center gap-2 text-white text-sm font-medium hover:text-[#dcf836] transition-colors"
          >
            View more
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-4 bg-[#dd003f]">
        <h6 className="text-white text-base font-bold mb-3 truncate">
          <Link href={`/movies/${movie.id}`} className="hover:text-[#dcf836] transition-colors">
            {movie.title}
          </Link>
        </h6>

        {/* Average Rating Display */}
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-[#f5b50a]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <p className="text-sm">
            <span className="text-white font-medium">{rating > 0 ? rating.toFixed(1) : 0}</span>
            <span className="text-[#020d18] font-bold"> /5</span>
          </p>
        </div>

        {/* Interactive Rating Stars */}
        <div className="flex flex-col gap-1">
          <p className="text-xs text-[#020d18] font-semibold">Rate this movie:</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={(e) => handleRating(star, e)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                title={`Rate ${star}/5`}
              >
                <svg
                  className={`w-5 h-5 ${
                    star <= (hoverRating || userRating)
                      ? 'text-[#f5b50a]'
                      : 'text-white/30'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}