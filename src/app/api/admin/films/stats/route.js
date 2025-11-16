import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/films/stats
export async function GET(request) {
  try {
    const { session, error, status } = await requireAdmin(request)

    if (error) {
      return NextResponse.json({ error }, { status })
    }

    // Get total films count
    const totalFilms = await prisma.film.count()

    // Get films with most ratings
    const topRatedFilms = await prisma.film.findMany({
      orderBy: {
        totalRatings: 'desc'
      },
      take: 5,
      select: {
        id: true,
        title: true,
        averageRating: true,
        totalRatings: true,
        posterPath: true
      }
    })

    // Get films with highest average rating
    const bestRatedFilms = await prisma.film.findMany({
      where: {
        totalRatings: {
          gte: 5
        }
      },
      orderBy: {
        averageRating: 'desc'
      },
      take: 5,
      select: {
        id: true,
        title: true,
        averageRating: true,
        totalRatings: true,
        posterPath: true
      }
    })

    // Get films with most comments
    const mostCommentedFilms = await prisma.film.findMany({
      orderBy: {
        comments: {
          _count: 'desc'
        }
      },
      take: 5,
      select: {
        id: true,
        title: true,
        posterPath: true,
        _count: {
          select: {
            comments: true
          }
        }
      }
    })

    // Get films with most favorites
    const mostFavoritedFilms = await prisma.film.findMany({
      orderBy: {
        favorites: {
          _count: 'desc'
        }
      },
      take: 5,
      select: {
        id: true,
        title: true,
        posterPath: true,
        _count: {
          select: {
            favorites: true
          }
        }
      }
    })

    // Get total ratings count
    const totalRatings = await prisma.rating.count()

    // Get total comments count
    const totalComments = await prisma.comment.count()

    // Get recent films
    const recentFilms = await prisma.film.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 5,
      select: {
        id: true,
        title: true,
        createdAt: true,
        posterPath: true
      }
    })

    return NextResponse.json({
      overview: {
        totalFilms,
        totalRatings,
        totalComments,
        averageRatingsPerFilm: totalFilms > 0 ? (totalRatings / totalFilms).toFixed(2) : 0
      },
      topRatedFilms,
      bestRatedFilms,
      mostCommentedFilms,
      mostFavoritedFilms,
      recentFilms
    }, { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch film statistics' },
      { status: 500 }
    )
  }
}
