import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import axios from 'axios'

// POST /api/admin/films/import-tmdb
export async function POST(request) {
  try {
    const { session, error, status } = await requireAdmin(request)

    if (error) {
      return NextResponse.json({ error }, { status })
    }

    const body = await request.json()
    const { tmdbId } = body

    if (!tmdbId) {
      return NextResponse.json(
        { error: 'TMDB ID is required' },
        { status: 400 }
      )
    }

    const TMDB_API_KEY = process.env.TMDB_API_KEY
    const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3'

    // Check if film already exists in database
    const existingFilm = await prisma.film.findUnique({
      where: { tmdbId: parseInt(tmdbId) }
    })

    if (existingFilm) {
      return NextResponse.json(
        { error: 'Film already exists in database', film: existingFilm },
        { status: 409 }
      )
    }

    // Fetch movie details from TMDB
    const movieResponse = await axios.get(`${TMDB_BASE_URL}/movie/${tmdbId}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US'
      }
    })

    const movieData = movieResponse.data

    // Fetch movie director and cast
    const creditsResponse = await axios.get(`${TMDB_BASE_URL}/movie/${tmdbId}/credits`, {
      params: {
        api_key: TMDB_API_KEY
      }
    })

    const { crew } = creditsResponse.data
    const director = crew.find((person) => person.job === 'Director')?.name || null

    // extract genres
    const genres = movieData.genres ? movieData.genres.map(g => g.name) : []

    // create film in database
    const newFilm = await prisma.film.create({
      data: {
        tmdbId: parseInt(tmdbId),
        title: movieData.title,
        overview: movieData.overview || null,
        releaseDate: movieData.release_date ? new Date(movieData.release_date) : null,
        posterPath: movieData.poster_path || null,
        backdropPath: movieData.backdrop_path || null,
        runtime: movieData.runtime || null,
        genres,
        director,
        originalLanguage: movieData.original_language || null
      },
      include: {
        _count: {
          select: {
            comments: true,
            ratings: true,
            favorites: true
          }
        }
      }
    })

    return NextResponse.json(
      {
        message: 'Film added successfully from TMDB',
        film: newFilm
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error:', error)

    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: 'Film not found on TMDB' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to import film from TMDB' },
      { status: 500 }
    )
  }
}
