
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import AnubisGPTCockpit from "./pages/AnubisGPTCockpit";
import OperatorConsole from "./pages/OperatorConsole";
import Authentication from "./pages/Authentication";
import AdminLogin from "./pages/AdminLogin";
import DashboardPage from "./pages/dashboard/DashboardPage";
import QATestPage from "./pages/QATestPage";
import NotFound from "./pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/qa-test" element={<QATestPage />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/anubis-gpt" element={<AnubisGPTCockpit />} />
          <Route path="/operator-console" element={<OperatorConsole />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
