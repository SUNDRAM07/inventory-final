#!/bin/bash

# Inventory Management Tool - Vercel Deployment Script

echo "🚀 Starting deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel..."
    vercel login
fi

echo "📦 Deploying backend..."
# Deploy backend from root directory
vercel --prod

echo "🎨 Deploying frontend..."
# Deploy frontend
cd frontend
vercel --prod
cd ..

echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your database (Supabase, Railway, or Neon)"
echo "2. Configure environment variables in Vercel dashboard"
echo "3. Update CORS settings with your frontend URL"
echo "4. Test your application"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions" 