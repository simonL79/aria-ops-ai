
import React, { ReactNode, useState } from 'react';
import { MainNav } from './MainNav';
import Footer from './Footer';
import MobileNav from './MobileNav';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '../ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, LogOut } from 'lucide-react';
import Logo from '../ui/logo';

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
      navigate('/admin/login');
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full bg-black/95 backdrop-blur border-b border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <Link to="/">
              <Logo variant="light" size="xl" />
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">
                Blog
              </Link>
              <Link to="/simon-lindsay" className="text-gray-300 hover:text-white transition-colors">
                About Simon
              </Link>
              <Link to="/scan" className="text-gray-300 hover:text-white transition-colors">
                Get Started
              </Link>
              <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">
                Services
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
            <button 
              className="md:hidden text-gray-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
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
