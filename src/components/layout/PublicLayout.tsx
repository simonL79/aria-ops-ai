
import React, { ReactNode, useState } from 'react';
import { MainNav } from './MainNav';
import Footer from './Footer';
import MobileNav from './MobileNav';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '../ui/button';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogIn, LogOut, Home, Menu, X } from 'lucide-react';
import Logo from '../ui/logo';

interface PublicLayoutProps {
  children: ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      await signOut();
    } else {
      navigate('/admin/login');
    }
  };

  const scrollToServices = () => {
    // If we're on the home page, scroll to services section
    if (location.pathname === '/' || location.pathname === '/sales-funnel') {
      const servicesSection = document.querySelector('#services') || document.querySelector('[data-section="services"]');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we're on another page, navigate to home first then scroll
      navigate('/#services');
    }
  };

  // Check if we're on the home page
  const isHomePage = location.pathname === '/' || location.pathname === '/sales-funnel';

  return (
    <div className="flex min-h-screen flex-col bg-corporate-dark">
      <header className="sticky top-0 z-50 w-full bg-black/95 backdrop-blur border-b border-corporate-border">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/">
                <Logo variant="light" size="lg" className="sm:text-xl aria-logo" />
              </Link>
              
              {/* Show Back to Home link only if not on home page */}
              {!isHomePage && (
                <Link to="/" className="hidden sm:flex items-center gap-2 text-corporate-accent hover:text-orange-400 transition-colors">
                  <Home className="h-4 w-4" />
                  <span className="text-sm">Back to Home</span>
                </Link>
              )}
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <Link to="/blog" className="text-corporate-lightGray hover:text-white transition-colors text-sm lg:text-base">
                Blog
              </Link>
              <Link to="/simon-lindsay" className="text-corporate-lightGray hover:text-white transition-colors text-sm lg:text-base">
                About Simon
              </Link>
              <Link to="/scan" className="text-corporate-lightGray hover:text-white transition-colors text-sm lg:text-base">
                Get Started
              </Link>
              <button 
                onClick={scrollToServices} 
                className="text-corporate-lightGray hover:text-white transition-colors text-sm lg:text-base"
              >
                Services
              </button>
              <Link to="/pricing" className="text-corporate-lightGray hover:text-white transition-colors text-sm lg:text-base">
                Pricing
              </Link>
              {isAuthenticated ? (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleAuthAction}
                  className="ml-4 text-sm font-medium text-corporate-lightGray hover:text-white"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              ) : (
                <Link to="/admin/login">
                  <Button variant="outline" size="sm" className="border-corporate-accent text-corporate-accent hover:bg-corporate-accent hover:text-black text-xs lg:text-sm">
                    <LogIn className="mr-2 h-3 w-3 lg:h-4 lg:w-4" />
                    Admin Login
                  </Button>
                </Link>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-corporate-lightGray p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black/98 backdrop-blur border-t border-corporate-border">
            <nav className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                {!isHomePage && (
                  <Link 
                    to="/" 
                    className="flex items-center gap-2 text-corporate-accent hover:text-orange-400 transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Home className="h-4 w-4" />
                    <span>Back to Home</span>
                  </Link>
                )}
                <Link 
                  to="/blog" 
                  className="text-corporate-lightGray hover:text-white transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link 
                  to="/simon-lindsay" 
                  className="text-corporate-lightGray hover:text-white transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About Simon
                </Link>
                <Link 
                  to="/scan" 
                  className="text-corporate-lightGray hover:text-white transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
                <button 
                  onClick={() => {
                    scrollToServices();
                    setIsMobileMenuOpen(false);
                  }} 
                  className="text-corporate-lightGray hover:text-white transition-colors py-2 text-left"
                >
                  Services
                </button>
                <Link 
                  to="/pricing" 
                  className="text-corporate-lightGray hover:text-white transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                {isAuthenticated ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      handleAuthAction();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-sm font-medium text-corporate-lightGray hover:text-white justify-start px-0"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                ) : (
                  <Link 
                    to="/admin/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="outline" size="sm" className="border-corporate-accent text-corporate-accent hover:bg-corporate-accent hover:text-black w-full justify-start">
                      <LogIn className="mr-2 h-4 w-4" />
                      Admin Login
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
      
      <main className="flex-1 w-full bg-corporate-dark">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default PublicLayout;
