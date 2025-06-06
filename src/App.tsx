
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
import "./App.css";

const queryClient = new QueryClient();

const App = () => {
  console.log('App component rendering...');
  
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/index" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/scan" element={<ScanPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/simon-lindsay" element={<SimonLindsayPage />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
