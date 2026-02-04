'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Resource } from '../lib/types';
import { getResources } from '../lib/api';

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    max_price: '',
    min_reputation: '',
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await getResources({
        type: filters.type || undefined,
        max_price: filters.max_price ? Number(filters.max_price) : undefined,
        min_reputation: filters.min_reputation ? Number(filters.min_reputation) : undefined,
      });
      setResources(data.resources);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    fetchResources();
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      compute: 'bg-blue-500',
      human: 'bg-green-500',
      device: 'bg-purple-500',
      api: 'bg-orange-500',
      default: 'bg-gray-500',
    };
    return colors[type] || colors.default;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-white">
                RentBy
              </Link>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/resources"
                className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Resources
              </Link>
              <Link
                href="/rentals"
                className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Rentals
              </Link>
              <Link
                href="/create-resource"
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                List Resource
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Browse Resources</h1>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Type
              </label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="">All Types</option>
                <option value="compute">Compute</option>
                <option value="human">Human</option>
                <option value="device">Device</option>
                <option value="api">API</option>
              </select>
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Max Price (SOL/hour)
              </label>
              <input
                type="number"
                name="max_price"
                value={filters.max_price}
                onChange={handleFilterChange}
                placeholder="No limit"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Min Reputation
              </label>
              <input
                type="number"
                name="min_reputation"
                value={filters.min_reputation}
                onChange={handleFilterChange}
                placeholder="0"
                step="0.1"
                max="5"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full bg-white text-purple-900 px-6 py-2 rounded-lg font-semibold hover:bg-white/90 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="text-center text-white/80">Loading resources...</div>
        ) : resources.length === 0 ? (
          <div className="text-center text-white/80">
            <p className="text-xl mb-4">No resources found</p>
            <Link
              href="/create-resource"
              className="text-white hover:underline"
            >
              Be the first to list a resource
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/30 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`${getTypeColor(
                      resource.resource_type,
                    )} text-white text-xs px-2 py-1 rounded-full`}
                  >
                    {resource.resource_type}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <span className="text-lg">⭐</span>
                    <span className="text-white font-semibold">
                      {resource.reputation.toFixed(1)}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
                  {resource.specs}
                </h3>
                <p className="text-white/60 text-sm mb-4">
                  {resource.total_rentals} rental{resource.total_rentals !== 1 ? 's' : ''}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white/60 text-sm">Hourly Rate</p>
                    <p className="text-2xl font-bold text-white">
                      {resource.hourly_rate} SOL
                    </p>
                  </div>
                  <Link
                    href={`/resources/${resource.id}`}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
