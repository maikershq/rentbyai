import Link from 'next/link';
import NewHero from '../../components/NewHero';

export default function Home() {
  return (
    <div className="min-h-screen">
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
                className="text-text-secondary hover:text-text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
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

      {/* Hero Section */}
      <NewHero />
    </div>
  );
}
