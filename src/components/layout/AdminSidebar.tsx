
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
  Lock,
  Radar,
  FileText
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const primaryModules = [
    {
      title: 'Control Center',
      href: '/admin/control-center',
      icon: Brain,
      description: 'Unified command interface with entity context',
      classification: 'COMMAND',
      priority: 1,
      isLive: true
    },
    {
      title: 'Client Onboarding',
      href: '/admin/client-onboarding',
      icon: Users,
      description: 'Complete client setup and execution planning',
      classification: 'CORE',
      priority: 2,
      isLive: true
    },
    {
      title: 'A.R.I.A vX™ — Keyword-to-Article System',
      href: '/admin/keyword-to-article',
      icon: Target,
      description: 'Real-time reputation reshaping engine',
      classification: 'LIVE ENGINE',
      isFeature: true,
      priority: 3,
      isLive: true
    },
    {
      title: 'Content Generation Engine',
      href: '/content-generation',
      icon: FileText,
      description: 'Automated threat-driven content creation',
      classification: 'CONTENT',
      priority: 4,
      isLive: true
    },
    {
      title: 'Strategy Brain Test',
      href: '/admin/strategy-brain-test',
      icon: Zap,
      description: 'AI strategy testing & validation',
      classification: 'TESTING',
      priority: 5,
      isLive: true
    },
    {
      title: 'Strategy Brain Stage 3',
      href: '/admin/strategy-brain-stage3',
      icon: Brain,
      description: 'Advanced AI intelligence testing',
      classification: 'ADVANCED',
      priority: 6,
      isLive: true
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

  // Sort primary modules by priority
  const sortedPrimaryModules = [...primaryModules].sort((a, b) => a.priority - b.priority);

  const isActiveRoute = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-corporate-dark border-r border-corporate-border transition-all duration-300 relative z-10",
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
            className="text-corporate-lightGray hover:text-white hover:bg-corporate-darkSecondary shrink-0"
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
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shrink-0" />
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
              <Lock className="h-3 w-3 text-corporate-accent shrink-0" />
              <h3 className="text-xs font-semibold text-corporate-accent uppercase tracking-wider">
                Core Modules
              </h3>
            </div>
          )}
          
          {sortedPrimaryModules.map((item) => (
            <Link key={item.href} to={item.href} className="block">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-auto p-3 text-left hover:bg-corporate-darkSecondary relative z-20",
                  isActiveRoute(item.href) && "bg-corporate-accent text-black hover:bg-corporate-accent/90",
                  collapsed && "px-2 justify-center",
                  item.isFeature && "border border-corporate-accent/30 bg-corporate-accent/5"
                )}
              >
                <item.icon className={cn("h-4 w-4 shrink-0", collapsed ? "" : "mr-3")} />
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={cn("font-medium truncate", item.isFeature && "text-corporate-accent")}>
                        {item.isFeature ? 'A.R.I.A vX™' : item.title}
                      </span>
                      <div className="flex items-center gap-1">
                        {item.isLive && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                        <span className="text-xs opacity-60 shrink-0">{item.classification}</span>
                      </div>
                    </div>
                    <p className="text-xs opacity-70 mt-0.5 truncate">
                      {item.isFeature ? 'Keyword-to-Article System' : item.description}
                    </p>
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
              <Settings className="h-3 w-3 text-corporate-lightGray shrink-0" />
              <h3 className="text-xs font-semibold text-corporate-lightGray uppercase tracking-wider">
                Operations
              </h3>
            </div>
          )}
          
          {operationalModules.map((item) => (
            <Link key={item.href} to={item.href} className="block">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-auto p-3 text-left hover:bg-corporate-darkSecondary text-corporate-lightGray relative z-20",
                  isActiveRoute(item.href) && "bg-corporate-accent text-black hover:bg-corporate-accent/90",
                  collapsed && "px-2 justify-center"
                )}
              >
                <item.icon className={cn("h-4 w-4 shrink-0", collapsed ? "" : "mr-3")} />
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <span className="font-medium block truncate">{item.title}</span>
                    <p className="text-xs opacity-70 mt-0.5 truncate">{item.description}</p>
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
