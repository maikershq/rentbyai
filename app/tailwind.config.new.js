/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Solana-inspired brand colors
        brand: {
          purple: '#9945FF',
          green: '#14F195',
          cyan: '#00FFA3',
          gradient: 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)',
        },
        // Dark theme colors
        dark: {
          surface: '#0D1117',
          card: '#161B22',
          cardHover: '#21262D',
          border: '#30363D',
        },
        // Text colors
        text: {
          primary: '#F0F6FC',
          secondary: '#8B949E',
          tertiary: '#6E7681',
        },
        // Status colors
        status: {
          active: '#238636',
          pending: '#1F6FEB',
          completed: '#8957E5',
          disputed: '#DA3633',
          resolved: '#D29922',
        },
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          from: { backgroundPosition: '0 0' },
          to: { backgroundPosition: '-200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #0D1117 0%, #1A1F2E 50%, #0D1117 100%)',
      },
      boxShadow: {
        'glow': '0 0 40px rgba(153, 69, 255, 0.3)',
        'glow-green': '0 0 40px rgba(20, 241, 149, 0.3)',
      },
    },
  },
  plugins: [],
}
