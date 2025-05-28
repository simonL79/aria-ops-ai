import DashboardPage from "@/pages/dashboard/DashboardPage";
import AiScrapingPage from "@/pages/AiScrapingPage";
import CleanLaunchPage from "@/pages/CleanLaunchPage";
import { ExecutiveReportsPage } from "@/pages/ExecutiveReportsPage";
import SettingsPage from "@/pages/Settings";
import { UsersPage } from "@/pages/UsersPage";
import HyperCorePage from "@/pages/HyperCorePage";
import { 
  Home,
  Search,
  Users,
  BarChart3,
  Settings,
  ShieldCheck,
  Bot,
  Radar,
  FileText,
  Zap,
  Shield,
  Brain,
  Eye,
  Target,
  Layers,
  Gauge,
  AlertTriangle,
  Clock,
  MessageSquare,
  Building,
  UserCheck,
  Calendar,
  LifeBuoy,
  HelpCircle,
  Lock,
  Globe,
  FileX,
  Trash2,
  UserPlus,
  Calculator,
  AlertOctagon
} from "lucide-react";

export type NavItem = {
  title: string;
  to: string;
  icon:
    | "home"
    | "layout"
    | "settings"
    | "users"
    | "zap"
    | "fileAnalytics"
    | "shield";
  page: React.FC;
};

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    to: "/dashboard",
    icon: "home",
    page: DashboardPage,
  },
  {
    title: "HyperCore",
    to: "/hypercore",
    icon: "shield",
    page: HyperCorePage,
  },
  {
    title: "AI Scraping",
    to: "/ai-scraping",
    icon: "zap",
    page: AiScrapingPage,
  },
  {
    title: "Clean Launch",
    to: "/clean-launch",
    icon: "layout",
    page: CleanLaunchPage,
  },
  {
    title: "Executive Reports",
    to: "/executive-reports",
    icon: "fileAnalytics",
    page: ExecutiveReportsPage,
  },
  {
    title: "Users",
    to: "/users",
    icon: "users",
    page: UsersPage,
  },
  {
    title: "Settings",
    to: "/settings",
    icon: "settings",
    page: SettingsPage,
  },
  {
    title: "A.R.I.A/EX™ Emergency",
    url: "/emergency-strike",
    icon: AlertOctagon,
    adminOnly: true,
  },
];
