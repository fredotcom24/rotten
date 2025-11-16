import { NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth'

/**
 * GET /api/auth/me
 */
export async function GET(request) {
  try {
    const session = await getSessionFromRequest(request)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized or expired token' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      user: {
        id: session.userId,
        email: session.email,
        name: session.name,
        role: session.role,
        createdAt: session.createdAt
      }
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to get user information' },
      { status: 500 }
    )
  }
}
