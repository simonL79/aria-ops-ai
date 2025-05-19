
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
  console.error('Clerk publishable key is missing. Setting to provided fallback key.');
}

// Use the provided key
const effectiveKey = 'pk_test_cG9saXRlLXBpZ2xldC0yNS5jbGVyay5hY2NvdW50cy5kZXYk';

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
