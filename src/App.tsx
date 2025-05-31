
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminGuard from "@/components/auth/AdminGuard";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {navItems.map(({ to, page, requiresAuth, requiresAdmin }) => (
            <Route
              key={to}
              path={to}
              element={
                requiresAdmin ? (
                  <AdminGuard>
                    {page}
                  </AdminGuard>
                ) : requiresAuth ? (
                  <ProtectedRoute>
                    {page}
                  </ProtectedRoute>
                ) : (
                  page
                )
              }
            />
          ))}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
