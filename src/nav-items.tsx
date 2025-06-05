
import { HomeIcon, ShieldIcon, Users, BarChart3, Settings, Target, Brain, Zap, Activity } from "lucide-react";
import Index from "./pages/Index.jsx";
import Dashboard from "./pages/Dashboard.tsx";
import RSI from "./pages/RSI";
import AdminDashboard from "./pages/AdminDashboard";
import ControlCenterPage from "./pages/admin/ControlCenterPage";
import ClientOnboardingPage from "./pages/ClientOnboardingPage";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Dashboard",
    to: "/dashboard",
    icon: <ShieldIcon className="h-4 w-4" />,
    page: <Dashboard />,
  },
  {
    title: "RSI",
    to: "/rsi",
    icon: <Activity className="h-4 w-4" />,
    page: <RSI />,
  },
  {
    title: "Admin Dashboard",
    to: "/admin",
    icon: <BarChart3 className="h-4 w-4" />,
    page: <AdminDashboard />,
  },
  {
    title: "Control Center",
    to: "/admin/control-center",
    icon: <Brain className="h-4 w-4" />,
    page: <ControlCenterPage />,
  },
  {
    title: "Client Onboarding",
    to: "/admin/client-onboarding",
    icon: <Users className="h-4 w-4" />,
    page: <ClientOnboardingPage />,
  },
];
