import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// DELETE /api/ratings/[id]
export async function DELETE(request, { params }) {
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
    const { id } = await params

    // Get the rating to verify ownership and get filmId
    const rating = await prisma.rating.findUnique({
      where: { id: id }
    })

    if (!rating) {
      return NextResponse.json({ error: 'Rating not found' }, { status: 404 })
    }

    // Verify the rating belongs to the user
    if (rating.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden: You can only delete your own ratings' }, { status: 403 })
    }

    const filmId = rating.filmId

    // Delete the rating
    await prisma.rating.delete({
      where: { id: id }
    })

    // Recalculate film's average rating and total ratings
    const remainingRatings = await prisma.rating.findMany({
      where: { filmId: filmId }
    })

    const totalRatings = remainingRatings.length
    const averageRating = totalRatings > 0
      ? remainingRatings.reduce((sum, r) => sum + r.value, 0) / totalRatings
      : 0

    // Update film statistics
    await prisma.film.update({
      where: { id: filmId },
      data: {
        averageRating: averageRating,
        totalRatings: totalRatings
      }
    })

    return NextResponse.json({
      message: 'Rating deleted successfully',
      filmStats: {
        averageRating: averageRating,
        totalRatings: totalRatings
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Error in DELETE /api/ratings/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}