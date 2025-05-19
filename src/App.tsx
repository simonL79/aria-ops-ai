
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { RbacProvider } from '@/hooks/useRbac';
import Index from '@/pages/Index';
import Authentication from '@/pages/Authentication';
import Monitor from '@/pages/Monitor';
import Clients from '@/pages/Clients';
import Removal from '@/pages/Removal';
import Settings from '@/pages/Settings';
import CommandCenterPage from '@/pages/dashboard/CommandCenterPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Toaster } from 'sonner';

function App() {
  const { isLoaded } = useUser();

  // Show a loading state while Clerk loads
  if (!isLoaded) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center">
        <div className="animate-pulse rounded-md bg-muted h-12 w-64 mb-4" />
        <div className="animate-pulse rounded-md bg-muted h-4 w-48" />
      </div>
    );
  }

  return (
    <RbacProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/signin/*" element={<Authentication />} />
          <Route path="/signup/*" element={<Authentication />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/command-center" element={
            <ProtectedRoute>
              <CommandCenterPage />
            </ProtectedRoute>
          } />
          <Route path="/monitor" element={
            <ProtectedRoute>
              <Monitor />
            </ProtectedRoute>
          } />
          <Route path="/clients" element={
            <ProtectedRoute>
              <Clients />
            </ProtectedRoute>
          } />
          <Route path="/removal" element={
            <ProtectedRoute>
              <Removal />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/settings/security" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </RbacProvider>
  );
}

export default App;
