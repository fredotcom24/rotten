import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, validateRegisterData } from '@/lib/auth'
import { sendVerificationEmail, generateVerificationToken } from '@/lib/email'

/**
 * POST /api/auth/register
 * Register user
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    const validation = validateRegisterData({ email, password, name })
    if (!validation.valid) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validation.errors 
        },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    const hashedPassword = await hashPassword(password)
    const verificationToken = generateVerificationToken()
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: name?.trim() || null,
        role: 'USER',
        emailVerified: false,
        verificationToken,
        tokenExpiry
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

    // send verification email
    try {
      await sendVerificationEmail(user.email, verificationToken, user.name)
    } catch (emailError) {
      console.error('Error:', emailError)
    }

    return NextResponse.json(
      {
        message: 'Account created successfully. Please check your email to verify your account.',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to register user. Please try again.' },
      { status: 500 }
    )
  }
}
