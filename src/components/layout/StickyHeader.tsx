
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Logo from '@/components/ui/logo';
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import MobileMenu from './MobileMenu';

interface StickyHeaderProps {
  isScrolled: boolean;
}

const StickyHeader = ({ isScrolled }: StickyHeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-premium-black/90 shadow-lg backdrop-blur-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center">
            <Logo variant={isScrolled ? "light" : "default"} size="lg" />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/" className={`${navigationMenuTriggerStyle()} font-medium transition-colors duration-300 ${isScrolled ? 'text-white hover:text-premium-silver' : 'text-premium-black hover:text-premium-darkGray'}`}>
                    Home
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/about" className={`${navigationMenuTriggerStyle()} font-medium transition-colors duration-300 ${isScrolled ? 'text-white hover:text-premium-silver' : 'text-premium-black hover:text-premium-darkGray'}`}>
                    About
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/how-it-works" className={`${navigationMenuTriggerStyle()} font-medium transition-colors duration-300 ${isScrolled ? 'text-white hover:text-premium-silver' : 'text-premium-black hover:text-premium-darkGray'}`}>
                    How It Works
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/simon-lindsay" className={`${navigationMenuTriggerStyle()} font-medium transition-colors duration-300 ${isScrolled ? 'text-white hover:text-premium-silver' : 'text-premium-black hover:text-premium-darkGray'}`}>
                    Simon Lindsay
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/blog" className={`${navigationMenuTriggerStyle()} font-medium transition-colors duration-300 ${isScrolled ? 'text-white hover:text-premium-silver' : 'text-premium-black hover:text-premium-darkGray'}`}>
                    Blog
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            <Button asChild size="sm" className="ml-4 bg-primary text-white hover:bg-primary/90">
              <Link to="/scan">Scan My Name Now</Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className={`ml-2 ${isScrolled 
                ? 'border-white text-white hover:bg-white hover:text-premium-black' 
                : 'border-premium-black text-premium-black hover:bg-premium-black hover:text-white'}`}
              onClick={() => navigate("/auth")}
            >
              Login
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className={`h-6 w-6 transition-colors duration-300 ${isScrolled ? 'text-white' : 'text-premium-black'}`} />
            ) : (
              <Menu className={`h-6 w-6 transition-colors duration-300 ${isScrolled ? 'text-white' : 'text-premium-black'}`} />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        setIsOpen={setMobileMenuOpen} 
        isScrolled={isScrolled} 
      />
    </header>
  );
};

export default StickyHeader;
