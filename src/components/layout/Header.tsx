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
    : "sticky top-0 z-40 w-full bg-black/95 backdrop-blur border-b border-gray-800";

  return (
    <header className={headerClass}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          <Link to="/">
            <Logo variant="light" size="xl" />
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
            <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link>
            <Link to="/simon-lindsay" className="text-gray-300 hover:text-white transition-colors">Simon Lindsay</Link>
            
            <Link
              to="/secure-intake"
              className="text-gray-300 hover:text-corporate-accent transition-colors"
            >
              A.R.I.A™ Intake
            </Link>
            
            {isAuthenticated ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleAuthAction}
                className="ml-4 text-sm font-medium text-gray-300 hover:text-white"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <Link to="/admin/login">
                <Button variant="outline" size="sm" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                  <LogIn className="mr-2 h-4 w-4" />
                  Admin Login
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
