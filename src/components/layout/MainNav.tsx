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
  LogIn,
  Calendar,
  BookOpen
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";

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
          <Link
            to="/blog"
            className={cn(
              "transition-colors hover:text-foreground/80",
              location.pathname.startsWith("/blog") ? "text-foreground font-medium" : "text-foreground/60"
            )}
          >
            <span className="flex items-center">
              <BookOpen className="mr-1 h-4 w-4" />
              Blog
            </span>
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
        to="/calendar"
        className={cn(
          "group flex items-center gap-1 transition-colors hover:text-foreground/80",
          location.pathname === "/calendar" ? "text-foreground font-medium" : "text-foreground/60"
        )}
      >
        <Calendar className="h-4 w-4" />
        <span className="group-hover:underline">Calendar</span>
      </Link>
      <Link
        to="/blog"
        className={cn(
          "group flex items-center gap-1 transition-colors hover:text-foreground/80",
          location.pathname.startsWith("/blog") ? "text-foreground font-medium" : "text-foreground/60"
        )}
      >
        <BookOpen className="h-4 w-4" />
        <span className="group-hover:underline">Blog</span>
      </Link>
      <Link
        to="/settings"
        className={cn(
          "group flex items-center gap-1 transition-colors hover:text-foreground/80",
          isActive("/settings") ? "text-foreground font-medium" : "text-foreground/60"
        )}
      >
        <Settings className="h-4 w-4" />
        <span className="group-hover:underline">Settings</span>
      </Link>
      <NavigationMenuLink asChild>
        <Link
          to="/intelligence"
          className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
        >
          Intelligence
        </Link>
      </NavigationMenuLink>
    </nav>
  );
}
