import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// POST /api/ratings
export async function POST(request) {
  try {
    // Verify user is authenticated
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const userId = decoded.userId

    // Parse request body
    const { filmId, value } = await request.json()

    // Validate input
    if (!filmId) {
      return NextResponse.json({ error: 'Film ID is required' }, { status: 400 })
    }

    if (!value || typeof value !== 'number' || value < 1 || value > 5) {
      return NextResponse.json({ error: 'Rating value must be between 1 and 5' }, { status: 400 })
    }

    // Check if film exists
    const film = await prisma.film.findUnique({
      where: { id: filmId }
    })

    if (!film) {
      return NextResponse.json({ error: 'Film not found' }, { status: 404 })
    }

    // Check if user already rated this film
    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_filmId: {
          userId: userId,
          filmId: filmId
        }
      }
    })

    let rating

    if (existingRating) {
      // Update existing rating
      rating = await prisma.rating.update({
        where: {
          userId_filmId: {
            userId: userId,
            filmId: filmId
          }
        },
        data: {
          value: value
        }
      })
    } else {
      // Create new rating
      rating = await prisma.rating.create({
        data: {
          value: value,
          userId: userId,
          filmId: filmId
        }
      })
    }

    // Recalculate film's average rating and total ratings
    const allRatings = await prisma.rating.findMany({
      where: { filmId: filmId }
    })

    const totalRatings = allRatings.length
    const averageRating = allRatings.reduce((sum, r) => sum + r.value, 0) / totalRatings

    // Update film statistics
    await prisma.film.update({
      where: { id: filmId },
      data: {
        averageRating: averageRating,
        totalRatings: totalRatings
      }
    })

    return NextResponse.json({
      message: existingRating ? 'Rating updated successfully' : 'Rating added successfully',
      rating: rating,
      filmStats: {
        averageRating: averageRating,
        totalRatings: totalRatings
      }
    }, { status: existingRating ? 200 : 201 })

  } catch (error) {
    console.error('Error in POST /api/ratings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/ratings - Get user's rating for a specific film
export async function GET(request) {
  try {
    // Verify user is authenticated
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const userId = decoded.userId

    // Get filmId from query parameters
    const { searchParams } = new URL(request.url)
    const filmId = searchParams.get('filmId')

    if (!filmId) {
      return NextResponse.json({ error: 'Film ID is required' }, { status: 400 })
    }

    // Get user's rating for this film
    const rating = await prisma.rating.findUnique({
      where: {
        userId_filmId: {
          userId: userId,
          filmId: filmId
        }
      }
    })

    if (!rating) {
      return NextResponse.json({ rating: null }, { status: 200 })
    }

    return NextResponse.json({ rating }, { status: 200 })

  } catch (error) {
    console.error('Error in GET /api/ratings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}