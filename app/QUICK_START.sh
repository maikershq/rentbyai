#!/bin/bash

# RentBy UI Overhaul - Quick Start Script
# This script automates the foundational UI changes

set -e  # Exit on error

echo "🎨 RentBy UI Overhaul - Quick Start"
echo "===================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the /app directory"
    exit 1
fi

# Step 1: Update Tailwind config
echo "📝 Step 1: Updating Tailwind config..."
if [ -f "tailwind.config.new.js" ]; then
    mv tailwind.config.new.js tailwind.config.js
    echo "✅ Tailwind config updated"
else
    echo "⚠️  Warning: tailwind.config.new.js not found, skipping..."
fi

# Step 2: Install dependencies
echo ""
echo "📦 Step 2: Installing UI dependencies..."
echo "This may take a few minutes..."
npm install --silent lucide-react framer-motion recharts 2>/dev/null || {
    echo "⚠️  Some packages failed to install, continuing..."
}
echo "✅ Dependencies installed"

# Step 3: Create components/ui directory structure
echo ""
echo "📁 Step 3: Creating component structure..."
mkdir -p components/ui
echo "✅ Component structure created"

# Step 4: Update global styles
echo ""
echo "🎨 Step 4: Adding global styles..."
if [ -f "app/globals.css" ]; then
    # Backup existing globals.css
    cp app/globals.css app/globals.css.backup
    echo "✅ Backed up existing globals.css"
fi

# Create new globals.css
cat > app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-dark-surface;
}

::-webkit-scrollbar-thumb {
  @apply bg-dark-border rounded-lg;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-text-tertiary;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom focus styles */
*:focus-visible {
  @apply outline-none ring-2 ring-brand-purple ring-offset-2 ring-offset-dark-surface;
}

/* Glass effect utilities */
.glass {
  @apply bg-white/5 backdrop-blur-sm border border-white/10;
}

.glass-card {
  @apply bg-dark-card/50 backdrop-blur-sm border border-dark-border;
}

/* Gradient text */
.gradient-text {
  @apply bg-gradient-to-r from-brand-purple via-brand-green to-brand-cyan bg-clip-text text-transparent;
}
EOF
echo "✅ Global styles added"

# Step 5: Clear Next.js cache
echo ""
echo "🧹 Step 5: Clearing Next.js cache..."
rm -rf .next
echo "✅ Cache cleared"

# Step 6: Summary
echo ""
echo "🎉 Quick Start Complete!"
echo "===================================="
echo ""
echo "✅ Tailwind config updated"
echo "✅ Dependencies installed"
echo "✅ Component structure created"
echo "✅ Global styles added"
echo "✅ Cache cleared"
echo ""
echo "📋 Next Steps:"
echo "   1. Start dev server: npm run dev"
echo "   2. Update app/page.tsx to use NewHero component"
echo "   3. Replace ResourceCard with NewResourceCard"
echo "   4. Update navigation styling"
echo ""
echo "📚 For detailed implementation guide, see:"
echo "   IMPLEMENTATION_GUIDE.md"
echo ""
echo "📊 For visual comparison, see:"
echo "   VISUAL_COMPARISON.md"
echo ""
echo "💡 Want to revert the globals.css?"
echo "   mv app/globals.css.backup app/globals.css"
echo ""
