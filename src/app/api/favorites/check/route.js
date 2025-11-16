import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// GET /api/favorites/check?filmId=xxx
export async function GET(request) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { isFavorite: false },
        { status: 200 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { isFavorite: false },
        { status: 200 }
      )
    }

    const { searchParams } = new URL(request.url)
    const filmId = searchParams.get('filmId')

    if (!filmId) {
      return NextResponse.json(
        { error: 'Film ID is required' },
        { status: 400 }
      )
    }

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_filmId: {
          userId: decoded.userId,
          filmId: filmId
        }
      }
    })

    return NextResponse.json(
      { isFavorite: !!favorite },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error checking favorite:', error)
    return NextResponse.json(
      { error: 'Failed to check favorite status', isFavorite: false },
      { status: 500 }
    )
  }
}
