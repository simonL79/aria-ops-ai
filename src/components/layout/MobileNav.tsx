
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const MobileNav = ({ isOpen, setIsOpen }: MobileNavProps) => {
  const { isAuthenticated, signOut } = useAuth();

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-bold">A.R.I.A.™</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="p-4">
              <div className="space-y-4">
                <Link
                  to="/"
                  className="block text-lg font-medium hover:text-primary transition-colors"
                  onClick={handleLinkClick}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="block text-lg font-medium hover:text-primary transition-colors"
                  onClick={handleLinkClick}
                >
                  About
                </Link>
                <Link
                  to="/scan"
                  className="block text-lg font-medium hover:text-primary transition-colors"
                  onClick={handleLinkClick}
                >
                  Submit a Concern
                </Link>
                <Link
                  to="/contact"
                  className="block text-lg font-medium hover:text-primary transition-colors"
                  onClick={handleLinkClick}
                >
                  Contact
                </Link>
                
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="block text-lg font-medium hover:text-primary transition-colors"
                      onClick={handleLinkClick}
                    >
                      Dashboard
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    onClick={handleLinkClick}
                  >
                    <Button variant="default" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;
