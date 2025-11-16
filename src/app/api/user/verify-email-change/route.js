import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/user/verify-email-change
 * Verify and complete email change
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    // find the email change request
    const changeRequest = await prisma.emailChangeRequest.findUnique({
      where: {
        verificationToken: token
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    })

    if (!changeRequest) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      )
    }

    // check if token is expired
    if (changeRequest.tokenExpiry < new Date()) {
      await prisma.emailChangeRequest.delete({
        where: { id: changeRequest.id }
      })

      return NextResponse.json(
        { error: 'Verification token has expired' },
        { status: 400 }
      )
    }

    // check if new email is still available
    const existingUser = await prisma.user.findUnique({
      where: { email: changeRequest.newEmail }
    })

    if (existingUser) {
      await prisma.emailChangeRequest.delete({
        where: { id: changeRequest.id }
      })

      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
      )
    }

    // update user email
    const updatedUser = await prisma.user.update({
      where: { id: changeRequest.userId },
      data: {
        email: changeRequest.newEmail
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true
      }
    })

    // then delete the change request
    await prisma.emailChangeRequest.delete({
      where: { id: changeRequest.id }
    })

    return NextResponse.json(
      {
        message: 'Email changed successfully',
        user: updatedUser
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to verify email change.' },
      { status: 500 }
    )
  }
}
