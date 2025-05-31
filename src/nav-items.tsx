
import DashboardPage from "@/pages/dashboard/DashboardPage";
import { 
  Home,
  Users,
  Settings,
  Shield,
  FileText,
  Mail
} from "lucide-react";

export type NavItem = {
  title: string;
  to?: string;
  url?: string;
  icon: "home" | "users" | "settings" | "shield" | "fileText" | "mail";
  page?: React.FC;
  adminOnly?: boolean;
};

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    to: "/dashboard",
    icon: "home",
    page: DashboardPage,
  },
  {
    title: "Genesis Sentinel",
    to: "/admin/genesis-sentinel",
    icon: "shield",
    adminOnly: true,
  },
  {
    title: "Clients",
    to: "/admin/clients",
    icon: "users",
    adminOnly: true,
  },
  {
    title: "Blog",
    to: "/blog",
    icon: "fileText",
  },
  {
    title: "Contact",
    to: "/contact",
    icon: "mail",
  },
  {
    title: "Settings",
    to: "/admin/settings",
    icon: "settings",
    adminOnly: true,
  },
];
