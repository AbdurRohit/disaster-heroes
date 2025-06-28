#!/bin/bash

echo "🚀 Starting Disaster Heroes project setup..."

echo "📦 Installing project dependencies..."
npm install

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "✅ Setup completed!"

