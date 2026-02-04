# RentBy Frontend

A modern, responsive web interface for the RentBy decentralized resource marketplace.

## Features

### Pages
- **Home** (`/`) - Hero section with marketplace overview
- **Resources** (`/resources`) - Browse resources with filters
- **Resource Detail** (`/resources/[id]`) - View resource details and rent
- **Rentals** (`/rentals`) - View rental history
- **Create Resource** (`/create-resource`) - List new resources
- **Stats** (`/stats`) - Marketplace statistics dashboard
- **Search** (`/search`) - Natural language resource discovery

### Key Features
- 🎨 Beautiful gradient UI with Tailwind CSS
- 📱 Fully responsive design (mobile-first)
- 🔍 Natural language search
- 📊 Real-time statistics
- 💰 In-app rental creation
- ⭐ Reputation display
- 🔍 Advanced filtering (type, price, reputation)

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** React Hooks
- **API:** Fetch API with type-safe wrappers

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- RentBy API running on `http://localhost:3001`

### Installation

```bash
cd app
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Project Structure

```
app/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── resources/        # Resources pages
│   │   ├── page.tsx      # Resources listing
│   │   └── [id]/         # Resource detail
│   │       └── page.tsx
│   ├── rentals/          # Rentals page
│   │   └── page.tsx
│   ├── create-resource/  # Create resource page
│   │   └── page.tsx
│   ├── stats/            # Statistics page
│   │   └── page.tsx
│   └── search/           # Search page
│       └── page.tsx
├── components/           # Reusable components
│   └── RentResourceForm.tsx
├── lib/                  # Utilities
│   ├── types.ts         # TypeScript types
│   └── api.ts           # API client
└── public/              # Static assets
```

## API Integration

The frontend communicates with the RentBy REST API. All API calls are wrapped in `lib/api.ts` with full TypeScript support.

### Example Usage

```typescript
import { getResources, createRental } from '../lib/api';

// Fetch resources
const { resources } = await getResources({ type: 'compute', max_price: 10 });

// Create a rental
const result = await createRental({
  renter: 'wallet_address',
  resource_owner: 'owner_address',
  resource_mint: 'mint_address',
  escrow_amount: 50,
  duration: 3600,
  solana_tx_signature: 'signature',
});
```

## Component Architecture

All pages follow a consistent structure:
1. Navigation bar (shared across all pages)
2. Main content area
3. Responsive grid layouts
4. Loading and error states

## Styling

### Color Scheme
- **Primary:** Purple to Blue gradient
- **Background:** Dark gradient (purple → blue → indigo)
- **Text:** White with opacity for hierarchy
- **Accents:** Yellow (stars/reputation), Status colors

### Utility Classes
- `bg-white/10` - Semi-transparent white backgrounds
- `backdrop-blur-sm` - Glass effect
- `hover:scale-105` - Micro-interactions
- `transition-all` - Smooth transitions

## Responsive Design

The app uses a mobile-first approach:
- **Mobile:** Single column, stacked layout
- **Tablet:** 2-column grids
- **Desktop:** 3-column grids, full-width navigation

## Future Enhancements

- [ ] Wallet connection (Phantom, Solflare)
- [ ] Real-time WebSocket updates
- [ ] User profile pages
- [ ] Transaction history
- [ ] Dispute resolution UI
- [ ] Multi-language support
- [ ] Dark/Light mode toggle
- [ ] PWA support

## Contributing

When adding new pages or features:

1. Follow the existing folder structure
2. Use TypeScript for type safety
3. Include proper error handling
4. Add loading states
5. Ensure mobile responsiveness
6. Document new API calls in `lib/api.ts`

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Support

For issues or questions:
- Check the main [README.md](../README.md)
- Review [API Documentation](../api/API.md)
- Visit the project on GitHub
