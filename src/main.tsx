
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './hooks/useAuth'
import { RbacProvider } from './hooks/useRbac'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { Toaster } from 'sonner'

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <RbacProvider>
        <App />
        <Toaster richColors />
      </RbacProvider>
    </AuthProvider>
  </BrowserRouter>
);
