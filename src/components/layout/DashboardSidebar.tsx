
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import {
  Home,
  LayoutDashboard,
  ListChecks,
  ListOrdered,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  Search,
  AlertTriangle,
  BarChart4,
  Network,
  LucideIcon,
  Info,
  User
} from "lucide-react"
import { Link } from 'react-router-dom';
import { useAuth } from "@/hooks/useAuth";
import { useClerk, UserButton } from '@clerk/clerk-react';

// Define NavItem interface
export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
}

const navigation: NavItem[] = [
  {
    title: "Home",
    href: "/home",
    icon: Home,
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Command Center",
    href: "/dashboard/command-center",
    icon: ShieldCheck,
  },
  {
    title: "Mentions",
    href: "/dashboard/mentions",
    icon: MessageSquare,
  },
  {
    title: "Clients",
    href: "/clients",
    icon: Network,
  },
  {
    title: "Monitor",
    href: "/monitor",
    icon: Search,
  },
  {
    title: "Removal",
    href: "/removal",
    icon: AlertTriangle,
  },
  {
    title: "Analytics",
    href: "#",
    icon: BarChart4,
    disabled: true,
  },
  {
    title: "About",
    href: "/about",
    icon: Info,
  },
  {
    title: "Simon Lindsay",
    href: "/biography",
    icon: User,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export const DashboardSidebar = () => {
  const { signOut } = useClerk();
  const { user } = useAuth();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="hover:bg-secondary rounded-sm p-2 inline-flex items-center justify-center md:hidden">
          <Menu className="h-4 w-4" />
          <span className="sr-only">Open sidebar</span>
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-64 border-right p-0 pt-6">
        <SheetHeader className="pl-6 pr-6 pb-4">
          <SheetTitle>ARIA</SheetTitle>
          <SheetDescription>
            Threat Intelligence
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          {navigation.map((item) => (
            <div key={item.href} className="mb-2">
              <Link
                to={item.href}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            </div>
          ))}
        </div>
        <Separator className="my-6" />
        <div className="pl-6 pr-6">
          <div className="mb-2">
            <Link
              to="/settings"
              className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </div>
          <div className="mb-2">
            <Link
              to="#"
              className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Help</span>
            </Link>
          </div>
          <div className="mb-2">
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary w-full"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
