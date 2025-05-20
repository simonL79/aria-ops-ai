import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Settings, Users, AlertTriangle, Shield, Search, BarChart3, Mail, MessageSquare, FileText, Radar } from "lucide-react";

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
              to="/monitor"
              className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                location.pathname === '/monitor' ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <div className="flex items-center">
                <Search className="mr-2 h-4 w-4" />
                <span>Content Monitor</span>
              </div>
            </Link>
            <Link
              to="/engagement"
              className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                location.pathname === '/engagement' ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <div className="flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Engagement Hub</span>
              </div>
            </Link>
            <Link
              to="/seo"
              className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                location.pathname === '/seo' ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <div className="flex items-center">
                <BarChart3 className="mr-2 h-4 w-4" />
                <span>SEO Center</span>
              </div>
            </Link>
            <Link
              to="/outreach"
              className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                location.pathname === '/outreach' ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                <span>Outreach Pipeline</span>
              </div>
            </Link>
            <Link
              to="/reports"
              className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                location.pathname === '/reports' ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                <span>Reporting</span>
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
              to="/dashboard/intelligence"
              className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                location.pathname === '/dashboard/intelligence' ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <div className="flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4" />
                <span>Threat Intelligence</span>
              </div>
            </Link>
            
            <Link
              to="/dashboard/radar"
              className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                location.pathname === '/dashboard/radar' ? 'bg-accent text-accent-foreground' : ''
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
              to="/clients"
              className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                location.pathname === '/clients' ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                <span>Clients</span>
              </div>
            </Link>
            <Link
              to="/settings"
              className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                location.pathname === '/settings' ? 'bg-accent text-accent-foreground' : ''
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
