'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

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

export default function ResourceDetailPage() {
  const params = useParams()
  const [resource, setResource] = useState<Resource | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchResource(params.id as string)
    }
  }, [params.id])

  const fetchResource = async (id: string) => {
    try {
      const response = await fetch(`/api/resources/${id}`)
      if (response.ok) {
        const data = await response.json()
        setResource(data)
      } else {
        console.error('Resource not found')
      }
    } catch (error) {
      console.error('Error fetching resource:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRent = async () => {
    alert('Rent functionality coming soon! Connect your wallet to proceed.')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Resource Not Found</h1>
          <Link href="/resources" className="text-primary-600 hover:text-primary-700">
            Browse other resources
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-2xl font-bold gradient-text">RentBy</span>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/resources"
            className="text-primary-600 hover:text-primary-700 flex items-center space-x-2"
          >
            <span>←</span>
            <span>Back to Resources</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-2">
                      {resource.resource_type.charAt(0).toUpperCase() + resource.resource_type.slice(1)}
                    </span>
                    <h1 className="text-3xl font-bold text-gray-900">{resource.specs}</h1>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                    <p className="text-gray-600">
                      This {resource.resource_type} resource is available for rental.
                      It has completed {resource.total_rentals} rentals and has a reputation score of {resource.reputation}/10.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Specifications</h2>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                        <span>Type: {resource.resource_type}</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                        <span>Hourly Rate: ${resource.hourly_rate}</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                        <span>Total Rentals: {resource.total_rentals}</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Reputation</h2>
                    <div className="flex items-center space-x-2">
                      <div className="flex text-yellow-400 text-2xl">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < Math.round(resource.reputation / 2) ? '★' : '☆'}</span>
                        ))}
                      </div>
                      <span className="text-2xl font-bold text-gray-900">{resource.reputation}/10</span>
                    </div>
                    <p className="text-gray-500 mt-2">Based on {resource.total_rentals} completed rentals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  ${resource.hourly_rate}
                </div>
                <div className="text-gray-500">per hour</div>
              </div>

              <button
                onClick={handleRent}
                className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium mb-4"
              >
                Rent Now
              </button>

              <div className="border-t pt-6 space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Owner</div>
                  <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {resource.owner.slice(0, 20)}...{resource.owner.slice(-8)}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">Mint Address</div>
                  <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {resource.mint.slice(0, 20)}...{resource.mint.slice(-8)}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">Listed Since</div>
                  <div className="text-gray-900">
                    {new Date(resource.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
