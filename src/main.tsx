
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { AuthProvider } from './hooks/useAuth'
import App from './App.tsx'
import './index.css'
import { toast, Toaster } from 'sonner'

// Get the Clerk publishable key
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Check if key is available
if (!CLERK_PUBLISHABLE_KEY) {
  console.error('Clerk publishable key is missing. Please set the VITE_CLERK_PUBLISHABLE_KEY environment variable.');
}

// Fallback key for development only - REMOVE THIS IN PRODUCTION
// This is just to prevent the app from crashing during development
const developmentFallbackKey = 'pk_test_Y29vbC1idWxsZHJvZy04MC5jbGVyay5hY2NvdW50cy5kZXYk';

// Use fallback key only in development mode when main key is missing
const effectiveKey = CLERK_PUBLISHABLE_KEY || (import.meta.env.DEV ? developmentFallbackKey : '');

createRoot(document.getElementById("root")!).render(
  <ClerkProvider 
    publishableKey={effectiveKey}
    appearance={{
      variables: { colorPrimary: '#0f766e' }
    }}
    signInUrl="/auth"
    signUpUrl="/auth"
    afterSignInUrl="/dashboard"
    afterSignUpUrl="/dashboard"
  >
    <AuthProvider>
      <App />
    </AuthProvider>
    <Toaster />
  </ClerkProvider>
);
