# RentBy Frontend

Modern Next.js application for the RentBy marketplace.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Blockchain:** Solana Web3.js

## Getting Started

### Installation

```bash
cd app
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Pages

### Home Page (`/`)
- Hero section with search
- Marketplace statistics
- Featured resources
- Call-to-action sections

### Resources (`/resources`)
- Browse all resources
- Filter by type, price, reputation
- Sort options

### Resource Detail (`/resources/[id]`)
- Detailed resource information
- Owner and mint details
- Reputation display
- Rent button (coming soon)

### Create Resource (`/create`)
- Form to list new resources
- Input validation
- API integration

### Rentals (`/rentals`)
- List all rental agreements
- Status tracking
- Duration and amount display

## Components

### ResourceCard
- Displays resource information
- Type badges with icons
- Reputation stars
- Owner address display

### SearchBar
- Natural language search
- Integration with search API

## Features

- ✅ Responsive design (mobile-first)
- ✅ Dark mode support
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ API proxy configuration
- ✅ SEO-friendly with Next.js metadata
- ✅ Client-side data fetching

## API Proxy

The frontend uses Next.js rewrites to proxy API requests to the backend:

```javascript
// next.config.js
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://localhost:3001/api/:path*',
    },
  ]
}
```

This allows the frontend to fetch from `/api/resources` instead of `http://localhost:3001/api/resources`.

## Environment Variables

Create a `.env.local` file for environment-specific configuration:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

## Styling

### Tailwind Configuration

Custom colors are defined in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    50: '#f0f9ff',
    // ... more shades
  },
}
```

### Custom Classes

- `.gradient-text`: Gradient text effect for branding
- `.text-balance`: Balanced text wrapping

## Future Enhancements

- [ ] Wallet connection (Solana)
- [ ] Create rental flow
- [ ] Profile page
- [ ] Resource owner dashboard
- [ ] Search history
- [ ] Favorites/bookmarks
- [ ] Review system
- [ ] Notifications
- [ ] Mobile app (Expo)

## Deployment

### Vercel (Recommended)

```bash
npm run build
```

Deploy to Vercel with automatic CI/CD.

### Other Platforms

Build and start the production server:

```bash
npm run build
npm start
```

## Troubleshooting

### Port already in use

Kill the process on port 3000:

```bash
lsof -ti:3000 | xargs kill -9
```

### API requests failing

Ensure the API server is running on port 3001:

```bash
cd ../api
npm start
```

## Contributing

1. Create a new branch
2. Make your changes
3. Test locally
4. Submit a pull request

## License

MIT
