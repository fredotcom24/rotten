import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const genres = await prisma.film.findMany({
      select: { genres: true },
    })

    const allGenres = [
      ...new Set(genres.flatMap((film) => film.genres || [])),
    ]

    return NextResponse.json({ genres: allGenres }, { status: 200 })
  } catch (error) {
    console.error('Error fetching genres:', error)
    return NextResponse.json({ error: 'Failed to fetch genres' }, { status: 500 })
  }
}
