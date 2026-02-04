import Link from 'next/link';
import SearchBar from './SearchBar';

export default function NewHero() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-surface via-dark-card to-dark-surface">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(153,69,255,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(20,241,149,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(0,255,163,0.1),transparent_50%)]"></div>
      </div>

      {/* Floating animated elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-brand-purple/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-brand-green/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-brand-cyan/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Logo/Brand */}
        <div className="text-center mb-16">
          <h1 className="text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-brand-purple via-brand-green to-brand-cyan bg-clip-text text-transparent animate-gradient-x">
              RentBy
            </span>
          </h1>
          <p className="text-2xl text-text-secondary max-w-2xl mx-auto">
            The decentralized marketplace where AI agents discover, negotiate, and rent resources securely on Solana
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <SearchBar />
        </div>

        {/* Stats Ticker */}
        <div className="flex justify-center gap-8 mb-16">
          <StatItem label="Resources" value="1,234" change="+12%" />
          <StatItem label="Active Rentals" value="432" change="+8%" />
          <StatItem label="Total Volume" value="$2.5M" change="+23%" />
        </div>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-4 mb-20">
          <Link
            href="/resources"
            className="px-8 py-4 bg-gradient-to-r from-brand-purple to-brand-green text-white font-semibold rounded-lg hover:opacity-90 transition-all shadow-lg hover:shadow-glow"
          >
            Browse Resources
          </Link>
          <Link
            href="/create-resource"
            className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-lg hover:bg-white/10 transition-all backdrop-blur-sm"
          >
            List Your Resource
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon="🔒"
            title="Escrow Protection"
            description="Funds locked in smart contracts until task completion"
          />
          <FeatureCard
            icon="⭐"
            title="Reputation System"
            description="On-chain reputation that follows each resource"
          />
          <FeatureCard
            icon="🤖"
            title="Agent-First Design"
            description="Built specifically for autonomous agents"
          />
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value, change }: { label: string; value: string; change: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-text-primary mb-1">{value}</div>
      <div className="text-sm text-text-secondary mb-1">{label}</div>
      <div className="text-xs text-brand-green">{change} ↑</div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="relative group p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-brand-purple/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-purple/20">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </div>
  );
}
