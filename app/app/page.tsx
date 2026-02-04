'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ResourceCard from '@/components/ResourceCard'
import SearchBar from '@/components/SearchBar'

interface Resource {
  id: string
  owner: string
  mint: string
  resource_type: string
  specs: string
  hourly_rate: number
  reputation: number
  total_rentals: number
  created_at: number
}

interface Stats {
  total_resources: number
  total_rentals: number
  active_rentals: number
  completed_rentals: number
  average_reputation: number
}

export default function Home() {
  const [resources, setResources] = useState<Resource[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<string>('')

  useEffect(() => {
    fetchResources()
    fetchStats()
  }, [filterType])

  const fetchResources = async () => {
    try {
      setLoading(true)
      const url = filterType
        ? `/api/resources?type=${filterType}`
        : '/api/resources'
      const response = await fetch(url)
      const data = await response.json()
      setResources(data.resources || [])
    } catch (error) {
      console.error('Error fetching resources:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleSearch = async (query: string) => {
    try {
      setLoading(true)
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      const data = await response.json()
      setResources(data.resources || [])
    } catch (error) {
      console.error('Error searching:', error)
    } finally {
      setLoading(false)
    }
  }

  const resourceTypes = ['all', 'compute', 'human', 'device']

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="text-2xl font-bold gradient-text">RentBy</span>
            </Link>
            <nav className="flex space-x-6">
              <Link href="/resources" className="text-gray-700 hover:text-primary-600 transition-colors">
                Resources
              </Link>
              <Link href="/rentals" className="text-gray-700 hover:text-primary-600 transition-colors">
                Rentals
              </Link>
              <Link href="/create" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                List Resource
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Rent Resources for AI Agents
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Discover compute, expertise, and devices on Solana
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="text-3xl font-bold text-primary-600">{stats.total_resources}</div>
                <div className="text-gray-600 mt-2">Resources</div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="text-3xl font-bold text-primary-600">{stats.total_rentals}</div>
                <div className="text-gray-600 mt-2">Rentals</div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600">{stats.active_rentals}</div>
                <div className="text-gray-600 mt-2">Active</div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600">{stats.average_reputation.toFixed(1)}</div>
                <div className="text-gray-600 mt-2">Avg Reputation</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Resources Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Resources</h2>
            <div className="flex space-x-2">
              {resourceTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type === 'all' ? '' : type)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filterType === (type === 'all' ? '' : type)
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No resources found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Earn?
          </h2>
          <p className="text-primary-100 text-lg mb-8">
            List your compute, expertise, or devices and start earning today
          </p>
          <Link
            href="/create"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">RentBy</span>
            </div>
            <div className="text-gray-400">
              Built on Solana • Powered by AI Agents
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
