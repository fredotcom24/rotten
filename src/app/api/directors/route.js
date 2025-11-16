import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const directors = await prisma.film.findMany({
      select: { director: true },
    })

    const allDirectors = [
      ...new Set(directors.flatMap((film) => film.director || [])),
    ]

    return NextResponse.json({ directors: allDirectors }, { status: 200 })
  } catch (error) {
    console.error('Error fetching directors:', error)
    return NextResponse.json({ error: 'Failed to fetch directors' }, { status: 500 })
  }
}
