
import React, { Suspense } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import "@/styles/responsive.css";

// Lazy load routes for better performance
const Index = React.lazy(() => import("./pages/Index"));
const DashboardPage = React.lazy(() => import("./pages/dashboard/DashboardPage"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const QATestingPage = React.lazy(() => import("./pages/admin/QATestingPage"));
const AnubisMemoryPage = React.lazy(() => import("./pages/admin/AnubisMemoryPage"));
const IntelligenceCorePage = React.lazy(() => import("./pages/admin/IntelligenceCorePage"));
const PersonaSaturationPage = React.lazy(() => import("./pages/admin/PersonaSaturationPage"));
const LegalOpsPage = React.lazy(() => import("./pages/admin/LegalOpsPage"));
const ClientsPage = React.lazy(() => import("./pages/admin/ClientsPage"));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1, // Reduce retries for faster error handling
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
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/qa-testing" element={<QATestingPage />} />
              <Route path="/admin/anubis-memory" element={<AnubisMemoryPage />} />
              <Route path="/admin/intelligence-core" element={<IntelligenceCorePage />} />
              <Route path="/admin/persona-saturation" element={<PersonaSaturationPage />} />
              <Route path="/admin/legal-ops" element={<LegalOpsPage />} />
              <Route path="/admin/clients" element={<ClientsPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
