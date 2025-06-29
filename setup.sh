#!/bin/bash

echo "🚀 Starting Disaster Heroes project setup..."

# Exit on any error
set -e

# Print environment variables for debugging
echo "🔍 Environment Variables Check:"
echo "NEXTAUTH_URL: ${NEXTAUTH_URL:-'NOT SET'}"


echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations if DATABASE_URL is available
if [ -n "$DATABASE_URL" ]; then
  echo "🗄️ Running database migrations..."
  npx prisma migrate deploy
else
  echo "⚠️ DATABASE_URL not found, skipping migrations"
fi

echo "✅ Setup completed!"
