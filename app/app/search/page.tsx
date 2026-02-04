'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Resource } from '../../lib/types';
import { search } from '../../lib/api';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    max_price: '',
    min_reputation: '',
  });

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const data = await search(query, {
        type: filters.type || undefined,
        max_price: filters.max_price ? Number(filters.max_price) : undefined,
        min_reputation: filters.min_reputation ? Number(filters.min_reputation) : undefined,
      });
      setResults(data.resources);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
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
                href="/stats"
                className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Stats
              </Link>
              <Link
                href="/search"
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Search
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
        <h1 className="text-4xl font-bold text-white mb-8">Natural Language Search</h1>

        {/* Search Box */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/10">
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe what you need (e.g., 'Need GPU cluster for ML training')"
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 text-lg"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-white text-purple-900 px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
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
                value={filters.max_price}
                onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
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
                value={filters.min_reputation}
                onChange={(e) => setFilters({ ...filters, min_reputation: e.target.value })}
                placeholder="0"
                step="0.1"
                max="5"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((resource) => (
                <Link
                  key={resource.id}
                  href={`/resources/${resource.id}`}
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
                    <p className="text-2xl font-bold text-white">
                      {resource.hourly_rate} SOL
                    </p>
                    <span className="text-white/60 text-sm">/hour</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && query && results.length === 0 && !error && (
          <div className="text-center text-white/80">
            <p className="text-xl mb-4">No results found</p>
            <p className="text-white/60">
              Try a different search or browse all{' '}
              <Link href="/resources" className="text-white hover:underline">
                resources
              </Link>
            </p>
          </div>
        )}

        {/* Initial State */}
        {!query && !loading && (
          <div className="text-center text-white/80">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl mb-2">Search for resources naturally</p>
            <p className="text-white/60">
              Describe what you need in plain English
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
