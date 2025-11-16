'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import ReviewModal from '@/components/ReviewModal'
import axios from 'axios'
import Swal from 'sweetalert2'

export default function FilmDetailPage() {
  const { id } = useParams()
  const { user, getToken } = useAuth()
  const [film, setFilm] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [comments, setComments] = useState([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [editingComment, setEditingComment] = useState(null)
  const [trailerKey, setTrailerKey] = useState(null)

  useEffect(() => {
    fetchFilmDetails()
    fetchComments()
    if (user) {
      checkFavoriteStatus()
    }
  }, [id, user])

  useEffect(() => {
    if (film?.tmdbId) {
      fetchTrailer()
    }
  }, [film])

  const fetchFilmDetails = async () => {
    try {
      const response = await axios.get(`/api/films/${id}`)
      setFilm(response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTrailer = async () => {
    try {
      const response = await axios.get(`/api/films/${id}/trailer`)
      if (response.data.trailerKey) {
        setTrailerKey(response.data.trailerKey)
      }
    } catch (error) {
      console.error('Error fetching trailer:', error)
    }
  }

  const handleWatchTrailer = () => {
    if (trailerKey) {
      window.open(`https://www.youtube.com/watch?v=${trailerKey}`, '_blank')
    } else {
      alert('Trailer not available for this movie')
      Swal.fire({
        title: "Oops...",
        text: "You catch us. We still not have a trailer for this movie",
        icon: "warning",
        confirmButtonColor: "#5ac90fff"
      });
    }
  }

  const checkFavoriteStatus = async () => {
    try {
      const response = await axios.get(`/api/favorites/check?filmId=${id}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      })
      setIsFavorite(response.data.isFavorite)
    } catch (error) {
      console.error('Error checking favorite status:', error)
    }
  }

  const fetchComments = async () => {
    setCommentsLoading(true)
    try {
      const response = await axios.get(`/api/comments?filmId=${id}`)
      setComments(response.data)
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setCommentsLoading(false)
    }
  }

  const handleCreateComment = async (content) => {
    try {
      await axios.post('/api/comments', {
        filmId: id,
        content: content
      }, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      })
      fetchComments()
      Swal.fire({
        title: "Great... Success",
        text: "Review published successfully!",
        icon: "Success",
        confirmButtonColor: "#5ac90fff"
      });
    } catch (error) {
      console.error('Error creating comment:', error)
      alert(error.response?.data?.error)
      Swal.fire({
        title: "Oops...",
        text: "Something went wrong. Try again",
        icon: "warning",
        confirmButtonColor: "#DD003F"
      });
      throw error
    }
  }

  const handleUpdateComment = async (content) => {
    try {
      await axios.put(`/api/comments/${editingComment.id}`, {
        content: content
      }, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      })
      fetchComments()
      setEditingComment(null)
      Swal.fire({
        title: "Great... Success",
        text: "Review updated successfully!",
        icon: "Success",
        confirmButtonColor: "#5ac90fff"
      });
    } catch (error) {
      console.error('Error updating comment:', error)
      Swal.fire({
        title: "Unauthorized",
        text: "Please login to write a review",
        icon: "warning",
        confirmButtonColor: "#DD003F"
      });
      alert(error.response?.data?.error)
      throw error
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return
    }

    try {
      await axios.delete(`/api/comments/${commentId}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      })
      fetchComments()
      Swal.fire({
        title: "Great... Success",
        text: "Review deleted successfully!",
        icon: "Success",
        confirmButtonColor: "#5ac90fff"
      });
    } catch (error) {
      console.error('Error deleting comment:', error)
      Swal.fire({
        title: "Oops...",
        text: "Something went wrong. Try again",
        icon: "warning",
        confirmButtonColor: "#DD003F"
      });
      alert(error.response?.data?.error)
    }
  }

  const openReviewModal = () => {
    if (!user) {
      Swal.fire({
        title: "Unauthorized",
        text: "Please login to write a review",
        icon: "alert",
        confirmButtonColor: "#DD003F"
      }); 
      return
    }
    setEditingComment(null)
    setIsReviewModalOpen(true)
  }

  const openEditModal = (comment) => {
    setEditingComment(comment)
    setIsReviewModalOpen(true)
  }

  const handleRating = async (rating) => {
    if (!user) {
      Swal.fire({
        title: "Unauthorized",
        text: "Please login to rate this movie",
        icon: "alert",
        confirmButtonColor: "#DD003F"
      }); 
      return
    }

    try {
      await axios.post('/api/ratings', {
        filmId: id,
        value: rating
      }, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      })

      setUserRating(rating)
      fetchFilmDetails()
    } catch (error) {
      console.error('Error rating film:', error)
      alert(error.response?.data?.error)
      Swal.fire({
        title: "Oops...",
        text: "Something went wrong. Try again",
        icon: "warning",
        confirmButtonColor: "#DD003F"
      });
    }
  }

  const getImageUrl = (path, size = 'w185') => {
    if (!path) return null
    if (path.startsWith('/uploads')) return path
    if (path.startsWith('/')) return `https://image.tmdb.org/t/p/${size}${path}`
    return path
  }

  const handleFavorite = async () => {
    if (!user) {
      Swal.fire({
        title: "Unauthorized",
        text: "Please login to add to favorites",
        icon: "alert",
        confirmButtonColor: "#DD003F"
      });
      return
    }

    setFavoriteLoading(true)

    try {
      if (isFavorite) {
        // Remove from favorites
        await axios.delete('/api/favorites', {
          data: { filmId: id },
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        })
        setIsFavorite(false)
        Swal.fire({
          title: "Great... Success",
          text: "Removed from favorites!",
          icon: "Success",
          confirmButtonColor: "#5ac90fff"
        });
      } else {
        // Add to favorites
        await axios.post('/api/favorites', {
          filmId: id
        }, {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        })
        setIsFavorite(true)
        Swal.fire({
          title: "Great... Success",
          text: "Added to favorites!",
          icon: "Success",
          confirmButtonColor: "#5ac90fff"
        });

      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      alert(error.response?.data?.error || 'Failed to update favorites')
    } finally {
      setFavoriteLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0b1320] flex items-center justify-center">
          <div className="text-white text-2xl">Loading...</div>
        </div>
      </>
    )
  }

  if (!film) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0b1320] flex items-center justify-center">
          <div className="text-white text-2xl">Film not found</div>
        </div>
      </>
    )
  }

  const posterUrl = getImageUrl(film.posterPath, 'w500') || '/images/uploads/mv-item1.jpg'
  const backdropUrl = getImageUrl(film.backdropPath, 'original')

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px] bg-linear-to-b from-[#020d18] to-[#0b1320]">
        {backdropUrl && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${backdropUrl})` }}
            />
            <div className="absolute inset-0 bg-black/70"></div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="bg-[#0b1320] min-h-screen -mt-32 relative z-10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

            {/* Movie Poster */}
            <div className="lg:w-1/3 w-full">
              <div className="sticky top-4">
                <div className="relative rounded-lg overflow-hidden shadow-2xl">
                  <img
                    src={posterUrl} alt={film.title}
                    className="w-full h-auto object-cover"
                  />

                  {/* Action Buttons */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/90 to-transparent">
                    <div className="flex gap-3">
                      <button
                        onClick={handleWatchTrailer}
                        className="cursor-pointer flex-1 bg-[#dd003f] hover:bg-[#ff0050] text-white py-3 px-4 rounded-md font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                        </svg>
                        Watch Trailer
                      </button>
                      <button
                        onClick={handleFavorite}
                        disabled={favoriteLoading}
                        className={`cursor-pointer flex-1 py-3 px-4 rounded-md font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2 ${
                          isFavorite
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-[#dcf836] hover:bg-[#e5ff3d] text-[#020d18]'
                        } ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isFavorite ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                        )}
                        {favoriteLoading ? 'Loading...' : isFavorite ? 'Remove' : 'Favorite'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Movie Details */}
            <div className="lg:w-2/3 w-full">

              {/* Title and Year */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                {film.title}
                {film.releaseDate && (
                  <span className="text-[#abb7c4] ml-3 text-2xl md:text-3xl">
                    ({new Date(film.releaseDate).getFullYear()})
                  </span>
                )}
              </h1>

              {/* Social Buttons */}
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={handleFavorite}
                  disabled={favoriteLoading}
                  className={`cursor-pointer px-6 py-2 rounded-md transition-colors flex items-center gap-2 ${
                    isFavorite
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-[#233a50] hover:bg-[#2d4a63] text-white'
                  } ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isFavorite ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  )}
                  {favoriteLoading ? 'Loading...' : isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>

                <button
                  onClick={openReviewModal}
                  className="cursor-pointer px-6 py-2 bg-[#dcf836] hover:bg-[#e5ff3d] text-[#020d18] rounded-md transition-colors flex items-center gap-2 font-semibold"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Write a Review
                </button>
              </div>

              {/* Rating Section */}
              <div className="bg-[#020d18] rounded-lg p-6 mb-6 border border-[#233a50]">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">

                  {/* Average Rating */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <svg className="w-8 h-8 text-[#f5b50a]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <div className="ml-3">
                        <p className="text-white">
                          <span className="text-3xl font-bold">{film.averageRating?.toFixed(1) || 'N/A'}</span>
                          <span className="text-[#abb7c4] text-lg"> /5</span>
                        </p>
                        <p className="text-[#abb7c4] text-sm">{film.totalRatings || 0} Reviews</p>
                      </div>
                    </div>
                  </div>

                  {/* User Rating */}
                  <div className="flex-1 w-full md:w-auto">
                    <p className="text-[#abb7c4] mb-2">Rate this movie:</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="cursor-pointer transition-transform hover:scale-110"
                        >
                          <svg
                            className={`w-8 h-8 ${
                              star <= (hoverRating || userRating)
                                ? 'text-[#f5b50a]'
                                : 'text-[#405266]'
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

              {/* Tabs */}
              <div className="bg-[#020d18] rounded-lg overflow-hidden border border-[#233a50]">

                {/* Tab Headers */}
                <div className="flex overflow-x-auto border-b border-[#233a50] scrollbar-hide">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'reviews', label: 'Reviews' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-4 whitespace-nowrap font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'cursor-pointer text-white border-b-2 border-[#dd003f]'
                          : 'cursor-pointer text-[#abb7c4] hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-6">

                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">

                          {/* Description */}
                          <div>
                            <p className="text-[#abb7c4] leading-relaxed text-base">
                              {film.overview || 'No description available.'}
                            </p>
                          </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                          <div className="bg-[#0b1320] rounded-lg p-6 border border-[#233a50] space-y-4">
                            {film.director && (
                              <div>
                                <h6 className="text-[#abb7c4] text-sm mb-1">Director:</h6>
                                <p className="text-white">
                                  <a href="#" className="hover:text-[#dcf836]">{film.director}</a>
                                </p>
                              </div>
                            )}

                            {film.genres && film.genres.length > 0 && (
                              <div>
                                <h6 className="text-[#abb7c4] text-sm mb-1">Genres:</h6>
                                <p className="flex flex-wrap gap-2">
                                  {film.genres.map((genre, i) => (
                                    <a key={i} href="#" className="text-white hover:text-[#dcf836]">
                                      {genre}{i < film.genres.length - 1 ? ',' : ''}
                                    </a>
                                  ))}
                                </p>
                              </div>
                            )}

                            {film.releaseDate && (
                              <div>
                                <h6 className="text-[#abb7c4] text-sm mb-1">Release Date:</h6>
                                <p className="text-white">
                                  {new Date(film.releaseDate).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                            )}

                            {film.runtime && (
                              <div>
                                <h6 className="text-[#abb7c4] text-sm mb-1">Run Time:</h6>
                                <p className="text-white">{film.runtime} min</p>
                              </div>
                            )}

                            {film.originalLanguage && (
                              <div>
                                <h6 className="text-[#abb7c4] text-sm mb-1">Language:</h6>
                                <p className="text-white uppercase">{film.originalLanguage}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reviews Tab */}
                  {activeTab === 'reviews' && (
                    <div className="space-y-6">
                      {commentsLoading ? (
                        <div className="text-center text-[#abb7c4] py-12">
                          <p>Loading reviews...</p>
                        </div>
                      ) : comments.length === 0 ? (
                        <div className="text-center text-[#abb7c4] py-12">
                          <svg className="w-16 h-16 mx-auto mb-4 text-[#233a50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <p className="text-lg mb-2">No reviews yet</p>
                          <p className="text-sm">Be the first to share your thoughts about this movie!</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="bg-[#0b1320] rounded-lg p-6 border border-[#233a50] hover:border-[#2d4a63] transition-colors"
                            >
                              {/* Comment Header */}
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  {/* Avatar */}
                                  <div className="w-10 h-10 rounded-full bg-[#dd003f] flex items-center justify-center text-white font-semibold">
                                    {comment.user.name?.charAt(0).toUpperCase() || comment.user.email.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="text-white font-semibold">
                                      {comment.user.name || comment.user.email}
                                    </p>
                                    <p className="text-[#abb7c4] text-sm">
                                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                      })}
                                    </p>
                                  </div>
                                </div>

                                {/* Edit/Delete buttons for user's own comments */}
                                {user && comment.userId === user.id && (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => openEditModal(comment)}
                                      className="cursor-pointer p-2 text-[#abb7c4] hover:text-[#dcf836] transition-colors"
                                      title="Edit review"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => handleDeleteComment(comment.id)}
                                      className="cursor-pointer p-2 text-[#abb7c4] hover:text-red-500 transition-colors"
                                      title="Delete review"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Comment Content */}
                              <p className="text-[#abb7c4] leading-relaxed whitespace-pre-wrap">
                                {comment.content}
                              </p>

                              {/* Updated indicator */}
                              {comment.updatedAt !== comment.createdAt && (
                                <p className="text-[#abb7c4] text-xs mt-3 italic">
                                  (edited)
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false)
          setEditingComment(null)
        }}
        onSubmit={editingComment ? handleUpdateComment : handleCreateComment}
        initialContent={editingComment?.content || ''}
        isEditing={!!editingComment}
      />

      {/* Add custom scrollbar styles */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  )
}