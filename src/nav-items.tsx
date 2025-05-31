
import { HomeIcon, Settings, BarChart3, Shield, Users, Search, Activity, Target } from "lucide-react";
import Index from "./pages/Index";
import DashboardPage from "./pages/dashboard/DashboardPage";
import MentionsPage from "./pages/dashboard/MentionsPage";
import MonitoringPage from "./pages/dashboard/MonitoringPage";
import SentinelPage from "./pages/dashboard/SentinelPage";

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
    icon: <BarChart3 className="h-4 w-4" />,
    page: <DashboardPage />,
    requiresAuth: true,
    requiresAdmin: true,
  },
  {
    title: "Mentions",
    to: "/mentions",
    icon: <Search className="h-4 w-4" />,
    page: <MentionsPage />,
    requiresAuth: true,
    requiresAdmin: true,
  },
  {
    title: "Monitoring",
    to: "/monitoring",
    icon: <Activity className="h-4 w-4" />,
    page: <MonitoringPage />,
    requiresAuth: true,
    requiresAdmin: true,
  },
  {
    title: "Sentinel Protocol",
    to: "/sentinel",
    icon: <Target className="h-4 w-4" />,
    page: <SentinelPage />,
    requiresAuth: true,
    requiresAdmin: true,
  },
];
