
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Index from '@/pages/Index';
import Authentication from '@/pages/Authentication';
import Monitor from '@/pages/Monitor';
import Clients from '@/pages/Clients';
import Removal from '@/pages/Removal';
import CommandCenterPage from '@/pages/dashboard/CommandCenterPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function App() {
  const { isSignedIn, isLoaded } = useUser();

  // Show a simple loading state while Clerk loads
  if (!isLoaded) {
    return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={isSignedIn ? <Navigate to="/dashboard" /> : <Navigate to="/signin" />} />
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
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
