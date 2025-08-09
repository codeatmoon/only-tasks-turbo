#!/bin/bash

# Script to build for Firebase hosting by temporarily handling API routes

echo "Building for Firebase hosting..."

# Create backup of API routes outside the app directory
if [ -d "app/api" ]; then
  echo "Backing up API routes..."
  mv app/api ../api.backup
fi

# Build the app for static export
echo "Building Next.js app..."
FIREBASE_BUILD=true yarn build

# Restore API routes
if [ -d "../api.backup" ]; then
  echo "Restoring API routes..."
  mv ../api.backup app/api
fi

echo "Firebase build complete!"