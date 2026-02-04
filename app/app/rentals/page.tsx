'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Rental } from '../lib/types';
import { getRentals } from '../lib/api';

export default function RentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const data = await getRentals();
      setRentals(data.rentals);
    } catch (error) {
      console.error('Error fetching rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-500',
      completed: 'bg-blue-500',
      disputed: 'bg-red-500',
      resolved: 'bg-yellow-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
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
        <h1 className="text-4xl font-bold text-white mb-8">Rentals</h1>

        {loading ? (
          <div className="text-center text-white/80">Loading rentals...</div>
        ) : rentals.length === 0 ? (
          <div className="text-center text-white/80">
            <p className="text-xl mb-4">No rentals yet</p>
            <Link
              href="/resources"
              className="text-white hover:underline"
            >
              Browse resources to get started
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {rentals.map((rental) => (
              <div
                key={rental.id}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`${getStatusColor(
                        rental.status,
                      )} text-white text-xs px-3 py-1 rounded-full`}
                    >
                      {rental.status.toUpperCase()}
                    </span>
                    <span className="text-white/60 text-sm">
                      {formatTimestamp(rental.created_at)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-sm">Escrow Amount</p>
                    <p className="text-2xl font-bold text-white">
                      {rental.escrow_amount} SOL
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-white/60 text-sm">Renter</p>
                    <p className="text-white font-mono text-sm">
                      {rental.renter.slice(0, 8)}...{rental.renter.slice(-8)}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Resource Owner</p>
                    <p className="text-white font-mono text-sm">
                      {rental.resource_owner.slice(0, 8)}...{rental.resource_owner.slice(-8)}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Duration</p>
                    <p className="text-white font-semibold">
                      {formatDuration(rental.duration)}
                    </p>
                  </div>
                </div>
                <div className="text-white/60 text-sm">
                  <p className="mb-1">Resource Mint:</p>
                  <p className="font-mono text-xs">
                    {rental.resource_mint}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
