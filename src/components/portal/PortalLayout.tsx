import { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, ShieldAlert, Sparkles, User, LogOut, Shield, Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const navItems = [
  { to: '/portal', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/portal/reports', label: 'Reports', icon: FileText },
  { to: '/portal/threats', label: 'Threats', icon: ShieldAlert },
  { to: '/portal/findings', label: 'New Findings', icon: Sparkles },
  { to: '/portal/removal', label: 'Removal Request', icon: Send },
  { to: '/portal/account', label: 'Account', icon: User },
];

const PortalLayout = ({ children, title }: { children: ReactNode; title: string }) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-black/80 backdrop-blur-sm flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-orange-500" />
            <div>
              <div className="font-bold tracking-wide">A.R.I.A™</div>
              <div className="text-xs text-white/50 uppercase tracking-widest">Client Portal</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <div className="px-3 py-2 mb-2">
            <div className="text-xs text-white/50">Signed in as</div>
            <div className="text-sm truncate">{user?.email}</div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start text-white/70 hover:text-white hover:bg-white/5"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-white/10 px-8 py-5">
          <h1 className="text-2xl font-semibold">{title}</h1>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default PortalLayout;
