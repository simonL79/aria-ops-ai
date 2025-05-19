
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { AuthProvider } from './hooks/useAuth'
import App from './App.tsx'
import './index.css'
import { toast } from 'sonner'

// Get the Clerk publishable key
// Providing a fallback key for development/testing purposes
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_Z29vZC1jb2NrYXRvby05MC5jbGVyay5hY2NvdW50cy5kZXYk';

// Display a warning if using the fallback key
if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  console.warn('Using fallback Clerk Publishable Key. For production, set the VITE_CLERK_PUBLISHABLE_KEY environment variable.');
  console.log('Current key being used:', CLERK_PUBLISHABLE_KEY);
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider 
    publishableKey={CLERK_PUBLISHABLE_KEY}
    appearance={{
      variables: { colorPrimary: '#0f766e' }
    }}
    // Replace afterSignInUrl and afterSignUpUrl with redirectUrl
    fallbackRedirectUrl="/dashboard"
    onLoaded={() => {
      console.log("Clerk loaded successfully");
    }}
  >
    <AuthProvider>
      <App />
    </AuthProvider>
  </ClerkProvider>
);
