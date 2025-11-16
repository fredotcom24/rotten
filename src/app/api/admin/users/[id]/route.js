import { NextResponse } from 'next/server'
import { requireAdmin, hashPassword, isValidEmail, validatePassword } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/users/[id]
export async function GET(request, { params }) {
  try {
    const { session, error, status } = await requireAdmin(request)

    if (error) {
      return NextResponse.json({ error }, { status })
    }

    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            comments: true,
            ratings: true,
            favorites: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/users/[id]
export async function PATCH(request, { params }) {
  try {
    const { session, error, status } = await requireAdmin(request)

    if (error) {
      return NextResponse.json({ error }, { status })
    }

    const { id } = await params
    const body = await request.json()
    const { email, password, name, role, emailVerified } = body

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

    // prepare update data
    const updateData = {}

    // Validate and update email
    if (email !== undefined) {
      if (!isValidEmail(email)) {
        return NextResponse.json(
          { error: 'Invalid email address' },
          { status: 400 }
        )
      }

      // Check if email is already taken by another user
      if (email !== existingUser.email) {
        const emailTaken = await prisma.user.findUnique({
          where: { email }
        })

        if (emailTaken) {
          return NextResponse.json(
            { error: 'Email already in use' },
            { status: 409 }
          )
        }
      }

      updateData.email = email
    }

    // Validate and update password
    if (password) {
      const passwordValidation = validatePassword(password)
      if (!passwordValidation.valid) {
        return NextResponse.json(
          { error: passwordValidation.message },
          { status: 400 }
        )
      }

      updateData.password = await hashPassword(password)
    }

    // Update name
    if (name !== undefined) {
      updateData.name = name || null
    }

    // Validate and update role
    if (role !== undefined) {
      if (!['USER', 'ADMIN'].includes(role)) {
        return NextResponse.json(
          { error: 'Invalid role. Must be USER or ADMIN' },
          { status: 400 }
        )
      }

      updateData.role = role
    }

    // Update emailVerified
    if (emailVerified !== undefined) {
      updateData.emailVerified = Boolean(emailVerified)
    }

    // Perform update
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
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
        message: 'User updated successfully',
        user: updatedUser
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/users/[id]
export async function DELETE(request, { params }) {
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

    // Prevent admin from deleting themselves
    if (session.userId === id) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 }
      )
    }

    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
