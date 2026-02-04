'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Resource } from '../../lib/types';
import { getResources } from '../../lib/api';

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
    <div className="min-h-screen bg-dark-surface">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-dark-border bg-dark-surface/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold gradient-text">RentBy</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/resources"
                className="text-text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors border-b-2 border-brand-purple"
              >
                Resources
              </Link>
              <Link
                href="/rentals"
                className="text-text-secondary hover:text-text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Rentals
              </Link>
              <Link
                href="/stats"
                className="text-text-secondary hover:text-text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Stats
              </Link>
              <Link
                href="/create-resource"
                className="bg-gradient-to-r from-brand-purple to-brand-green text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-all shadow-lg hover:shadow-glow"
              >
                List Resource
              </Link>
              <button className="bg-white/5 border border-dark-border text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-all">
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-text-primary mb-2">Browse Resources</h1>
            <p className="text-text-secondary">{resources.length} resources available</p>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">
                Type
              </label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-purple"
              >
                <option value="">All Types</option>
                <option value="compute">Compute</option>
                <option value="human">Human</option>
                <option value="device">Device</option>
                <option value="api">API</option>
              </select>
            </div>
            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">
                Max Price (SOL/hour)
              </label>
              <input
                type="number"
                name="max_price"
                value={filters.max_price}
                onChange={handleFilterChange}
                placeholder="No limit"
                className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </div>
            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">
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
                className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full bg-gradient-to-r from-brand-purple to-brand-green text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-glow"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="text-center text-text-secondary">Loading resources...</div>
        ) : resources.length === 0 ? (
          <div className="text-center text-text-secondary glass-card rounded-xl p-12">
            <p className="text-xl mb-4">No resources found</p>
            <Link
              href="/create-resource"
              className="text-brand-purple hover:text-brand-green transition-colors font-medium"
            >
              Be the first to list a resource →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <Link
                key={resource.id}
                href={`/resources/${resource.id}`}
                className="group glass-card rounded-xl p-6 border border-dark-border hover:border-brand-purple/50 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-purple/20"
              >
                <div className="flex justify-between items-start mb-4">
                  <span
                    className="bg-brand-purple/20 text-brand-purple border border-brand-purple/30 text-xs px-2 py-1 rounded-full"
                  >
                    {resource.resource_type}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 text-sm">⭐</span>
                    <span className="text-text-primary font-semibold">
                      {resource.reputation.toFixed(1)}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2 line-clamp-2">
                  {resource.specs}
                </h3>
                <p className="text-text-tertiary text-sm mb-4">
                  {resource.total_rentals} rental{resource.total_rentals !== 1 ? 's' : ''}
                </p>
                <div className="flex justify-between items-center border-t border-dark-border pt-4">
                  <div>
                    <p className="text-text-tertiary text-sm">Hourly Rate</p>
                    <p className="text-2xl font-bold text-text-primary">
                      {resource.hourly_rate} SOL
                    </p>
                  </div>
                  <span className="text-brand-purple text-sm font-medium group-hover:translate-x-1 transition-transform">
                    View →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
