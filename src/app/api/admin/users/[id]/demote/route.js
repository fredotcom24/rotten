import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/admin/users/[id]/demote
export async function POST(request, { params }) {
  try {
    const { session, error, status } = await requireAdmin(request)

    if (error) {
      return NextResponse.json({ error }, { status })
    }

    const { id } = await params

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user is already a regular user
    if (existingUser.role === 'USER') {
      return NextResponse.json(
        { error: 'User is already a regular user' },
        { status: 400 }
      )
    }

    // Prevent admin from demoting themselves
    if (session.userId === id) {
      return NextResponse.json(
        { error: 'You cannot demote yourself' },
        { status: 400 }
      )
    }

    // Demote admin to user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role: 'USER' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json(
      {
        message: 'User demoted to regular user successfully',
        user: updatedUser
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error demoting user:', error)
    return NextResponse.json(
      { error: 'Failed to demote user' },
      { status: 500 }
    )
  }
}
