import Link from 'next/link'

interface ResourceProps {
  id: string
  owner: string
  mint: string
  resource_type: string
  specs: string
  hourly_rate: number
  reputation: number
  total_rentals: number
  created_at: number
}

export default function ResourceCard({ resource }: { resource: ResourceProps }) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'compute':
        return '💻'
      case 'human':
        return '👤'
      case 'device':
        return '🔧'
      default:
        return '📦'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'compute':
        return 'bg-blue-100 text-blue-800'
      case 'human':
        return 'bg-green-100 text-green-800'
      case 'device':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <span className="text-4xl">{getTypeIcon(resource.resource_type)}</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(resource.resource_type)}`}>
            {resource.resource_type.charAt(0).toUpperCase() + resource.resource_type.slice(1)}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {resource.specs}
        </h3>

        <div className="flex items-center space-x-2 mb-4">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i}>{i < Math.round(resource.reputation / 2) ? '★' : '☆'}</span>
            ))}
          </div>
          <span className="text-gray-600 text-sm">
            {resource.reputation}/10 ({resource.total_rentals} rentals)
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-primary-600">
              ${resource.hourly_rate}
            </div>
            <div className="text-gray-500 text-sm">per hour</div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="text-gray-500 text-sm mb-4">
            Owner: {resource.owner.slice(0, 8)}...{resource.owner.slice(-4)}
          </div>
          <Link
            href={`/resources/${resource.id}`}
            className="block w-full bg-primary-600 text-white text-center py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Rent Now
          </Link>
        </div>
      </div>
    </div>
  )
}
