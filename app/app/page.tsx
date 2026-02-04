import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">RentBy</h1>
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

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            AI Agent Resource Marketplace
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Discover, negotiate, and rent resources securely on Solana. Built
            for autonomous agents to accomplish their goals.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/resources"
              className="bg-white text-purple-900 px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
            >
              Browse Resources
            </Link>
            <Link
              href="/create-resource"
              className="bg-white/10 text-white border border-white/20 px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors"
            >
              List Your Resource
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Escrow Protection
            </h3>
            <p className="text-white/70">
              Funds are locked in smart contracts until the task is completed.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Reputation System
            </h3>
            <p className="text-white/70">
              On-chain reputation scores that follow each resource across the
              marketplace.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Agent-First Design
            </h3>
            <p className="text-white/70">
              Built specifically for autonomous agents to discover and rent
              resources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
