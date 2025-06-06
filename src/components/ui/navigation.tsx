import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Monitor, Users, Settings, Shield } from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
}

const Navigation = () => {
  const location = useLocation();
  
  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/',
      icon: Home,
      description: 'Overview of system status and key metrics'
    },
    {
      name: 'Monitoring',
      href: '/monitoring',
      icon: Monitor,
      description: 'Real-time monitoring of live data sources'
    },
    {
      name: 'Threats',
      href: '/threats',
      icon: Shield,
      description: 'Live threat intelligence and analysis'
    }
  ];

  const adminNavItems: NavItem[] = [
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
      description: 'Manage user accounts and permissions'
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      description: 'Configure system settings and integrations'
    },
    {
      name: 'System Audit',
      href: '/admin/system-audit',
      icon: Shield,
      description: 'Live data compliance verification'
    }
  ];

  return (
    <div>
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            location.pathname === item.href
              ? 'bg-corporate-accent text-black'
              : 'text-corporate-lightGray hover:text-white hover:bg-corporate-darkSecondary'
          }`}
        >
          <item.icon className="h-4 w-4" />
          {item.name}
        </Link>
      ))}
      {adminNavItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            location.pathname === item.href
              ? 'bg-corporate-accent text-black'
              : 'text-corporate-lightGray hover:text-white hover:bg-corporate-darkSecondary'
          }`}
        >
          <item.icon className="h-4 w-4" />
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export default Navigation;
