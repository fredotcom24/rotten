import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// GET /api/comments?filmId=xxx - Get all comments for a film
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const filmId = searchParams.get('filmId')

    if (!filmId) {
      return NextResponse.json(
        { error: 'Film ID is required' },
        { status: 400 }
      )
    }

    const comments = await prisma.comment.findMany({
      where: {
        filmId: filmId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(comments, { status: 200 })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// POST /api/comments - Create a new comment
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

    const { filmId, content } = await request.json()

    if (!filmId || !content) {
      return NextResponse.json(
        { error: 'Film ID and content are required' },
        { status: 400 }
      )
    }

    if (content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content cannot be empty' },
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

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        userId: decoded.userId,
        filmId: filmId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}
