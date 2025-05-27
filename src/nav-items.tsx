import { HomeIcon, Users, Activity, UserCheck, AlertTriangle, Shield, Brain, Target, Building2, TrendingUp, FileText, Zap } from "lucide-react";
import Index from "./pages/Index";
import ClientsPage from "./pages/ClientsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import IntelligenceWorkbench from "./pages/intelligence/IntelligenceWorkbench";
import EnhancedIntelligenceWorkbench from "./pages/intelligence/EnhancedIntelligenceWorkbench";
import OffensiveOperations from "./pages/intelligence/OffensiveOperations";
import AdminDashboard from "./pages/AdminDashboard";
import QATestPage from "./pages/QATestPage";
import AiScrapingPage from "./pages/AiScrapingPage";
import CleanLaunchPage from "./pages/CleanLaunchPage";
import BlogPage from "./pages/BlogPage";
import ReputationScanPage from "./pages/ReputationScanPage";

export const navItems = [
  {
    title: "Dashboard",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Clients",
    to: "/clients",
    icon: <Users className="h-4 w-4" />,
    page: <ClientsPage />,
  },
  {
    title: "Analytics",
    to: "/analytics", 
    icon: <Activity className="h-4 w-4" />,
    page: <AnalyticsPage />,
  },
  {
    title: "Intelligence Workbench",
    to: "/intelligence/workbench",
    icon: <Brain className="h-4 w-4" />,
    page: <IntelligenceWorkbench />,
  },
  {
    title: "Enhanced Intelligence",
    to: "/intelligence/enhanced",
    icon: <Shield className="h-4 w-4" />,
    page: <EnhancedIntelligenceWorkbench />,
  },
  {
    title: "Offensive Operations",
    to: "/intelligence/offensive-operations",
    icon: <Target className="h-4 w-4" />,
    page: <OffensiveOperations />,
  },
  {
    title: "Admin",
    to: "/admin",
    icon: <UserCheck className="h-4 w-4" />,
    page: <AdminDashboard />,
  },
  {
    title: "QA Testing",
    to: "/qa-test",
    icon: <AlertTriangle className="h-4 w-4" />,
    page: <QATestPage />,
  },
  {
    title: "AI Scraping",
    to: "/ai-scraping",
    icon: <Zap className="h-4 w-4" />,
    page: <AiScrapingPage />,
  },
  {
    title: "Clean Launch",
    to: "/clean-launch",
    icon: <Building2 className="h-4 w-4" />,
    page: <CleanLaunchPage />,
  },
  {
    title: "Blog",
    to: "/blog",
    icon: <FileText className="h-4 w-4" />,
    page: <BlogPage />,
  },
  {
    title: "Reputation Scan",
    to: "/reputation-scan",
    icon: <TrendingUp className="h-4 w-4" />,
    page: <ReputationScanPage />,
  },
];
