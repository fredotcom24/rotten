import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/admin/users/[id]/promote
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

    // Check if user is already an admin
    if (existingUser.role === 'ADMIN') {
      return NextResponse.json(
        { error: 'User is already an admin' },
        { status: 400 }
      )
    }

    // Promote user to admin
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role: 'ADMIN' },
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
        message: 'User promoted to admin successfully',
        user: updatedUser
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error promoting user:', error)
    return NextResponse.json(
      { error: 'Failed to promote user' },
      { status: 500 }
    )
  }
}
