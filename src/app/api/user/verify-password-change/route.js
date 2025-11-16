import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, validatePassword } from '@/lib/auth'

/**
 * POST /api/user/verify-password-change
 * Verify and complete password change
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const { token, newPassword } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    if (!newPassword) {
      return NextResponse.json(
        { error: 'New password is required' },
        { status: 400 }
      )
    }

    // validate password
    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      )
    }

    // find the password change request
    const changeRequest = await prisma.passwordChangeRequest.findUnique({
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
      await prisma.passwordChangeRequest.delete({
        where: { id: changeRequest.id }
      })

      return NextResponse.json(
        { error: 'Verification token has expired' },
        { status: 400 }
      )
    }

    // hash the new password
    const hashedPassword = await hashPassword(newPassword)

    // update user password
    await prisma.user.update({
      where: { id: changeRequest.userId },
      data: {
        password: hashedPassword
      }
    })

    // then delete the change request
    await prisma.passwordChangeRequest.delete({
      where: { id: changeRequest.id }
    })

    return NextResponse.json(
      {
        message: 'Password changed successfully'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to verify password change.' },
      { status: 500 }
    )
  }
}
