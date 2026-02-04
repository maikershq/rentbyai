'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Resource } from '../../../lib/types';
import { getResource } from '../../../lib/api';
import RentResourceForm from '../../../components/RentResourceForm';

export default function ResourceDetailPage() {
  const params = useParams();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchResource(params.id as string);
    }
  }, [params.id]);

  const fetchResource = async (id: string) => {
    try {
      setLoading(true);
      const data = await getResource(id);
      setResource(data);
    } catch (err) {
      setError('Failed to load resource');
      console.error(err);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">{error || 'Resource not found'}</div>
      </div>
    );
  }

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
                className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
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
        <Link
          href="/resources"
          className="text-white/60 hover:text-white mb-6 inline-block"
        >
          ← Back to Resources
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resource Details */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span
                    className={`${getTypeColor(
                      resource.resource_type,
                    )} text-white text-sm px-3 py-1 rounded-full mb-4 inline-block`}
                  >
                    {resource.resource_type.toUpperCase()}
                  </span>
                  <h1 className="text-4xl font-bold text-white mb-4">
                    {resource.specs}
                  </h1>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                  <span className="text-yellow-400 text-2xl">⭐</span>
                  <div>
                    <div className="text-white text-2xl font-bold">
                      {resource.reputation.toFixed(1)}
                    </div>
                    <div className="text-white/60 text-xs">
                      {resource.total_rentals} rental{resource.total_rentals !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-white/60 text-sm mb-2">Hourly Rate</p>
                  <p className="text-3xl font-bold text-white">
                    {resource.hourly_rate} SOL
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-white/60 text-sm mb-2">Owner</p>
                  <p className="text-white font-mono text-sm">
                    {resource.owner.slice(0, 8)}...{resource.owner.slice(-8)}
                  </p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Resource Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/60 mb-1">Resource ID</p>
                    <p className="text-white font-mono text-xs">{resource.id}</p>
                  </div>
                  <div>
                    <p className="text-white/60 mb-1">NFT Mint</p>
                    <p className="text-white font-mono text-xs">{resource.mint}</p>
                  </div>
                  <div>
                    <p className="text-white/60 mb-1">Listed On</p>
                    <p className="text-white">
                      {new Date(resource.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 mb-1">Total Rentals</p>
                    <p className="text-white">{resource.total_rentals}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rent Form Sidebar */}
          <div className="lg:col-span-1">
            <RentResourceForm resourceId={resource.id} resource={resource} />
          </div>
        </div>
      </div>
    </div>
  );
}
