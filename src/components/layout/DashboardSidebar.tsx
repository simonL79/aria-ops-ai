
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Shield, Users, FileText, Mail, MessageSquare, Settings } from "lucide-react";

interface SidebarProps {
  className?: string;
}

const DashboardSidebar = () => {
  const location = useLocation();
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="flex h-full flex-col border-r bg-secondary">
      <div className="flex-1 overflow-y-auto py-6">
        <div className="px-3 py-2">
          <Link
            to="/"
            className="mb-2 flex items-center space-x-2 px-4 text-lg font-semibold tracking-tight"
          >
            <Shield className="mr-2 h-4 w-4" />
            <span>A.R.I.A.</span>
          </Link>
          <div className="space-y-1">
            <Link
              to="/dashboard"
              className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                location.pathname === '/dashboard' ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <div className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </div>
            </Link>
            
            <Link
              to="/admin/genesis-sentinel"
              className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                location.pathname.includes('/admin/genesis-sentinel') ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <div className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                <span>Genesis Sentinel</span>
              </div>
            </Link>

            <Link
              to="/admin/clients"
              className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                location.pathname.includes('/admin/clients') ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                <span>Clients</span>
              </div>
            </Link>

            <Link
              to="/blog"
              className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                location.pathname === '/blog' ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                <span>Blog</span>
              </div>
            </Link>

            <Link
              to="/contact"
              className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                location.pathname === '/contact' ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                <span>Contact</span>
              </div>
            </Link>

            <Link
              to="/admin/settings"
              className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                location.pathname.includes('/admin/settings') ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <div className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
