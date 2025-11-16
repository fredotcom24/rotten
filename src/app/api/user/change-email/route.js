import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isValidEmail, verifyToken } from '@/lib/auth'
import { sendEmailChangeVerification, generateVerificationToken } from '@/lib/email'

/**
 * POST /api/user/change-email
 * Email change with verification
 */
export async function POST(request) {
  try {
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
    const { newEmail } = body

    if (!newEmail) {
      return NextResponse.json(
        { error: 'New email is required' },
        { status: 400 }
      )
    }

    if (!isValidEmail(newEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const normalizedNewEmail = newEmail.toLowerCase().trim()

    // check if new email is already used
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedNewEmail }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
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

    if (user.email === normalizedNewEmail) {
      return NextResponse.json(
        { error: 'New email must be different from current email' },
        { status: 400 }
      )
    }

    // delete any existing email change requests for this user
    await prisma.emailChangeRequest.deleteMany({
      where: { userId: user.id }
    })

    // create email change request
    const verificationToken = generateVerificationToken()
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await prisma.emailChangeRequest.create({
      data: {
        userId: user.id,
        newEmail: normalizedNewEmail,
        verificationToken,
        tokenExpiry
      }
    })

    // send verification email
    try {
      await sendEmailChangeVerification(
        user.email,
        normalizedNewEmail,
        verificationToken,
        user.name
      )
    } catch (emailError) {
      console.error('Failed to send email change verification:', emailError)
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'Verification email sent. Please check your new email address to confirm the change.'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to process email change request.' },
      { status: 500 }
    )
  }
}
