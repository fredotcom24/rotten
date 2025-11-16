import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, validatePassword } from '@/lib/auth'
import { sendPasswordChangeVerification, generateVerificationToken } from '@/lib/email'

/**
 * POST /api/user/change-password
 * Password change with verification
 */
export async function POST(request) {
  try {
    // verify authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const userId = decoded.userId

    const body = await request.json()
    const { newPassword } = body

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

    // get current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // delete any existing password change requests for the user
    await prisma.passwordChangeRequest.deleteMany({
      where: { userId: user.id }
    })

    // create password change request with the new password stored temporarily
    const verificationToken = generateVerificationToken()
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await prisma.passwordChangeRequest.create({
      data: {
        userId: user.id,
        verificationToken,
        tokenExpiry
      }
    })

    // send verification email
    try {
      await sendPasswordChangeVerification(
        user.email,
        verificationToken,
        user.name
      )
    } catch (emailError) {
      console.error('Error:', emailError)
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'Verification email sent. Please check your email to confirm the password change.',
        verificationToken
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Password change request error:', error)
    return NextResponse.json(
      { error: 'Failed to process password change request.' },
      { status: 500 }
    )
  }
}
