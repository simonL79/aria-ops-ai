import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient } from "react-query";
import { Toaster } from "@/components/ui/toaster";
import DashboardPage from "@/pages/DashboardPage";
import MonitoringPage from "@/pages/MonitoringPage";
import EmployeeRiskPage from "@/pages/EmployeeRiskPage";
import EmergencyStrikePage from "@/pages/EmergencyStrikePage";
import SettingsPage from "@/pages/SettingsPage";
import { useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/LoginPage";
import { useEffect } from "react";
import StrikeManagementPage from '@/pages/StrikeManagementPage';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <QueryClient>
          <div className="min-h-screen bg-background">
            <Toaster />
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/monitoring" element={<MonitoringPage />} />
              <Route path="/employee-risk" element={<EmployeeRiskPage />} />
              <Route path="/emergency-strike" element={<EmergencyStrikePage />} />
              <Route path="/settings" element={<SettingsPage />} />

              <Route path="/strikes" element={<StrikeManagementPage />} />
              
            </Routes>
          </div>
        </QueryClient>
      </Router>
    </HelmetProvider>
  );
}

export default App;
