
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
                  <Link to="/" className={`${navigationMenuTriggerStyle()} transition-colors duration-300 font-medium ${isScrolled ? 'text-white hover:text-premium-silver' : 'text-premium-black hover:text-premium-darkGray'}`}>
                    Home
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/about" className={`${navigationMenuTriggerStyle()} transition-colors duration-300 font-medium ${isScrolled ? 'text-white hover:text-premium-silver' : 'text-premium-black hover:text-premium-darkGray'}`}>
                    About
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <a href="#how-it-works" className={`${navigationMenuTriggerStyle()} transition-colors duration-300 font-medium ${isScrolled ? 'text-white hover:text-premium-silver' : 'text-premium-black hover:text-premium-darkGray'}`}>
                    How It Works
                  </a>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/biography" className={`${navigationMenuTriggerStyle()} transition-colors duration-300 font-medium ${isScrolled ? 'text-white hover:text-premium-silver' : 'text-premium-black hover:text-premium-darkGray'}`}>
                    Simon Lindsay
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            <Button asChild size="sm" className="ml-4">
              <Link to="/scan">Scan My Name Now</Link>
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-premium-black"
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
