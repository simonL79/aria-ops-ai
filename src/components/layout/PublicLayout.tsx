
import React, { ReactNode, useState } from 'react';
import { MainNav } from './MainNav';
import Footer from './Footer';
import MobileNav from './MobileNav';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, Shield } from 'lucide-react';

interface PublicLayoutProps {
  children: ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      await signOut();
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">A.R.I.A.™</span>
            </a>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex flex-1 justify-center">
            <MainNav className="flex-1" />
          </div>
          
          {/* Desktop auth button */}
          <div className="hidden md:flex items-center">
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
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleAuthAction}
                className="ml-4 text-sm font-medium"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile navigation */}
          <MobileNav isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default PublicLayout;
