
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Activity, 
  Shield, 
  Eye, 
  Search, 
  Settings, 
  LogOut,
  BarChart3,
  Terminal,
  MessageSquare,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, isAdmin } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Shield, label: 'A.R.I.A™ SIGMA', path: '/dashboard/sigma' },
    { icon: Activity, label: 'Intelligence', path: '/dashboard/intelligence' },
    { icon: Eye, label: 'Monitoring', path: '/dashboard/monitoring' },
    { icon: Search, label: 'Mentions', path: '/dashboard/mentions' },
    { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics' },
    { icon: MessageSquare, label: 'Command Center', path: '/dashboard/command-center' },
    { icon: Terminal, label: 'Ghost Protocol', path: '/dashboard/operator-console' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="bg-white border-r border-gray-200 w-64 min-h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900">A.R.I.A™</h1>
        <p className="text-sm text-gray-600">Intelligence Platform</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Button
              key={item.path}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start gap-2 ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => navigate(item.path)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-gray-700 hover:bg-gray-100"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
