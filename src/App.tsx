
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import HomePage from '@/pages/HomePage';
import BlogPage from '@/pages/BlogPage';
import BlogPostPage from '@/pages/BlogPostPage';
import ContactPage from '@/pages/ContactPage';
import AboutPage from '@/pages/AboutPage';
import ReputationScanPage from '@/pages/ReputationScanPage';
import AuthPage from '@/pages/AuthPage';
import PasswordResetPage from '@/pages/PasswordResetPage';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Lazy load dashboard and admin components
const DashboardHomePage = lazy(() => import('@/pages/dashboard/DashboardHomePage'));
const ClientsPage = lazy(() => import('@/pages/dashboard/ClientsPage'));
const AiScrapingPage = lazy(() => import('@/pages/dashboard/AiScrapingPage'));
const CompliancePage = lazy(() => import('@/pages/dashboard/CompliancePage'));
const ScanSubmissionsPage = lazy(() => import('@/pages/dashboard/ScanSubmissionsPage'));
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
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/reset-password" element={<PasswordResetPage />} />
                
                {/* Hidden client intake route */}
                <Route path="/client-intake" element={<ClientIntakePage />} />
                
                {/* Dashboard Routes */}
                <Route path="/dashboard" element={<DashboardHomePage />} />
                <Route path="/dashboard/clients" element={<ClientsPage />} />
                <Route path="/dashboard/ai-scraping" element={<AiScrapingPage />} />
                <Route path="/dashboard/compliance" element={<CompliancePage />} />
                <Route path="/dashboard/scan-submissions" element={<ScanSubmissionsPage />} />
                
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
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
