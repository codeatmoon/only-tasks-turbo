# Firebase Hosting Setup for Only-Tasks App

This document explains how to configure and deploy the only-tasks Next.js app to Firebase Hosting.

## Overview

The only-tasks app has been configured to support Firebase Hosting deployment through GitHub Actions. The setup includes:

- Static export build configuration
- Firebase configuration files
- GitHub workflow for automated deployment
- Demo static pages for showcase

## Configuration Files

### 1. Firebase Configuration (`firebase.json`)
- Configures hosting settings
- Sets up rewrites for SPA behavior
- Defines security headers
- Points to `out` directory for static files

### 2. Firebase Project Configuration (`.firebaserc`)
- Defines the Firebase project ID (`only-tasks-app`)
- Can be updated to match your actual Firebase project

### 3. Next.js Configuration (`next.config.js`)
- Supports conditional static export based on `FIREBASE_BUILD` environment variable
- Enables image optimization bypass for static hosting
- Preserves security headers

### 4. Build Script (`scripts/build-firebase.sh`)
- Temporarily excludes API routes during static build
- Runs Next.js static export
- Restores API routes after build

## Deployment Setup

### Prerequisites

1. **Firebase Project**: Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. **Firebase CLI**: Install globally with `npm install -g firebase-tools`
3. **GitHub Secrets**: Configure the following in your repository secrets:
   - `FIREBASE_SERVICE_ACCOUNT_ONLY_TASKS_APP`: Service account JSON for Firebase

### GitHub Secrets Setup

1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate a new private key (JSON format)
3. Add this JSON as a GitHub secret named `FIREBASE_SERVICE_ACCOUNT_ONLY_TASKS_APP`

### Local Development

```bash
# Normal development build (with API routes)
yarn dev

# Standard production build
yarn build

# Firebase hosting build (static export)
yarn build:firebase
```

### Firebase Project Configuration

Update `.firebaserc` with your actual Firebase project ID:

```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

## GitHub Workflow

The deployment workflow (`.github/workflows/firebase-deploy.yml`) automatically:

1. Triggers on push to `main` branch or manual dispatch
2. Installs dependencies
3. Runs linting and type checking
4. Builds the app for Firebase hosting
5. Deploys to Firebase Hosting

## Static Export Limitations

When deployed to Firebase Hosting, the app operates in static mode with the following limitations:

- **API Routes**: Not available in static build (temporarily excluded during build)
- **Server-Side Rendering**: Converted to static generation
- **Dynamic Routes**: Pre-generated for demo spaces (`demo`, `sample`, `example`)

## Demo Configuration

The static build includes pre-generated pages for:
- `/demo` - Demo space
- `/sample` - Sample space  
- `/example` - Example space

These can be customized by updating the `generateStaticParams` function in `app/[spaceid]/layout.tsx`.

## Manual Deployment

For manual deployment:

```bash
# Build for Firebase
yarn build:firebase

# Deploy to Firebase (requires Firebase CLI authentication)
firebase deploy --only hosting
```

## Troubleshooting

### Build Issues
- Ensure all dynamic routes have `generateStaticParams` functions
- Check that metadata routes include `export const dynamic = 'force-static'`
- Verify API routes are properly excluded during Firebase builds

### Deployment Issues
- Confirm Firebase project ID matches in `.firebaserc`
- Verify GitHub secrets are correctly configured
- Check that service account has proper permissions

## Production Considerations

For production deployment:

1. **Custom Domain**: Configure in Firebase Console → Hosting
2. **Environment Variables**: Set `NEXT_PUBLIC_APP_URL` for proper absolute URLs
3. **Analytics**: Enable Firebase Analytics if needed
4. **Performance**: Monitor using Firebase Performance Monitoring

## Development vs Production

- **Development**: Full Next.js app with API routes and server-side rendering
- **Firebase Hosting**: Static export optimized for hosting with demo functionality

This setup allows you to maintain full development capabilities while providing a deployable static version for Firebase Hosting.