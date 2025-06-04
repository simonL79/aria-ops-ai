
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/hooks/useAuth';
import HomePage from '@/pages/HomePage';
import BlogPage from '@/pages/BlogPage';
import BlogPostPage from '@/pages/BlogPostPage';
import ContactPage from '@/pages/ContactPage';
import AboutPage from '@/pages/AboutPage';
import ReputationScanPage from '@/pages/ReputationScanPage';
import Authentication from '@/pages/Authentication';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Lazy load dashboard and admin components
const AdminDashboard = lazy(() => import('@/components/admin/AdminDashboard'));
const ClientIntakePage = lazy(() => import('@/pages/ClientIntakePage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Helmet>
                <title>Simon Lindsay | Reputation Management & Digital Intelligence</title>
                <meta name="description" content="Advanced reputation management and digital intelligence services powered by A.R.I.A technology." />
              </Helmet>
              
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:slug" element={<BlogPostPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/reputation-scan" element={<ReputationScanPage />} />
                  <Route path="/auth" element={<Authentication />} />
                  <Route path="/reset-password" element={<Authentication />} />
                  
                  {/* Hidden client intake route */}
                  <Route path="/client-intake" element={<ClientIntakePage />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/*" element={<AdminDashboard />} />
                </Routes>
              </Suspense>
              
              <Toaster 
                position="top-right" 
                expand={false} 
                richColors 
                closeButton
                toastOptions={{
                  style: {
                    background: '#1a1b23',
                    color: '#ffffff',
                    border: '1px solid #2a2b35'
                  }
                }}
              />
            </div>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
