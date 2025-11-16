'use client'

import {useState, useEffect} from 'react'
import {useRouter, useParams} from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'

export default function EditFilmPage() {
  const router = useRouter()
  const params = useParams()
  const filmId = params.id

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadingPoster, setUploadingPoster] = useState(false)
  const [uploadingBackdrop, setUploadingBackdrop] = useState(false)
  const [genreInput, setGenreInput] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    overview: '',
    releaseDate: '',
    posterPath: '',
    backdropPath: '',
    runtime: '',
    genres: [],
    director: '',
    originalLanguage: ''
  })

  const commonGenres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
    'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music',
    'Mystery', 'Romance', 'Science Fiction', 'Thriller', 'War', 'Western'
  ]

  useEffect(() => {
    fetchFilm()
  }, [filmId])

  const fetchFilm = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`/api/admin/films/${filmId}`, {
        headers: {'Authorization': `Bearer ${token}`}
      })

      const film = response.data.film
      setFormData({
        title: film.title,
        overview: film.overview || '',
        releaseDate: film.releaseDate ? new Date(film.releaseDate).toISOString().split('T')[0] : '',
        posterPath: film.posterPath || '',
        backdropPath: film.backdropPath || '',
        runtime: film.runtime || '',
        genres: film.genres || [],
        director: film.director || '',
        originalLanguage: film.originalLanguage || ''
      })
      setLoading(false)
    } catch(err) {
      setError(err.response?.data?.error || 'Failed to load film')
      setLoading(false)
    }
  }

  const getImageUrl = (path, size = 'w185') => {
    if(!path) return null
    if(path.startsWith('/uploads')) return path
    if(path.startsWith('/')) return `https://image.tmdb.org/t/p/${size}${path}`
    return path
  }

  const addGenre = (genre) => {
    if(genre && !formData.genres.includes(genre)) {
      setFormData({...formData, genres: [...formData.genres, genre]})
    }
    setGenreInput('')
  }

  const removeGenre = (genreToRemove) => {
    setFormData({
      ...formData,
      genres: formData.genres.filter(g => g !== genreToRemove)
    })
  }

  const handleFileUpload = async (file, type = 'poster') => {
    if(!file) return

    try {
      if(type === 'poster') {
        setUploadingPoster(true)
      } else {
        setUploadingBackdrop(true)
      }

      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const token = localStorage.getItem('token')
      const response = await axios.post('/api/admin/upload', formDataUpload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      if(type === 'poster') {
        setFormData({...formData, posterPath: response.data.url})
      } else {
        setFormData({...formData, backdropPath: response.data.url})
      }

      setSuccessMessage(`${type === 'poster' ? 'Poster' : 'Backdrop'} uploaded successfully`)
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch(err) {
      setError(err.response?.data?.error || 'Failed to upload file')
    } finally {
      if(type === 'poster') {
        setUploadingPoster(false)
      } else {
        setUploadingBackdrop(false)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setUploading(true)

    try {
      const token = localStorage.getItem('token')
      await axios.patch(`/api/admin/films/${filmId}`, formData, {
        headers: {'Authorization': `Bearer ${token}`}
      })

      setSuccessMessage('Film updated successfully! Redirecting...')
      setTimeout(() => {
        router.push('/admin/films')
      }, 1500)
    } catch(err) {
      setError(err.response?.data?.error || 'Failed to update film')
      setUploading(false)
    }
  }

  if(loading) {
    return (
      <div className="min-h-screen bg-[#0b1320] flex items-center justify-center">
        <div className="text-xl text-white">Loading film...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0b1320] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Edit film</h1>
          <Link href="/admin/films" className="text-[#dcf836] hover:text-[#e5ff3d] transition-colors">
            Back to films
          </Link>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded mb-4">{error}</div>}
        {successMessage && <div className="bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded mb-4">{successMessage}</div>}

        <div className="bg-[#020d18] border border-[#233a50] rounded-lg shadow p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#abb7c4] mb-2">Title *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-[#0b1320] border border-[#233a50] rounded-lg text-white placeholder-[#405266] focus:outline-none focus:ring-2 focus:ring-[#dd003f] focus:border-[#dd003f]"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#abb7c4] mb-2">Director</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-[#0b1320] border border-[#233a50] rounded-lg text-white placeholder-[#405266] focus:outline-none focus:ring-2 focus:ring-[#dd003f] focus:border-[#dd003f]"
                  value={formData.director}
                  onChange={(e) => setFormData({...formData, director: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#abb7c4] mb-2">Overview</label>
              <textarea
                rows="4"
                className="w-full px-3 py-2 bg-[#0b1320] border border-[#233a50] rounded-lg text-white placeholder-[#405266] focus:outline-none focus:ring-2 focus:ring-[#dd003f] focus:border-[#dd003f]"
                value={formData.overview}
                onChange={(e) => setFormData({...formData, overview: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#abb7c4] mb-2">Release Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 bg-[#0b1320] border border-[#233a50] rounded-lg text-white placeholder-[#405266] focus:outline-none focus:ring-2 focus:ring-[#dd003f] focus:border-[#dd003f]"
                  value={formData.releaseDate}
                  onChange={(e) => setFormData({...formData, releaseDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#abb7c4] mb-2">Runtime (minutes)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 bg-[#0b1320] border border-[#233a50] rounded-lg text-white placeholder-[#405266] focus:outline-none focus:ring-2 focus:ring-[#dd003f] focus:border-[#dd003f]"
                  value={formData.runtime}
                  onChange={(e) => setFormData({...formData, runtime: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#abb7c4] mb-2">Poster Image</label>
              <div className="space-y-2">
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-[#0b1320] border border-[#233a50] rounded-lg text-white placeholder-[#405266] focus:outline-none focus:ring-2 focus:ring-[#dd003f] focus:border-[#dd003f]"
                  value={formData.posterPath}
                  onChange={(e) => setFormData({...formData, posterPath: e.target.value})}
                  placeholder="TMDB path or local URL"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#abb7c4]">Or upload:</span>
                  <label className="cursor-pointer bg-[#233a50] text-white px-4 py-2 rounded-lg hover:bg-[#2d4a63] text-sm transition-colors">
                    {uploadingPoster ? 'Uploading...' : 'Choose file'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files[0], 'poster')}
                      disabled={uploadingPoster}
                    />
                  </label>
                </div>
                {formData.posterPath && (
                  <img
                    src={getImageUrl(formData.posterPath)}
                    alt="Preview"
                    className="h-48 object-cover rounded border border-[#233a50]"
                    onError={(e) => {e.target.style.display = 'none'}}
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#abb7c4] mb-2">Backdrop Image (optional)</label>
              <div className="space-y-2">
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-[#0b1320] border border-[#233a50] rounded-lg text-white placeholder-[#405266] focus:outline-none focus:ring-2 focus:ring-[#dd003f] focus:border-[#dd003f]"
                  value={formData.backdropPath}
                  onChange={(e) => setFormData({...formData, backdropPath: e.target.value})}
                  placeholder="TMDB path or local URL"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#abb7c4]">Or upload:</span>
                  <label className="cursor-pointer bg-[#233a50] text-white px-4 py-2 rounded-lg hover:bg-[#2d4a63] text-sm transition-colors">
                    {uploadingBackdrop ? 'Uploading...' : 'Choose file'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files[0], 'backdrop')}
                      disabled={uploadingBackdrop}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#abb7c4] mb-2">Language</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-[#0b1320] border border-[#233a50] rounded-lg text-white placeholder-[#405266] focus:outline-none focus:ring-2 focus:ring-[#dd003f] focus:border-[#dd003f]"
                value={formData.originalLanguage}
                onChange={(e) => setFormData({...formData, originalLanguage: e.target.value})}
                placeholder="e.g., en, fr, es"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#abb7c4] mb-2">Genres</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 bg-[#0b1320] border border-[#233a50] rounded-lg text-white placeholder-[#405266] focus:outline-none focus:ring-2 focus:ring-[#dd003f] focus:border-[#dd003f]"
                  value={genreInput}
                  onChange={(e) => setGenreInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGenre(genreInput))}
                  placeholder="Type a genre and press Enter"
                />
                <button
                  type="button"
                  onClick={() => addGenre(genreInput)}
                  className="cursor-pointer bg-[#233a50] text-white px-4 py-2 rounded-lg hover:bg-[#2d4a63] transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {commonGenres.map(genre => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => addGenre(genre)}
                    className="cursor-pointer text-xs px-3 py-1 bg-[#233a50] text-[#abb7c4] rounded-full hover:bg-[#2d4a63] hover:text-white transition-colors"
                  >
                    {genre}
                  </button>
                ))}
              </div>
              {formData.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 bg-[#0b1320] rounded border border-[#233a50]">
                  {formData.genres.map(genre => (
                    <span key={genre} className="inline-flex items-center gap-1 px-3 py-1 bg-[#dcf836]/20 text-[#dcf836] rounded-full text-sm border border-[#dcf836]/30">
                      {genre}
                      <button
                        type="button"
                        onClick={() => removeGenre(genre)}
                        className="cursor-pointer text-[#dcf836] hover:text-[#e5ff3d] font-bold"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={uploading}
                className="cursor-pointer flex-1 bg-[#dd003f] text-white py-3 rounded-lg hover:bg-[#ff0050] disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {uploading ? 'Updating...' : 'Update film'}
              </button>
              <Link
                href="/admin/films"
                className="flex-1 bg-[#233a50] text-white py-3 rounded-lg hover:bg-[#2d4a63] text-center font-medium transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
