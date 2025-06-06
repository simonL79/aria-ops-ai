import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/hooks/useAuth';
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ScanPage from "./pages/ScanPage";
import BlogPage from "./pages/BlogPage";
import ContactPage from "./pages/ContactPage";
import PricingPage from "./pages/PricingPage";
import SimonLindsayPage from "./pages/SimonLindsayPage";
import AdminLogin from "./pages/AdminLogin";
import Authentication from "./pages/Authentication";
import RSI from "./pages/RSI";
import ClientOnboardingPage from "./pages/ClientOnboardingPage";
import AdminGuard from "@/components/auth/AdminGuard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminDashboard from "@/components/admin/AdminDashboard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    const initializeSystem = async () => {
      try {
        console.log('🚀 Starting A.R.I.A/EX™ System...');
        
        // Initialize A.R.I.A™ Core with live data enforcement
        await initializeARIACore();
        
        console.log('✅ A.R.I.A™ Core Services initialized successfully');
        
      } catch (error) {
        console.error('❌ A.R.I.A™ System initialization failed:', error);
      }
    };
    
    initializeSystem();
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/index" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/scan" element={<ScanPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/simon-lindsay" element={<SimonLindsayPage />} />
                
                {/* Authentication Routes */}
                <Route path="/auth" element={<Authentication />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                
                {/* Protected User Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <RSI />
                  </ProtectedRoute>
                } />
                
                {/* Admin Protected Routes */}
                <Route path="/admin/*" element={
                  <AdminGuard>
                    <DashboardLayout>
                      <AdminDashboard />
                    </DashboardLayout>
                  </AdminGuard>
                } />
                
                {/* Client Onboarding - Admin Only */}
                <Route path="/client-onboarding" element={
                  <AdminGuard>
                    <ClientOnboardingPage />
                  </AdminGuard>
                } />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
