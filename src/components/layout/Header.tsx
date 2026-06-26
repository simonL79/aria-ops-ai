import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Logo from '@/components/ui/logo';
import { LogIn, LogOut, Menu, Shield } from 'lucide-react';

interface HeaderProps {
  variant?: 'default' | 'transparent';
}

const Header = ({ variant = 'default' }: HeaderProps) => {
  const { isAuthenticated, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      await signOut();
    }
  };

  const headerClass = variant === 'transparent'
    ? "absolute top-0 z-40 w-full bg-transparent"
    : "sticky top-0 z-40 w-full bg-card/95 backdrop-blur border-b border-border";

  const navLinks = [
    { to: '/about', label: 'About' },
    { to: '/services/legal-shield', label: 'Legal Shield', featured: true },
    { to: '/blog', label: 'Blog' },
  ];

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className={headerClass}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          <Link to="/">
            <Logo variant="light" size="xl" />
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={link.featured
                  ? "inline-flex items-center gap-1.5 text-primary font-medium hover:text-primary/80 transition-colors"
                  : "text-muted-foreground hover:text-foreground transition-colors"
                }
              >
                {link.featured && <Shield className="h-4 w-4" />}
                {link.label}
              </Link>
            ))}

            <Link
              to="/secure-intake"
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              A.R.I.A™ Intake
            </Link>

            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAuthAction}
                className="ml-4 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <Link to="/admin/login">
                <Button variant="outline" size="sm" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-foreground">
                  <LogIn className="mr-2 h-4 w-4" />
                  Admin Login
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden text-muted-foreground p-2" aria-label="Open menu">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-card border-border p-6">
              <div className="flex flex-col h-full">
                <Link to="/" onClick={closeMobile} className="mb-8">
                  <Logo variant="light" size="lg" />
                </Link>

                <nav className="flex flex-col space-y-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={closeMobile}
                      className={link.featured
                        ? "inline-flex items-center gap-2 text-lg text-primary font-medium hover:text-primary/80 transition-colors"
                        : "text-lg text-muted-foreground hover:text-foreground transition-colors"
                      }
                    >
                      {link.featured && <Shield className="h-5 w-5" />}
                      {link.label}
                    </Link>
                  ))}

                  <Link
                    to="/secure-intake"
                    onClick={closeMobile}
                    className="text-lg text-muted-foreground hover:text-accent transition-colors"
                  >
                    A.R.I.A™ Intake
                  </Link>
                </nav>

                <div className="mt-auto pt-8">
                  {isAuthenticated ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleAuthAction}
                      className="w-full text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  ) : (
                    <Link to="/admin/login" onClick={closeMobile}>
                      <Button variant="outline" size="sm" className="w-full border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-foreground">
                        <LogIn className="mr-2 h-4 w-4" />
                        Admin Login
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
