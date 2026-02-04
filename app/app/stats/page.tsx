'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Stats } from '../../lib/types';
import { getStats } from '../../lib/api';

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }: { title: string; value: string | number; icon: string; color: string }) => (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className={`text-4xl ${color}`}>{icon}</div>
        <div className="text-white/60 text-sm">{title}</div>
      </div>
      <div className="text-4xl font-bold text-white">{value}</div>
    </div>
  );

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
          <h1 className="text-4xl font-bold text-white">Marketplace Statistics</h1>
          <button
            onClick={fetchStats}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center text-white/80">Loading statistics...</div>
        ) : stats ? (
          <div className="space-y-8">
            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Resources"
                value={stats.total_resources}
                icon="📦"
                color="text-blue-400"
              />
              <StatCard
                title="Total Rentals"
                value={stats.total_rentals}
                icon="🤝"
                color="text-green-400"
              />
              <StatCard
                title="Active Rentals"
                value={stats.active_rentals}
                icon="⚡"
                color="text-yellow-400"
              />
              <StatCard
                title="Completed Rentals"
                value={stats.completed_rentals}
                icon="✅"
                color="text-purple-400"
              />
            </div>

            {/* Reputation Stats */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <h2 className="text-2xl font-semibold text-white mb-6">Platform Reputation</h2>
              <div className="flex items-center gap-4">
                <div className="text-6xl font-bold text-yellow-400">
                  {stats.average_reputation.toFixed(1)}
                </div>
                <div>
                  <div className="flex text-yellow-400 text-2xl">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.round(stats.average_reputation) ? '' : 'opacity-30'}>
                        ⭐
                      </span>
                    ))}
                  </div>
                  <p className="text-white/60 mt-2">Average Marketplace Rating</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Success Rate</h3>
                <div className="text-4xl font-bold text-white">
                  {((stats.completed_rentals / stats.total_rentals) * 100).toFixed(1)}%
                </div>
                <p className="text-white/60 mt-2">
                  {stats.completed_rentals} of {stats.total_rentals} rentals completed successfully
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Active Rate</h3>
                <div className="text-4xl font-bold text-white">
                  {((stats.active_rentals / stats.total_rentals) * 100).toFixed(1)}%
                </div>
                <p className="text-white/60 mt-2">
                  {stats.active_rentals} of {stats.total_rentals} rentals currently active
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-white/80">
            Failed to load statistics
          </div>
        )}
      </div>
    </div>
  );
}
