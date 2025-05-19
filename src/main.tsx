
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

// Set the Clerk publishable key
const CLERK_PUBLISHABLE_KEY = 'pk_test_cG9saXRlLXBpZ2xldC0yNS5jbGVyay5hY2NvdW50cy5kZXYk';

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
);
