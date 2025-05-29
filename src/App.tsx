
import {
  Route,
  Routes,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "./hooks/useAuth";
import StrikeManagementPage from '@/pages/StrikeManagementPage';

// Create a query client instance
const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-background">
          <Toaster />
          <Routes>
            <Route path="/" element={<div className="p-8"><h1 className="text-2xl">Welcome to A.R.I.A/EX™</h1><p><a href="/strikes" className="text-blue-600 underline">Access Strike Management</a></p></div>} />
            <Route path="/strikes" element={<StrikeManagementPage />} />
          </Routes>
        </div>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
