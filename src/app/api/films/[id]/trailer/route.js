import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request, { params }) {
  try {
    const { id } = await params

    // Get film to retrieve tmdbId
    const film = await prisma.film.findUnique({
      where: { id },
      select: { tmdbId: true }
    })

    if (!film || !film.tmdbId) {
      return NextResponse.json(
        { error: 'Film not found or no TMDB ID available' },
        { status: 404 }
      )
    }

    // Fetch videos from TMDB
    const tmdbApiKey = process.env.TMDB_API_KEY
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${film.tmdbId}/videos?api_key=${tmdbApiKey}&language=en-US`
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch trailer from TMDB' },
        { status: 500 }
      )
    }

    const data = await response.json()

    // Find the first YouTube trailer
    const trailer = data.results?.find(
      (video) => video.type === 'Trailer' && video.site === 'YouTube'
    )

    if (!trailer) {
      return NextResponse.json(
        { trailerKey: null, message: 'No trailer available' },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { trailerKey: trailer.key },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching trailer:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
