import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const films = await prisma.film.findMany({
      select: { originalLanguage: true },
    })

    const languages = [...new Set(films.map((f) => f.originalLanguage).filter(Boolean))]

    return NextResponse.json({ languages }, { status: 200 })
  } catch (error) {
    console.error('Error fetching languages:', error)
    return NextResponse.json({ error: 'Failed to fetch languages' }, { status: 500 })
  }
}
