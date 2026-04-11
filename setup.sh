#!/bin/bash
# Quick Start Script for Currency Converter with Real-Time Data

echo "🚀 Welcome to Currency Converter - Real-Time Data Edition"
echo "==========================================================="
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 pnpm not found. Installing pnpm..."
    npm install -g pnpm
fi

echo "📦 Installing dependencies..."
pnpm install

echo ""
echo "✅ Installation complete!"
echo ""
echo "🎯 Next steps:"
echo ""
echo "1. Start development server:"
echo "   pnpm dev"
echo ""
echo "2. Open in browser:"
echo "   http://localhost:3000"
echo ""
echo "3. Test offline mode:"
echo "   - Open DevTools (F12)"
echo "   - Go to Network tab"
echo "   - Check 'Offline'"
echo "   - Refresh page"
echo "   - Converter still works! ✅"
echo ""
echo "4. Read documentation:"
echo "   cat START_HERE.md"
echo ""
echo "5. For production:"
echo "   pnpm build"
echo "   pnpm start"
echo ""
echo "📚 Documentation files:"
echo "   - START_HERE.md              ← Read this first!"
echo "   - README_REAL_TIME_DATA.md   ← Overview"
echo "   - QUICK_REFERENCE.md         ← Quick tips"
echo "   - SETUP.md                   ← Deployment"
echo ""
echo "💡 Tips:"
echo "   - No API key needed - works out of the box"
echo "   - Offline support - cached data for 24 hours"
echo "   - First load: ~500ms, Cached: ~50ms"
echo ""
echo "🎉 Happy converting!"
