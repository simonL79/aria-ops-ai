
import React, { ReactNode } from 'react';
import { MainNav } from './MainNav';
import Footer from './Footer';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut } from 'lucide-react';

interface PublicLayoutProps {
  children: ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      await signOut();
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <a href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold text-xl">A.R.I.A.™</span>
            </a>
          </div>
          <MainNav className="flex-1" />
          <div className="flex items-center">
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
            ) : null}
          </div>
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
