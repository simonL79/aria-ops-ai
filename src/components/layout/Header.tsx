
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/logo';
import { LogIn, LogOut } from 'lucide-react';

interface HeaderProps {
  variant?: 'default' | 'transparent';
}

const Header = ({ variant = 'default' }: HeaderProps) => {
  const { isAuthenticated, signOut } = useAuth();

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      await signOut();
    }
  };

  const headerClass = variant === 'transparent' 
    ? "absolute top-0 z-40 w-full bg-transparent"
    : "sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60";

  return (
    <header className={headerClass}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <Logo variant={variant === 'transparent' ? 'light' : 'default'} size="sm" />
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/about" className="text-sm font-medium hover:text-primary">About</Link>
          <Link to="/blog" className="text-sm font-medium hover:text-primary">Blog</Link>
          <Link to="/simon-lindsay" className="text-sm font-medium hover:text-primary">Simon Lindsay</Link>
          
          {isAuthenticated ? (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleAuthAction}
              className="ml-4 text-sm font-medium"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          ) : (
            <Link to="/admin/login">
              <Button variant="ghost" size="sm" className="ml-4 text-sm font-medium">
                <LogIn className="mr-2 h-4 w-4" />
                Admin Login
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
