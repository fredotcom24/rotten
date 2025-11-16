import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/films
export async function GET(request) {
  try {
    const { error, status } = await requireAdmin(request)

    if (error) {
      return NextResponse.json({ error }, { status })
    }

    const films = await prisma.film.findMany({
      include: {
        _count: {
          select: {
            comments: true,
            ratings: true,
            favorites: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ films }, { status: 200 })
  } catch (error) {
    console.error('Error fetching films:', error)
    return NextResponse.json(
      { error: 'Failed to fetch films' },
      { status: 500 }
    )
  }
}

// POST /api/admin/films
export async function POST(request) {
  try {
    const { session, error, status } = await requireAdmin(request)

    if (error) {
      return NextResponse.json({ error }, { status })
    }

    const body = await request.json()
    const {
      title,
      overview,
      releaseDate,
      posterPath,
      backdropPath,
      runtime,
      genres,
      director,
      originalLanguage,
      tmdbId
    } = body

    // validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // check if film with same tmdbId already exists
    if (tmdbId) {
      const existingFilm = await prisma.film.findUnique({
        where: { tmdbId: parseInt(tmdbId) }
      })

      if (existingFilm) {
        return NextResponse.json(
          { error: 'Film with this TMDB ID already exists' },
          { status: 409 }
        )
      }
    }

    // create film
    const newFilm = await prisma.film.create({
      data: {
        title,
        overview: overview || null,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        posterPath: posterPath || null,
        backdropPath: backdropPath || null,
        runtime: runtime ? parseInt(runtime) : null,
        genres: genres || [],
        director: director || null,
        originalLanguage: originalLanguage || null,
        tmdbId: tmdbId ? parseInt(tmdbId) : null
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
        message: 'Film created successfully',
        film: newFilm
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to create film' },
      { status: 500 }
    )
  }
}
