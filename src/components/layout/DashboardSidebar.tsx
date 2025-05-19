import {
  BarChart3,
  Bell,
  ClipboardList,
  Command,
  Home,
  Search,
  Settings,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Protected } from "@/hooks/useRbac";

interface DashboardSidebarProps {
  className?: string;
}

const DashboardSidebar = ({ className }: DashboardSidebarProps) => {
  const { pathname } = useLocation();
  const { user } = useAuth();

  return (
    <div className={cn("hidden border-r bg-gray-100/40 dark:bg-gray-800/40 h-full flex-col fixed w-[280px] z-50", className)}>
      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="sm" className="w-full">
            <Command className="h-4 w-4 mr-2" />
            Menu
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:w-64">
          <SheetHeader className="text-left">
            <SheetTitle>Dashboard Menu</SheetTitle>
          </SheetHeader>
          <Separator className="my-4" />
          <div className="flex flex-col space-y-1">
            <Link
              to="/dashboard"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 transition-all",
                pathname === "/dashboard"
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-muted"
              )}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/dashboard/command-center"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 transition-all",
                pathname === "/dashboard/command-center"
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-muted"
              )}
            >
              <Search className="h-4 w-4" />
              <span>Command Center</span>
            </Link>
            <Link
              to="/dashboard/mentions"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 transition-all",
                pathname === "/dashboard/mentions"
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-muted"
              )}
            >
              <Bell className="h-4 w-4" />
              <span>Mentions</span>
            </Link>
            <Link
              to="/dashboard/analytics"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 transition-all",
                pathname === "/dashboard/analytics"
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-muted"
              )}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </Link>
            
            {/* Add a new menu item for scan submissions */}
            <Protected roles="admin">
              <Link
                to="/dashboard/scan-submissions"
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 transition-all",
                  pathname === "/dashboard/scan-submissions"
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted"
                )}
              >
                <ClipboardList className="h-4 w-4" />
                <span>Scan Submissions</span>
                <Badge variant="default" className="ml-auto">Admin</Badge>
              </Link>
            </Protected>
            
            <Separator className="my-4" />
            <Link
              to="/clients"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 transition-all",
                pathname === "/clients"
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-muted"
              )}
            >
              <Users className="h-4 w-4" />
              <span>Clients</span>
            </Link>
            <Link
              to="/settings"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 transition-all",
                pathname === "/settings"
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-muted"
              )}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default DashboardSidebar;
