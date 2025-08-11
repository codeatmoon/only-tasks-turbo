# Firebase Authentication Setup Guide

This guide explains how to configure Firebase authentication for OnlyTasks, including the new email link (magic link) authentication feature.

## Quick Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project or use existing one
   - Enable Authentication in the console

2. **Configure Authentication Methods**
   - Go to Authentication > Sign-in method
   - Enable **Email/Password** authentication
   - Enable **Email Link (passwordless sign-in)** authentication
   - Add your domain to authorized domains (e.g., `localhost`, your production domain)

3. **Get Configuration Keys**
   - Go to Project Settings > General tab
   - Scroll down to "Your apps" section
   - Click on web app or create new web app
   - Copy the configuration object

4. **Environment Variables**
   Create `.env.local` in the `apps/only-tasks` directory with:

   ```env
   # Firebase Client Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id

   # App URL (for email link verification)
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

## Authentication Methods Available

### 1. Email/Password Authentication
- Traditional signup with email, password, and full name
- Sign in with email and password
- Secure password validation and confirmation

### 2. Email Link Authentication (Magic Link)
- Passwordless authentication via email
- User enters email, receives verification link
- Clicking link automatically signs them in
- More secure and user-friendly option

### 3. Google OAuth
- One-click sign in with Google account
- Managed by Firebase Auth
- No additional setup required once Firebase is configured

## Email Link Authentication Flow

1. **User initiates magic link request**
   - User selects "Magic Link" authentication method
   - Enters email address
   - Clicks "Send Magic Link"

2. **Email sent**
   - Firebase sends email with verification link
   - Link contains encoded authentication token
   - User sees confirmation message

3. **User clicks email link**
   - Link redirects to `/auth/verify` page
   - Page validates the link and email
   - User is automatically signed in
   - Redirected to dashboard

## Customizing Email Templates

1. Go to Authentication > Templates in Firebase Console
2. Edit the "Email address sign-in" template
3. Customize the email content and styling
4. Test with your domain

## Production Considerations

1. **Domain Authorization**
   - Add your production domain to Firebase Auth settings
   - Update `NEXT_PUBLIC_APP_URL` environment variable

2. **Email Security**
   - Use a custom email provider for better deliverability
   - Configure SPF, DKIM, and DMARC records

3. **Error Handling**
   - Monitor authentication errors in Firebase Console
   - Set up proper error logging and alerts

## Troubleshooting

### Common Issues

1. **"Firebase: Error (auth/invalid-credential)"**
   - Check that Firebase configuration is correct
   - Ensure all environment variables are set
   - Verify Firebase project has authentication enabled

2. **Email links not working**
   - Check that domain is authorized in Firebase Console
   - Verify `NEXT_PUBLIC_APP_URL` matches your domain
   - Ensure email link authentication is enabled

3. **"Firebase authentication is not properly configured"**
   - Check that all required environment variables are present
   - Verify Firebase project ID and API key are correct
   - Ensure Firebase app is properly initialized

### Development Tips

- Use Firebase Local Emulator Suite for development
- Test email links in different browsers and email clients
- Monitor Firebase Console for authentication events and errors
- Use browser developer tools to debug client-side issues