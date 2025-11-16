'use client'

import { useState, useEffect } from 'react'
import MovieCard from './MovieCard'
import Link from 'next/link'
import axios from 'axios'

export default function MovieGrid({ title = "In Theater", viewAllLink = "#" }) {
  const [activeTab, setActiveTab] = useState('popular')
  const [movies, setMovies] = useState({
    popular: [],
    coming: [],
    toprated: [],
    reviewed: []
  })
  const [loading, setLoading] = useState(true)

  const tabs = [
    { id: 'popular', label: '#Popular' },
    { id: 'coming', label: '#Coming soon' },
    { id: 'toprated', label: '#Top rated' },
    { id: 'reviewed', label: '#Most reviewed' }
  ]

  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    try {
      setLoading(true)

      // Fetch different categories of films
      const [popularRes, comingRes, topratedRes, reviewedRes] = await Promise.all([
        axios.get('/api/films?limit=8&sortBy=totalRatings&order=desc'),
        axios.get('/api/films?limit=8&sortBy=createdAt&order=desc'),
        axios.get('/api/films?limit=8&sortBy=averageRating&order=desc'),
        axios.get('/api/films?limit=8&sortBy=totalRatings&order=desc')
      ])

      setMovies({
        popular: popularRes.data.films || [],
        coming: comingRes.data.films || [],
        toprated: topratedRes.data.films || [],
        reviewed: reviewedRes.data.films || []
      })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="w-full bg-[#020d18]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Title Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white uppercase">
                {title}
              </h2>
              <Link
                href={viewAllLink}
                className="flex items-center gap-2 text-[#dcf836] hover:text-white transition-colors text-sm md:text-base font-medium"
              >
                View all
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              {/* Tab Links */}
              <ul className="flex flex-wrap gap-2 border-b border-[#405266] pb-4 mb-6">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`cursor-pointer px-4 py-2 text-sm md:text-base font-medium rounded-t-lg transition-all ${
                        activeTab === tab.id
                          ? 'bg-[#dd003f] text-white'
                          : 'text-[#abb7c4] hover:text-white hover:bg-[#0b1b2b]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Tab Content */}
              {loading ? (
                <div className="text-center text-white py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#dcf836]"></div>
                  <p className="mt-4">Loading movies...</p>
                </div>
              ) : movies[activeTab]?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                  {movies[activeTab].map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              ) : (
                <div className="text-center text-[#abb7c4] py-12">
                  <p>No movies available in this category yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}