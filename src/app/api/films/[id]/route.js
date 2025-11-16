import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/films/[id]
export async function GET(request, { params }) {
  try {
    const { id } = await params

    const film = await prisma.film.findUnique({
      where: { id },
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

    if (!film) {
      return NextResponse.json(
        { error: 'Film not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(film, { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch film', details: error.message },
      { status: 500 }
    )
  }
}
