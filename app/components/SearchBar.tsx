'use client'

import { useState } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for resources (e.g., 'GPU for ML training', 'AI consultant')"
        className="w-full px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 bg-white border-2 border-transparent focus:border-brand-purple focus:shadow-lg focus:shadow-brand-purple/20 focus:outline-none shadow-lg text-lg transition-all"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-brand-purple to-brand-green text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all font-medium shadow-lg hover:shadow-glow"
      >
        Search
      </button>
    </form>
  )
}
