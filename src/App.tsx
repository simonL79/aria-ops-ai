
import React, { Suspense } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import { Skeleton } from "@/components/ui/skeleton";
import "@/styles/responsive.css";

// Lazy load routes for better performance
const Index = React.lazy(() => import("./pages/Index"));
const Login = React.lazy(() => import("./pages/Login"));
const DashboardPage = React.lazy(() => import("./pages/dashboard/DashboardPage"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const QATestingPage = React.lazy(() => import("./pages/admin/QATestingPage"));
const AnubisMemoryPage = React.lazy(() => import("./pages/admin/AnubisMemoryPage"));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-corporate-dark p-6">
    <div className="space-y-6">
      <Skeleton className="h-16 bg-corporate-darkSecondary" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-32 bg-corporate-darkSecondary" />
        <Skeleton className="h-32 bg-corporate-darkSecondary" />
        <Skeleton className="h-32 bg-corporate-darkSecondary" />
      </div>
      <Skeleton className="h-96 bg-corporate-darkSecondary" />
    </div>
  </div>
);

function App() {
  usePerformanceMonitor('App');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Login />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/qa-testing" element={<QATestingPage />} />
              <Route path="/admin/anubis-memory" element={<AnubisMemoryPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
