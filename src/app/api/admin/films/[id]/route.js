import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/films/[id]
export async function GET(request, { params }) {
  try {
    const { error, status } = await requireAdmin(request)

    if (error) {
      return NextResponse.json({ error }, { status })
    }

    const { id } = await params

    const film = await prisma.film.findUnique({
      where: { id },
      include: {
        ratings: {
          select: {
            value: true,
            user: {
              select: {
                email: true,
                name: true
              }
            },
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        comments: {
          select: {
            id: true,
            content: true,
            user: {
              select: {
                email: true,
                name: true
              }
            },
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            comments: true,
            ratings: true,
            favorites: true
          }
        }
      }
    })

    if (!film) {
      return NextResponse.json(
        { error: 'Film not found' },
        { status: 404 }
      )
    }

    // calculate rating distribution
    const ratingDistribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    }

    film.ratings.forEach(rating => {
      ratingDistribution[rating.value] = (ratingDistribution[rating.value] || 0) + 1
    })

    return NextResponse.json({
      film: {
        ...film,
        statistics: {
          ratingDistribution,
          totalComments: film._count.comments,
          totalRatings: film._count.ratings,
          totalFavorites: film._count.favorites
        }
      }
    }, { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch film' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/films/[id]
export async function PATCH(request, { params }) {
  try {
    const { error, status } = await requireAdmin(request)

    if (error) {
      return NextResponse.json({ error }, { status })
    }

    const { id } = await params
    const body = await request.json()

    const existingFilm = await prisma.film.findUnique({
      where: { id }
    })

    if (!existingFilm) {
      return NextResponse.json(
        { error: 'Film not found' },
        { status: 404 }
      )
    }

    // prepare update data
    const updateData = {}

    if (body.title !== undefined) updateData.title = body.title
    if (body.overview !== undefined) updateData.overview = body.overview || null
    if (body.releaseDate !== undefined) {
      updateData.releaseDate = body.releaseDate ? new Date(body.releaseDate) : null
    }
    if (body.posterPath !== undefined) updateData.posterPath = body.posterPath || null
    if (body.backdropPath !== undefined) updateData.backdropPath = body.backdropPath || null
    if (body.runtime !== undefined) updateData.runtime = body.runtime ? parseInt(body.runtime) : null
    if (body.genres !== undefined) updateData.genres = body.genres || []
    if (body.director !== undefined) updateData.director = body.director || null
    if (body.originalLanguage !== undefined) updateData.originalLanguage = body.originalLanguage || null
    if (body.tmdbId !== undefined) updateData.tmdbId = body.tmdbId ? parseInt(body.tmdbId) : null

    // validate title
    if (updateData.title === '') {
      return NextResponse.json(
        { error: 'Title cannot be empty' },
        { status: 400 }
      )
    }

    const updatedFilm = await prisma.film.update({
      where: { id },
      data: updateData,
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
        message: 'Film updated successfully',
        film: updatedFilm
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to update film' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/films/[id]
export async function DELETE(request, { params }) {
  try {
    const { error, status } = await requireAdmin(request)

    if (error) {
      return NextResponse.json({ error }, { status })
    }

    const { id } = await params

    const existingFilm = await prisma.film.findUnique({
      where: { id }
    })

    if (!existingFilm) {
      return NextResponse.json(
        { error: 'Film not found' },
        { status: 404 }
      )
    }

    await prisma.film.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Film deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to delete film' },
      { status: 500 }
    )
  }
}
