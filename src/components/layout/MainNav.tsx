
import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bell,
  CreditCard,
  Home,
  Settings,
  Users,
  Radio,
  Shield,
  Trash,
  Eye,
  FileText,
  MessageSquare,
  LogIn
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

interface MainNavProps {
  className?: string;
}

export function MainNav({ className }: MainNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // If not authenticated, only show limited navigation
  if (!isAuthenticated) {
    return (
      <div className={cn("flex items-center justify-between w-full", className)}>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            to="/"
            className={cn(
              "transition-colors hover:text-foreground/80",
              location.pathname === "/" ? "text-foreground font-medium" : "text-foreground/60"
            )}
          >
            Home
          </Link>
          <Link
            to="/pricing"
            className={cn(
              "transition-colors hover:text-foreground/80",
              location.pathname === "/pricing" ? "text-foreground font-medium" : "text-foreground/60"
            )}
          >
            Pricing
          </Link>
          <Link
            to="/about"
            className={cn(
              "transition-colors hover:text-foreground/80",
              location.pathname === "/about" ? "text-foreground font-medium" : "text-foreground/60"
            )}
          >
            About
          </Link>
        </nav>
        <Button 
          onClick={() => navigate("/auth")}
          variant="outline"
          className="ml-4"
        >
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
      </div>
    );
  }

  const isActive = (path: string) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") {
      return true;
    }
    if (path !== "/dashboard" && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <nav className={cn("flex items-center gap-6 text-sm", className)}>
      <Link
        to="/dashboard"
        className={cn(
          "group flex items-center gap-1 transition-colors hover:text-foreground/80",
          isActive("/dashboard") ? "text-foreground font-medium" : "text-foreground/60"
        )}
      >
        <Home className="h-4 w-4" />
        <span className="group-hover:underline">Dashboard</span>
      </Link>
      <Link
        to="/dashboard/mentions"
        className={cn(
          "group flex items-center gap-1 transition-colors hover:text-foreground/80",
          isActive("/dashboard/mentions") ? "text-foreground font-medium" : "text-foreground/60"
        )}
      >
        <Bell className="h-4 w-4" />
        <span className="group-hover:underline">Mentions</span>
      </Link>
      <Link
        to="/dashboard/engagement"
        className={cn(
          "group flex items-center gap-1 transition-colors hover:text-foreground/80",
          isActive("/dashboard/engagement") ? "text-foreground font-medium" : "text-foreground/60"
        )}
      >
        <MessageSquare className="h-4 w-4" />
        <span className="group-hover:underline">Engagement</span>
      </Link>
      <Link
        to="/dashboard/analytics"
        className={cn(
          "group flex items-center gap-1 transition-colors hover:text-foreground/80",
          isActive("/dashboard/analytics") ? "text-foreground font-medium" : "text-foreground/60"
        )}
      >
        <BarChart className="h-4 w-4" />
        <span className="group-hover:underline">Analytics</span>
      </Link>
      <Link
        to="/dashboard/radar"
        className={cn(
          "group flex items-center gap-1 transition-colors hover:text-foreground/80",
          isActive("/dashboard/radar") ? "text-foreground font-medium" : "text-foreground/60"
        )}
      >
        <Radio className="h-4 w-4" />
        <span className="group-hover:underline">Radar</span>
      </Link>
      <Link
        to="/dashboard/settings"
        className={cn(
          "group flex items-center gap-1 transition-colors hover:text-foreground/80",
          isActive("/dashboard/settings") ? "text-foreground font-medium" : "text-foreground/60"
        )}
      >
        <Settings className="h-4 w-4" />
        <span className="group-hover:underline">Settings</span>
      </Link>
    </nav>
  );
}
