'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createRental } from '../lib/api';

export default function RentResourceForm({ resourceId, resource }: { resourceId: string; resource: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    renter_wallet: '',
    duration_hours: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const escrowAmount = resource.hourly_rate * formData.duration_hours;
      const result = await createRental({
        renter: formData.renter_wallet,
        resource_owner: resource.owner,
        resource_mint: resource.mint,
        escrow_amount: escrowAmount,
        duration: formData.duration_hours * 3600,
        solana_tx_signature: 'placeholder_signature',
      });

      if (result.success) {
        router.push(`/rentals`);
      } else {
        setError('Failed to create rental');
      }
    } catch (err) {
      setError('An error occurred while creating the rental');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const estimatedCost = (resource.hourly_rate * formData.duration_hours).toFixed(3);

  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      <h3 className="text-2xl font-bold text-white mb-6">Rent This Resource</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Your Wallet Address *
          </label>
          <input
            type="text"
            required
            value={formData.renter_wallet}
            onChange={(e) => setFormData({ ...formData, renter_wallet: e.target.value })}
            placeholder="Enter your Solana wallet address"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Duration (hours) *
          </label>
          <input
            type="number"
            required
            min="1"
            max="168"
            value={formData.duration_hours}
            onChange={(e) => setFormData({ ...formData, duration_hours: Number(e.target.value) })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>

        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-white/80">Estimated Cost:</span>
            <span className="text-2xl font-bold text-white">{estimatedCost} SOL</span>
          </div>
          <p className="text-white/60 text-sm mt-2">
            {resource.hourly_rate} SOL/hour × {formData.duration_hours} hours
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-4 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : `Rent Now - ${estimatedCost} SOL`}
        </button>

        <p className="text-white/60 text-xs text-center">
          Funds will be held in escrow until the task is completed
        </p>
      </form>
    </div>
  );
}
