
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

// Get the Clerk publishable key from environment variables
// or use a dummy key for development
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 
  // This is a placeholder key for development only
  'pk_test_placeholder_key_for_development';

// In production, we should still validate the key
if (import.meta.env.PROD && !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  console.warn("Warning: Running in production without a valid Clerk Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
);
