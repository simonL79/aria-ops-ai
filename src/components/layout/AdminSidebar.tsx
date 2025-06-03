
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Search, 
  Users, 
  BarChart3, 
  Settings, 
  Globe, 
  Zap,
  Activity,
  Database,
  AlertTriangle,
  Crosshair,
  Eye,
  Brain,
  Target,
  Lock
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const primaryModules = [
    {
      title: 'Genesis Sentinel™',
      href: '/admin/genesis-sentinel',
      icon: Crosshair,
      description: 'Weapons-grade threat detection & entity discovery',
      classification: 'LIVE OSINT'
    },
    {
      title: 'Persona Saturation',
      href: '/admin/persona-saturation',
      icon: Globe,
      description: 'Strategic narrative deployment',
      classification: 'DEPLOYMENT'
    },
    {
      title: 'Watchtower',
      href: '/admin/watchtower',
      icon: Eye,
      description: 'Real-time monitoring & alerting',
      classification: 'MONITORING'
    },
    {
      title: 'Intelligence Core',
      href: '/admin/intelligence-core',
      icon: Brain,
      description: 'Central intelligence processing',
      classification: 'ANALYSIS'
    }
  ];

  const operationalModules = [
    {
      title: 'Admin Dashboard',
      href: '/admin',
      icon: BarChart3,
      description: 'System overview & metrics'
    },
    {
      title: 'Client Management',
      href: '/admin/clients',
      icon: Users,
      description: 'Client entities & campaigns'
    },
    {
      title: 'System Settings',
      href: '/admin/settings',
      icon: Settings,
      description: 'Configuration & preferences'
    }
  ];

  const isActiveRoute = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-corporate-dark border-r border-corporate-border transition-all duration-300",
      collapsed ? "w-16" : "w-72"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-corporate-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h2 className="text-lg font-bold text-white">A.R.I.A™ Command</h2>
              <p className="text-xs text-corporate-lightGray">Live Intelligence Only</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-corporate-lightGray hover:text-white"
          >
            {collapsed ? <Activity className="h-4 w-4" /> : <Target className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        {/* Live Data Status */}
        <div className="mb-6">
          <div className={cn(
            "flex items-center gap-2 p-2 rounded-lg bg-green-900/20 border border-green-500/30",
            collapsed && "justify-center"
          )}>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {!collapsed && (
              <div>
                <p className="text-xs font-medium text-green-400">LIVE DATA ACTIVE</p>
                <p className="text-xs text-green-300">100% Real Intelligence</p>
              </div>
            )}
          </div>
        </div>

        {/* Primary A.R.I.A™ Modules */}
        <div className="space-y-2 mb-6">
          {!collapsed && (
            <div className="flex items-center gap-2 px-2 py-1">
              <Lock className="h-3 w-3 text-corporate-accent" />
              <h3 className="text-xs font-semibold text-corporate-accent uppercase tracking-wider">
                Core Modules
              </h3>
            </div>
          )}
          
          {primaryModules.map((item) => (
            <Link key={item.href} to={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-auto p-3 text-left hover:bg-corporate-darkSecondary",
                  isActiveRoute(item.href) && "bg-corporate-accent text-black hover:bg-corporate-accent/90",
                  collapsed && "px-2 justify-center"
                )}
              >
                <item.icon className={cn("h-4 w-4", collapsed ? "" : "mr-3")} />
                {!collapsed && (
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs opacity-60">{item.classification}</span>
                    </div>
                    <p className="text-xs opacity-70 mt-0.5">{item.description}</p>
                  </div>
                )}
              </Button>
            </Link>
          ))}
        </div>

        <Separator className="bg-corporate-border" />

        {/* Operational Modules */}
        <div className="space-y-2 mt-6">
          {!collapsed && (
            <div className="flex items-center gap-2 px-2 py-1">
              <Settings className="h-3 w-3 text-corporate-lightGray" />
              <h3 className="text-xs font-semibold text-corporate-lightGray uppercase tracking-wider">
                Operations
              </h3>
            </div>
          )}
          
          {operationalModules.map((item) => (
            <Link key={item.href} to={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-auto p-3 text-left hover:bg-corporate-darkSecondary text-corporate-lightGray",
                  isActiveRoute(item.href) && "bg-corporate-accent text-black hover:bg-corporate-accent/90",
                  collapsed && "px-2 justify-center"
                )}
              >
                <item.icon className={cn("h-4 w-4", collapsed ? "" : "mr-3")} />
                {!collapsed && (
                  <div className="flex-1">
                    <span className="font-medium">{item.title}</span>
                    <p className="text-xs opacity-70 mt-0.5">{item.description}</p>
                  </div>
                )}
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-corporate-border">
        {!collapsed && (
          <div className="text-center">
            <p className="text-xs text-corporate-lightGray">A.R.I.A™ v2.0</p>
            <p className="text-xs text-corporate-accent">Weapons Grade Intelligence</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSidebar;
