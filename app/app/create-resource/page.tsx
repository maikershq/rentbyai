'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createResource } from '../lib/api';

export default function CreateResourcePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    owner: '',
    mint: '',
    resource_type: 'compute',
    specs: '',
    hourly_rate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await createResource({
        owner: formData.owner,
        mint: formData.mint,
        resource_type: formData.resource_type,
        specs: formData.specs,
        hourly_rate: Number(formData.hourly_rate),
      });

      if (result.success) {
        router.push(`/resources/${result.resource.id}`);
      } else {
        setError('Failed to create resource');
      }
    } catch (err) {
      setError('An error occurred while creating the resource');
      console.error(err);
    } finally {
      setLoading(false);
    }
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">List Your Resource</h1>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Wallet Address *
              </label>
              <input
                type="text"
                required
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                placeholder="Enter your Solana wallet address"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                NFT Mint Address *
              </label>
              <input
                type="text"
                required
                value={formData.mint}
                onChange={(e) => setFormData({ ...formData, mint: e.target.value })}
                placeholder="Enter the mint address of your NFT"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Resource Type *
              </label>
              <select
                required
                value={formData.resource_type}
                onChange={(e) => setFormData({ ...formData, resource_type: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="compute">Compute</option>
                <option value="human">Human Expertise</option>
                <option value="device">Device/IoT</option>
                <option value="api">API Service</option>
              </select>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Specifications *
              </label>
              <textarea
                required
                value={formData.specs}
                onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                rows={4}
                placeholder="Describe your resource (e.g., 4x NVIDIA A100 80GB GPUs, 128GB RAM)"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Hourly Rate (SOL) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.001"
                value={formData.hourly_rate}
                onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                placeholder="Enter your hourly rate in SOL"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-white text-purple-900 px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Resource'}
              </button>
              <Link
                href="/resources"
                className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
