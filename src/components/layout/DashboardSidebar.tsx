
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Settings, Users, AlertTriangle, Shield, Search, BarChart3, Mail, MessageSquare, FileText, Radar, Building, FileBarChart, Brain, Activity, Bell } from "lucide-react";

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
              to="/discovery"
              className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                location.pathname.includes('/discovery') ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <div className="flex items-center">
                <Brain className="mr-2 h-4 w-4" />
                <span>Discovery</span>
              </div>
            </Link>
            <Link
              to="/eidetic"
              className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                location.pathname.includes('/eidetic') ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <div className="flex items-center">
                <Brain className="mr-2 h-4 w-4" />
                <span>EIDETIC™</span>
              </div>
            </Link>
            <Link
              to="/rsi"
              className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                location.pathname.includes('/rsi') ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <div className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                <span>RSI™</span>
              </div>
            </Link>
            <Link
              to="/graveyard"
              className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                location.pathname.includes('/graveyard') ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <div className="flex items-center">
                <Activity className="mr-2 h-4 w-4" />
                <span>Graveyard</span>
              </div>
            </Link>
            <Link
              to="/clients"
              className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                location.pathname.includes('/clients') ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                <span>Client Management</span>
              </div>
            </Link>
            <Link
              to="/employee-risk"
              className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                location.pathname.includes('/employee-risk') ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <div className="flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4" />
                <span>Employee Risk</span>
              </div>
            </Link>
            <Link
              to="/compliance"
              className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                location.pathname.includes('/compliance') ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                <span>Compliance</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
