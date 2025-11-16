import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import axios from 'axios'

// GET /api/admin/films/search-tmdb?query=movie_name
export async function GET(request) {
  try {
    const { error, status } = await requireAdmin(request)

    if (error) {
      return NextResponse.json({ error }, { status })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    const TMDB_API_KEY = process.env.TMDB_API_KEY
    const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3'

    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
        language: 'en-US',
        page: 1
      }
    })

    return NextResponse.json({
      results: response.data.results
    }, { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    
    return NextResponse.json(
      { error: 'Failed to search TMDB' },
      { status: 500 }
    )
  }
}
