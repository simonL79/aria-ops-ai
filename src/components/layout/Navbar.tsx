
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Search, 
  Activity, 
  Brain, 
  FileText,
  Users,
  Settings,
  Zap
} from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { 
      name: 'Intelligence', 
      path: '/', 
      icon: Shield,
      description: 'Main dashboard and threat overview'
    },
    { 
      name: 'Discovery', 
      path: '/discovery', 
      icon: Search,
      description: 'AI-powered threat discovery engine'
    },
    { 
      name: 'AI Scraping', 
      path: '/ai-scraping', 
      icon: Activity,
      description: 'Real-time monitoring and scanning'
    },
    { 
      name: 'Engagement Hub', 
      path: '/engagement-hub', 
      icon: Users,
      description: 'Response management and communications'
    },
    { 
      name: 'Executive Reports', 
      path: '/executive-reports', 
      icon: FileText,
      description: 'Strategic intelligence briefings'
    },
    { 
      name: 'Threat Intelligence', 
      path: '/threat-intelligence', 
      icon: Brain,
      description: 'Advanced analysis and prediction'
    }
  ];

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              ARIA™ Intelligence
            </span>
          </Link>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  title={item.description}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          
          <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">Live Monitoring</span>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden mt-4">
        <div className="grid grid-cols-2 gap-2">
          {navItems.slice(0, 6).map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
