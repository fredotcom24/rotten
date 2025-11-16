'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function FiltersPanel() {
  const router = useRouter()
  const [genres, setGenres] = useState([])
  const [directors, setDirectors] =  useState([])
  const [languages, setLanguages] = useState([])
  const [genre, setGenre] = useState('')
  const [director, setDirector] = useState('')
  const [year, setYear] = useState('')
  const [language, setLanguage] = useState('')

  // filter genre, director and language
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        //get genre
        const resGenres = await fetch('/api/genres')
        const dataGenres = await resGenres.json()
        setGenres(dataGenres.genres || [])
 
        //get director
        const resDirectors = await fetch('/api/directors')
        const dataDirectors = await resDirectors.json()
        setDirectors(dataDirectors.directors || [])

        //Get language
        const resLang = await fetch('/api/languages')
        const dataLang = await resLang.json()
        setLanguages(dataLang.languages || [])
      } catch (err) {
        console.error('Error loading filters:', err)
      }
    }
    fetchFilters()
  }, [])

  const handleFilter = () => {
    const query = new URLSearchParams()
    if (genre) query.set('genre', genre)
    if (year) query.set('year', year)
    if (director) query.set('director', director)
    if (language) query.set('language', language)
    router.push(`/films?${query.toString()}`)
  }

  const clearFilters = () => {
    setGenre('')
    setYear('')
    setLanguage('')
    setDirector('')
    router.push('/films')
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mt-8 mb-10">
      {/* Genre */}
      <select
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        className="cursor-pointer px-4 py-2 bg-[#0b1b2b] text-white border border-[#405266] rounded-md focus:border-[#dcf836] outline-none"
      >
        <option value="">All Genres</option>
        {genres.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
      {/* dirzector */}
      <select
        value={director}
        onChange={(e) => setDirector(e.target.value)}
        className="cursor-pointer px-4 py-2 bg-[#0b1b2b] text-white border border-[#405266] rounded-md focus:border-[#dcf836] outline-none"
      >
        <option value="">All directors</option>
        {directors.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      {/* Year */}
      <input
        type="number"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        placeholder="Year"
        min={1900}
        className="cursor-pointer px-4 py-2 w-28 bg-[#0b1b2b] text-white border border-[#405266] rounded-md focus:border-[#dcf836] outline-none"
      />

      {/* Language */}
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="cursor-pointer px-4 py-2 bg-[#0b1b2b] text-white border border-[#405266] rounded-md focus:border-[#dcf836] outline-none"
      >
        <option value="">All Languages</option>
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {lang.toUpperCase()}
          </option>
        ))}
      </select>

      <button
        onClick={handleFilter}
        className="cursor-pointer px-6 py-2 bg-[#dcf836] text-[#020d18] font-semibold rounded-md hover:bg-white transition-colors"
      >
        Apply
      </button>

      <button
        onClick={clearFilters}
        className="cursor-pointer px-6 py-2 border border-[#405266] text-white rounded-md hover:bg-[#dd003f] hover:border-[#dd003f] transition-colors"
      >
        Clear
      </button>
    </div>
  )
}
