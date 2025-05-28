
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import AiScrapingPage from "@/pages/AiScrapingPage";
import CleanLaunchPage from "@/pages/CleanLaunchPage";
import { ExecutiveReportsPage } from "@/pages/ExecutiveReportsPage";
import SettingsPage from "@/pages/Settings";
import { UsersPage } from "@/pages/UsersPage";
import HyperCorePage from "@/pages/HyperCorePage";

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
];
