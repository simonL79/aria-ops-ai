
import {
  Route,
  Routes,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "./hooks/useAuth";

// Import all page components
import Index from "@/pages/Index";
import StrikeManagementPage from '@/pages/StrikeManagementPage';
import DashboardPage from "@/pages/dashboard/DashboardPage";
import AiScrapingPage from "@/pages/AiScrapingPage";
import CleanLaunchPage from "@/pages/CleanLaunchPage";
import { ExecutiveReportsPage } from "@/pages/ExecutiveReportsPage";
import SettingsPage from "@/pages/Settings";
import { UsersPage } from "@/pages/UsersPage";
import HyperCorePage from "@/pages/HyperCorePage";
import Discovery from "@/pages/Discovery";
import EideticPage from "@/pages/EideticPage";
import RSI from "@/pages/RSI";
import GraveyardPage from "@/pages/GraveyardPage";
import AnubisCockpitPage from "@/pages/AnubisCockpitPage";
import CalendarPage from "@/pages/CalendarPage";
import ScanPage from "@/pages/ScanPage";
import Terms from "@/pages/Terms";
import EmergencyStrikePage from "@/pages/EmergencyStrikePage";
import SovraPage from "@/pages/SovraPage";
import InfluencerRadar from "@/pages/InfluencerRadar";
import QATestPage from "@/pages/QATestPage";
import NotFound from "@/pages/NotFound";
import AdminLogin from "@/pages/AdminLogin";

// Import layouts
import DashboardLayout from "@/components/layout/DashboardLayout";
import PublicLayout from "@/components/layout/PublicLayout";

// Import live data components
import LiveDataGuard from "@/components/dashboard/LiveDataGuard";

// Create a query client instance
const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <LiveDataGuard enforceStrict={true}>
          <div className="min-h-screen bg-background">
            <Toaster />
            <Routes>
              {/* Standalone Index Route - Full luxurious A.R.I.A™ design */}
              <Route path="/" element={<Index />} />
              
              {/* Public Routes with Layout */}
              <Route path="/about" element={
                <PublicLayout>
                  <div className="container mx-auto py-12 px-6">
                    <h1 className="text-3xl font-bold mb-6">About A.R.I.A™</h1>
                    <p className="text-lg text-gray-600">Advanced Reputation Intelligence & Analysis platform for comprehensive digital protection.</p>
                  </div>
                </PublicLayout>
              } />

              <Route path="/blog" element={
                <PublicLayout>
                  <div className="container mx-auto py-12 px-6">
                    <h1 className="text-3xl font-bold mb-6">Blog</h1>
                    <p className="text-lg text-gray-600">Latest insights and updates from A.R.I.A™</p>
                  </div>
                </PublicLayout>
              } />

              <Route path="/scan" element={<ScanPage />} />
              <Route path="/terms" element={<Terms />} />

              {/* Dashboard Routes */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/*" element={<DashboardPage />} />

              {/* Feature Pages */}
              <Route path="/discovery" element={<Discovery />} />
              <Route path="/hypercore" element={<HyperCorePage />} />
              <Route path="/ai-scraping" element={<AiScrapingPage />} />
              <Route path="/clean-launch" element={<CleanLaunchPage />} />
              <Route path="/executive-reports" element={<ExecutiveReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/users" element={<UsersPage />} />

              {/* Intelligence Pages */}
              <Route path="/eidetic" element={<EideticPage />} />
              <Route path="/rsi" element={<RSI />} />
              <Route path="/graveyard" element={<GraveyardPage />} />
              <Route path="/anubis-cockpit" element={<AnubisCockpitPage />} />

              {/* Strike Management */}
              <Route path="/strikes" element={<StrikeManagementPage />} />
              <Route path="/emergency-strike" element={<EmergencyStrikePage />} />

              {/* Advanced Features */}
              <Route path="/sovra" element={<SovraPage />} />
              <Route path="/influencer-radar" element={<InfluencerRadar />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/qa-test" element={<QATestPage />} />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <DashboardLayout>
                  <div className="container mx-auto p-6">
                    <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Administrative controls and system management.</p>
                  </div>
                </DashboardLayout>
              } />

              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </LiveDataGuard>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
