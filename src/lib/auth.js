import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'


// Hash password with bcrypt
export async function hashPassword(password) {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

// Verify password
export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword)
}

// Generate a JWT token
export function generateToken(userId, role) {
  const payload = {
    userId,
    role,
    iat: Math.floor(Date.now() / 1000)
  }

  const secret = process.env.NEXTAUTH_SECRET
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d'

  if (!secret) {
    throw new Error('NEXTAUTH_SECRET is not defined in environment variables')
  }

  return jwt.sign(payload, secret, { expiresIn })
}

// Verify and decode a JWT token
export function verifyToken(token) {
  try {
    const secret = process.env.NEXTAUTH_SECRET
    if (!secret) {
      throw new Error('NEXTAUTH_SECRET is not defined')
    }
    return jwt.verify(token, secret)
  } catch (error) {
    console.error('Token verification failed:', error.message)
    return null
  }
}

// Get a session from HTTP request
export async function getSessionFromRequest(request) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    
    const decoded = verifyToken(token)
    if (!decoded) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    })

    if (!user) {
      return null
    }

    // return session
    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt
    }
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

// Auth Middleware
export async function requireAuth(request) {
  const session = await getSessionFromRequest(request)
  
  if (!session) {
    return {
      error: 'Unauthorized - Please login',
      status: 401,
      session: null
    }
  }

  return { session }
}

// Admin Middleware
export async function requireAdmin(request) {
  const { session, error, status } = await requireAuth(request)
  
  if (error) {
    return { error, status, session: null }
  }

  if (session.role !== 'ADMIN') {
    return {
      error: 'Forbidden - Admin access required',
      status: 403,
      session: null
    }
  }

  return { session }
}

// Validate email
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return email && emailRegex.test(email)
}

// Validate password
export function validatePassword(password) {
  if (!password) {
    return { valid: false, message: 'Password is required' }
  }
  
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' }
  }
  
  if (password.length > 100) {
    return { valid: false, message: 'Password is too long (max 100 characters)' }
  }
  
  return { valid: true }
}

// Validate registration form
export function validateRegisterData(data) {
  const errors = {}
  
  // email
  if (!data.email) {
    errors.email = 'Email is required'
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Invalid email format'
  }
  
  // password
  const passwordValidation = validatePassword(data.password)
  if (!passwordValidation.valid) {
    errors.password = passwordValidation.message
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined
  }
}

// check if user can modify something
export function canModifyResource(session, resourceUserId) {
  if (!session) return false
  return session.role === 'ADMIN' || session.userId === resourceUserId
}

// check if user is admin
export function isAdmin(session) {
  return session && session.role === 'ADMIN'
}

// recalculate movie average note
export async function updateFilmAverageRating(filmId) {
  try {
    const ratings = await prisma.rating.findMany({
      where: { filmId },
      select: { value: true }
    })

    const totalRatings = ratings.length
    
    if (totalRatings === 0) {
      await prisma.film.update({
        where: { id: filmId },
        data: {
          averageRating: 0,
          totalRatings: 0
        }
      })
      return
    }

    const sum = ratings.reduce((acc, rating) => acc + rating.value, 0)
    const average = sum / totalRatings

    await prisma.film.update({
      where: { id: filmId },
      data: {
        averageRating: parseFloat(average.toFixed(2)),
        totalRatings
      }
    })
  } catch (error) {
    console.error('Error updating film average rating:', error)
    throw error
  }
}
