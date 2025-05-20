
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Settings, Users, AlertTriangle, Shield, Search, BarChart3, Mail, MessageSquare, FileText, Radar, Building } from "lucide-react";

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
            to="/dashboard"
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
              to="/dashboard/monitor"
              className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                location.pathname.includes('/dashboard/monitor') ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <div className="flex items-center">
                <Search className="mr-2 h-4 w-4" />
                <span>Content Monitor</span>
              </div>
            </Link>
            <Link
              to="/dashboard/engagement"
              className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                location.pathname.includes('/dashboard/engagement') ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <div className="flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Engagement Hub</span>
              </div>
            </Link>
            <Link
              to="/dashboard/ai-scraping"
              className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                location.pathname.includes('/dashboard/ai-scraping') ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <div className="flex items-center">
                <Search className="mr-2 h-4 w-4" />
                <span>AI Scraping</span>
              </div>
            </Link>
            <Link
              to="/dashboard"
              className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                location.pathname.includes('/dashboard/seo-center') ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <div className="flex items-center">
                <BarChart3 className="mr-2 h-4 w-4" />
                <span>SEO Center</span>
              </div>
            </Link>
          </div>
        </div>
        
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Intelligence
          </h2>
          <div className="space-y-1">
            <Link
              to="/dashboard"
              className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                location.pathname.includes('/dashboard/intelligence') ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <div className="flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4" />
                <span>Threat Intelligence</span>
              </div>
            </Link>
            
            <Link
              to="/dashboard"
              className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                location.pathname.includes('/dashboard/radar') ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <div className="flex items-center">
                <Radar className="mr-2 h-4 w-4" />
                <span>Reputation Radar</span>
              </div>
            </Link>
          </div>
        </div>
        
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Administration
          </h2>
          <div className="space-y-1">
            <Link
              to="/dashboard"
              className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                location.pathname.includes('/dashboard/new-companies') ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                <span>New Companies</span>
              </div>
            </Link>
            <Link
              to="/dashboard"
              className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                location.pathname.includes('/dashboard/settings') ? 'bg-accent text-accent-foreground' : ''
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
