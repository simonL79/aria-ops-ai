
import {
  Route,
  Routes,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "./hooks/useAuth";

// Import all page components
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

// Import layouts
import DashboardLayout from "@/components/layout/DashboardLayout";
import PublicLayout from "@/components/layout/PublicLayout";

// Create a query client instance
const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-background">
          <Toaster />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <PublicLayout>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
                  <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h1 className="text-4xl font-bold text-gray-900">Welcome to A.R.I.A/EX™</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                      Advanced Reputation Intelligence & Analysis - Real-time protection for your name, your business, and your future.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                      <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">Dashboard</h3>
                        <p className="text-gray-600 mb-4">Access your intelligence dashboard</p>
                        <a href="/dashboard" className="text-blue-600 underline">Go to Dashboard</a>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">Strike Management</h3>
                        <p className="text-gray-600 mb-4">Emergency content takedown system</p>
                        <a href="/strikes" className="text-blue-600 underline">Access Strike Management</a>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">AI Scraping</h3>
                        <p className="text-gray-600 mb-4">Advanced content monitoring</p>
                        <a href="/ai-scraping" className="text-blue-600 underline">View AI Scraping</a>
                      </div>
                    </div>
                  </div>
                </div>
              </PublicLayout>
            } />
            
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

            <Route path="/admin/login" element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
                  <h1 className="text-2xl font-bold text-center mb-4">Admin Login</h1>
                  <p className="text-gray-600 text-center">Administrative access portal</p>
                </div>
              </div>
            } />

            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
