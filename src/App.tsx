
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import DashboardPage from "./pages/dashboard/DashboardPage";
import AdminLogin from "./pages/AdminLogin";
import AriaCommand from "./pages/AriaCommand";
import ThreatsManagement from "./pages/ThreatsManagement";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<DashboardPage />} />
              <Route path="/aria-command" element={<AriaCommand />} />
              <Route path="/threats-management" element={<ThreatsManagement />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
