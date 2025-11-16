import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// GET /api/favorites - Get all favorites for the current user
export async function GET(request) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: decoded.userId
      },
      include: {
        film: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(favorites, { status: 200 })
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
}

// POST /api/favorites - Add a film to favorites
export async function POST(request) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { filmId } = await request.json()

    if (!filmId) {
      return NextResponse.json(
        { error: 'Film ID is required' },
        { status: 400 }
      )
    }

    // Check if film exists
    const film = await prisma.film.findUnique({
      where: { id: filmId }
    })

    if (!film) {
      return NextResponse.json(
        { error: 'Film not found' },
        { status: 404 }
      )
    }

    // Check if already in favorites
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_filmId: {
          userId: decoded.userId,
          filmId: filmId
        }
      }
    })

    if (existingFavorite) {
      return NextResponse.json(
        { error: 'Film already in favorites' },
        { status: 400 }
      )
    }

    // Create favorite
    const favorite = await prisma.favorite.create({
      data: {
        userId: decoded.userId,
        filmId: filmId
      },
      include: {
        film: true
      }
    })

    return NextResponse.json(favorite, { status: 201 })
  } catch (error) {
    console.error('Error adding to favorites:', error)
    return NextResponse.json(
      { error: 'Failed to add to favorites' },
      { status: 500 }
    )
  }
}

// DELETE /api/favorites - Remove a film from favorites
export async function DELETE(request) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { filmId } = await request.json()

    if (!filmId) {
      return NextResponse.json(
        { error: 'Film ID is required' },
        { status: 400 }
      )
    }

    // Check if favorite exists
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_filmId: {
          userId: decoded.userId,
          filmId: filmId
        }
      }
    })

    if (!favorite) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      )
    }

    // Delete favorite
    await prisma.favorite.delete({
      where: {
        id: favorite.id
      }
    })

    return NextResponse.json(
      { message: 'Removed from favorites' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error removing from favorites:', error)
    return NextResponse.json(
      { error: 'Failed to remove from favorites' },
      { status: 500 }
    )
  }
}
