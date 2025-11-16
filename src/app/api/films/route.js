import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/films
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const limit = searchParams.get('limit')
        const page = parseInt(searchParams.get('page') || '1')
        const sortBy = searchParams.get('sortBy') || 'createdAt'
        const order = searchParams.get('order') || 'desc'


        // filters
        const search = searchParams.get('search') || null
        const genre = searchParams.get('genre') || null
        const director = searchParams.get('director') || null
        const year = searchParams.get('year') || null
        const language = searchParams.get('language') || null

        //dynamic filter
        const filters = {}

        if (search) {
            filters.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { overview: { contains: search, mode: 'insensitive' } },
                { director: { contains: search, mode: 'insensitive' } },
            ]
        }

        if (genre) {
            filters.genres = { has: genre } //it's array
        }

        if (director) {
            filters.director = { contains: director, mode: 'insensitive' }
        }

        if (language) {
            filters.originalLanguage = { equals: language }
        }

        if (year) {
            const start = new Date(`${year}-01-01`)
            const end = new Date(`${year}-12-31`)
            filters.releaseDate = {
                gte: start,
                lte: end,
            }
        }

        //query config
        const queryOptions = {
            where: filters,
            include: {
                _count: {
                    select: {
                        comments: true,
                        ratings: true,
                        favorites: true,
                    },
                },
            },
            orderBy: {}
        }

        // Set ordering
        if (sortBy === 'averageRating') {
            queryOptions.orderBy = { averageRating: order }
        } else if (sortBy === 'totalRatings') {
            queryOptions.orderBy = { totalRatings: order }
        } else {
            queryOptions.orderBy = { createdAt: order }
        }

        // Add pagination if limit specified
        if (limit) {
            const limitNum = parseInt(limit)
            queryOptions.take = limitNum
            queryOptions.skip = (page - 1) * limitNum
        }

        //execution - get total count for pagination
        const [films, total] = await Promise.all([
            prisma.film.findMany(queryOptions),
            prisma.film.count({ where: filters })
        ])

        return NextResponse.json({
            count: films.length,
            total: total,
            page: page,
            totalPages: limit ? Math.ceil(total / parseInt(limit)) : 1,
            films
        }, { status: 200 })
    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json({ error: 'Failed to fetch films', details: error.message }, { status: 500 })
    }
}