import Link from 'next/link';
import { Badge } from './ui/Badge';

interface ResourceProps {
  id: string;
  owner: string;
  mint: string;
  resource_type: string;
  specs: string;
  hourly_rate: number;
  reputation: number;
  total_rentals: number;
  created_at: number;
  available?: boolean;
}

export default function NewResourceCard({ resource }: { resource: ResourceProps }) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'compute':
        return '💻';
      case 'human':
        return '👤';
      case 'device':
        return '🔧';
      default:
        return '📦';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'compute':
        return 'text-brand-purple';
      case 'human':
        return 'text-brand-green';
      case 'device':
        return 'text-brand-cyan';
      default:
        return 'text-gray-400';
    }
  };

  const getStars = (rating: number) => {
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 >= 1;
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-sm ${
              i < fullStars ? 'text-yellow-400' : i === fullStars && hasHalfStar ? 'text-yellow-400 opacity-50' : 'text-gray-600'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="group relative bg-dark-card/50 backdrop-blur-sm rounded-xl border border-dark-border hover:border-brand-purple/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-purple/20 overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-brand-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      {/* Available indicator */}
      {resource.available !== false && (
        <div className="absolute top-4 right-4 w-3 h-3 bg-status-active rounded-full animate-pulse-slow shadow-[0_0_10px_rgba(35,134,54,0.5)]"></div>
      )}

      <div className="relative p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className={`text-4xl ${getTypeColor(resource.resource_type)}`}>
            {getTypeIcon(resource.resource_type)}
          </div>
          <Badge variant="primary" size="sm">
            {resource.resource_type.charAt(0).toUpperCase() + resource.resource_type.slice(1)}
          </Badge>
        </div>

        {/* Specs */}
        <h3 className="text-xl font-bold text-text-primary mb-3 line-clamp-2 min-h-[3.5rem]">
          {resource.specs}
        </h3>

        {/* Rating */}
        <div className="flex items-center space-x-2 mb-4">
          {getStars(resource.reputation)}
          <span className="text-text-secondary text-sm">
            {resource.reputation}/10 ({resource.total_rentals} rentals)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-3xl font-bold text-text-primary">
            ${resource.hourly_rate}
          </span>
          <span className="text-text-secondary text-sm">/hour</span>
        </div>

        {/* Divider */}
        <div className="border-t border-dark-border my-4"></div>

        {/* Footer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Owner</span>
            <span className="text-text-primary font-mono text-xs">
              {resource.owner.slice(0, 6)}...{resource.owner.slice(-4)}
            </span>
          </div>

          <Link
            href={`/resources/${resource.id}`}
            className="block w-full bg-gradient-to-r from-brand-purple to-brand-green text-white text-center py-2.5 rounded-lg hover:opacity-90 transition-all font-medium shadow-lg hover:shadow-glow"
          >
            Rent Now
          </Link>
        </div>
      </div>
    </div>
  );
}
