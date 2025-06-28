#!/bin/bash

# Disaster Heroes Project Setup Script
echo "🚀 Starting Disaster Heroes project setup..."

# Exit on any error
set -e

# Install dependencies
echo "📦 Installing project dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p tmp
mkdir -p public/uploads

# Set permissions
chmod 755 tmp
chmod 755 public/uploads

echo "✅ Setup completed!"
echo "Update your .env file and run: npm run dev"
