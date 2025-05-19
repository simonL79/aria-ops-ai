
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

createRoot(document.getElementById("root")!).render(
  <ClerkProvider 
    publishableKey={CLERK_PUBLISHABLE_KEY}
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
