#!/bin/bash

# Disaster Heroes Project Setup Script
echo "🚀 Starting Disaster Heroes project setup..."

# Exit on any error
set -e

# Function to print colored output
print_status() {
    echo -e "\033[1;34m$1\033[0m"
}

print_success() {
    echo -e "\033[1;32m$1\033[0m"
}

print_error() {
    echo -e "\033[1;31m$1\033[0m"
}

# Check if Node.js is installed
print_status "📋 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18.x or higher."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_success "✅ Node.js $(node -v) is installed"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi

print_success "✅ npm $(npm -v) is installed"

# Install dependencies
print_status "📦 Installing project dependencies..."
npm install

print_success "✅ Dependencies installed successfully"

# Generate Prisma client
print_status "🔧 Generating Prisma client..."
npx prisma generate

print_success "✅ Prisma client generated"

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_status "📝 Creating .env file from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_status "⚠️  Please update .env file with your actual environment variables:"
        print_status "   - DATABASE_URL"
        print_status "   - NEXTAUTH_SECRET"
        print_status "   - GOOGLE_CLIENT_ID"
        print_status "   - GOOGLE_CLIENT_SECRET"
        print_status "   - NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"
        print_status "   - Firebase configuration variables"
    else
        print_error ".env.example file not found. Please create .env file manually."
    fi
else
    print_success "✅ .env file already exists"
fi

# Check if DATABASE_URL is set (basic check)
if [ -f ".env" ]; then
    if grep -q "DATABASE_URL=" .env && ! grep -q "DATABASE_URL=\"postgresql://user:password@localhost:5432/disaster_heroes\"" .env; then
        print_status "🗄️  Attempting to connect to database and run migrations..."
        
        # Try to run migrations (this will fail if DB is not accessible, but that's okay)
        if npx   migrate deploy 2>/dev/null; then
            print_success "✅ Database migrations completed"
        else
            print_status "⚠️  Database migrations skipped (database not accessible or already up to date)"
            print_status "   Run 'npx prisma migrate deploy' when database is ready"
        fi
        
        # Try to push schema (for development)
        if npx prisma db push 2>/dev/null; then
            print_success "✅ Database schema pushed"
        else
            print_status "⚠️  Database schema push skipped"
            print_status "   Run 'npx prisma db push' when database is ready"
        fi
    else
        print_status "⚠️  DATABASE_URL not configured in .env"
        print_status "   Please set up your database connection before running migrations"
    fi
fi

# Create necessary directories
print_status "📁 Creating necessary directories..."
mkdir -p tmp
mkdir -p public/uploads

print_success "✅ Directories created"

# Set proper permissions for upload directory
chmod 755 tmp 2>/dev/null || true
chmod 755 public/uploads 2>/dev/null || true

# Build the project (for production)
if [ "$NODE_ENV" = "production" ] || [ "$VERCEL" = "1" ]; then
    print_status "🏗️  Building project for production..."
    npm run build
    print_success "✅ Production build completed"
else
    print_status "🔧 Development setup completed"
    print_status "   Run 'npm run dev' to start development server"
    print_status "   Run 'npm run build' to build for production"
fi

# Final setup validation
print_status "🔍 Validating setup..."

# Check if Prisma client is working
if node -e "const { PrismaClient } = require('@prisma/client'); console.log('Prisma client imported successfully')" 2>/dev/null; then
    print_success "✅ Prisma client is working"
else
    print_error "❌ Prisma client validation failed"
fi

# Check if Next.js config is valid
if node -e "require('./next.config.ts')" 2>/dev/null || node -e "require('./next.config.js')" 2>/dev/null; then
    print_success "✅ Next.js configuration is valid"
else
    print_error "❌ Next.js configuration validation failed"
fi

print_success "🎉 Setup completed successfully!"
print_status ""
print_status "📋 Next steps:"
print_status "1. Update your .env file with actual environment variables"
print_status "2. Set up your PostgreSQL database"
print_status "3. Run database migrations: npx prisma migrate deploy"
print_status "4. Start the development server: npm run dev"
print_status ""
print_status "🔗 Useful commands:"
print_status "   npm run dev          - Start development server"
print_status "   npm run build        - Build for production"
print_status "   npm run start        - Start production server"
print_status "   npx prisma studio    - Open Prisma database studio"
print_status "   npx prisma migrate dev - Create and apply new migration"
print_status "   npx prisma db push   - Push schema changes to database"
print_status ""
print_success "🚀 Your Disaster Heroes project is ready!"
