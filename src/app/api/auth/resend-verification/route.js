import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail, generateVerificationToken } from '@/lib/email'
import { isValidEmail } from '@/lib/auth'

/**
 * POST /api/auth/resend-verification
 * Resend email verification link
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'If an account exists with this email, a verification link will be sent.' },
        { status: 200 }
      )
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      )
    }

    // generate new verification token
    const verificationToken = generateVerificationToken()
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        tokenExpiry
      }
    })

    // send verification email
    try {
      await sendVerificationEmail(user.email, verificationToken, user.name)
    } catch (emailError) {
      console.error('Error:', emailError)
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Verification email sent successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to resend verification email. Please try again.' },
      { status: 500 }
    )
  }
}
