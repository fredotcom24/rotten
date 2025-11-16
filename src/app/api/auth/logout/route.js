import { NextResponse } from 'next/server'

/**
 * POST /api/auth/logout
 */
export async function POST(request) {
  try {
    
    return NextResponse.json({
      message: 'Logged out successfully',
      instructions: 'Please remove the token from your client storage'
    })

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}
