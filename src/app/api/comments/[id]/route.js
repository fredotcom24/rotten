import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// GET /api/comments/[id] - Get a single comment
export async function GET(request, { params }) {
  try {
    const { id } = await params

    const comment = await prisma.comment.findUnique({
      where: { id },
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

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(comment, { status: 200 })
  } catch (error) {
    console.error('Error fetching comment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comment' },
      { status: 500 }
    )
  }
}

// PUT /api/comments/[id] - Update a comment
export async function PUT(request, { params }) {
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

    const { id } = await params
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    if (content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content cannot be empty' },
        { status: 400 }
      )
    }

    // Check if comment exists
    const existingComment = await prisma.comment.findUnique({
      where: { id }
    })

    if (!existingComment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    // Check if user owns the comment
    if (existingComment.userId !== decoded.userId) {
      return NextResponse.json(
        { error: 'You can only update your own comments' },
        { status: 403 }
      )
    }

    // Update comment
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: {
        content: content.trim()
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

    return NextResponse.json(updatedComment, { status: 200 })
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    )
  }
}

// DELETE /api/comments/[id] - Delete a comment
export async function DELETE(request, { params }) {
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

    const { id } = await params

    // Check if comment exists
    const existingComment = await prisma.comment.findUnique({
      where: { id }
    })

    if (!existingComment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    // Check if user owns the comment
    if (existingComment.userId !== decoded.userId) {
      return NextResponse.json(
        { error: 'You can only delete your own comments' },
        { status: 403 }
      )
    }

    // Delete comment
    await prisma.comment.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Comment deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    )
  }
}
