
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Menu, X, ArrowLeft } from 'lucide-react';

interface PublicHeaderProps {
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonPath?: string;
}

const PublicHeader = ({ showBackButton = false, backButtonText = "Back to Home", backButtonPath = "/" }: PublicHeaderProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAdminAccess = () => {
    if (isAuthenticated && isAdmin) {
      navigate('/dashboard');
    } else {
      navigate('/admin/login');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800/50 bg-[#0A0B0D]/95 backdrop-blur">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Link to={backButtonPath} className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors mr-4">
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">{backButtonText}</span>
              </Link>
            )}
            <Link to="/">
              <img 
                src="/lovable-uploads/37370275-bf62-4eab-b0e3-e184ce3fa142.png" 
                alt="A.R.I.A Logo" 
                className="h-12 w-auto"
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link>
            <Link to="/simon-lindsay" className="text-gray-300 hover:text-white transition-colors">About Simon</Link>
            <Link to="/scan" className="text-gray-300 hover:text-white transition-colors">Get Started</Link>
            <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">Services</Link>
            <Button
              onClick={handleAdminAccess}
              variant="outline"
              className="border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-black"
            >
              {isAuthenticated && isAdmin ? 'Dashboard' : 'Admin Login'}
            </Button>
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800/50 py-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/blog" className="text-gray-300 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
              <Link to="/simon-lindsay" className="text-gray-300 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>About Simon</Link>
              <Link to="/scan" className="text-gray-300 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
              <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Services</Link>
              <Button
                onClick={() => {
                  handleAdminAccess();
                  setMobileMenuOpen(false);
                }}
                variant="outline"
                className="border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-black w-full"
              >
                {isAuthenticated && isAdmin ? 'Dashboard' : 'Admin Login'}
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default PublicHeader;
