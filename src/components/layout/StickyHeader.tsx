
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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-white/95 shadow-lg backdrop-blur-sm border-b border-blue-200' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center">
            <Logo variant={isScrolled ? "default" : "default"} size="md" />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/" className={`${navigationMenuTriggerStyle()} font-medium transition-colors duration-300 ${isScrolled ? 'text-blue-900 hover:text-blue-600' : 'text-blue-900 hover:text-blue-600'}`}>
                    Home
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/about" className={`${navigationMenuTriggerStyle()} font-medium transition-colors duration-300 ${isScrolled ? 'text-blue-900 hover:text-blue-600' : 'text-blue-900 hover:text-blue-600'}`}>
                    About
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <button 
                    onClick={() => scrollToSection('how-it-works')}
                    className={`${navigationMenuTriggerStyle()} font-medium transition-colors duration-300 ${isScrolled ? 'text-blue-900 hover:text-blue-600' : 'text-blue-900 hover:text-blue-600'}`}
                  >
                    How It Works
                  </button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/simon-lindsay" className={`${navigationMenuTriggerStyle()} font-medium transition-colors duration-300 ${isScrolled ? 'text-blue-900 hover:text-blue-600' : 'text-blue-900 hover:text-blue-600'}`}>
                    Simon Lindsay
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/blog" className={`${navigationMenuTriggerStyle()} font-medium transition-colors duration-300 ${isScrolled ? 'text-blue-900 hover:text-blue-600' : 'text-blue-900 hover:text-blue-600'}`}>
                    Blog
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            <Button asChild size="sm" className="ml-4 bg-blue-600 text-white hover:bg-blue-700">
              <Link to="/scan">Scan My Name Now</Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className={`ml-2 ${isScrolled 
                ? 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white' 
                : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
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
              <X className={`h-6 w-6 transition-colors duration-300 ${isScrolled ? 'text-blue-900' : 'text-blue-900'}`} />
            ) : (
              <Menu className={`h-6 w-6 transition-colors duration-300 ${isScrolled ? 'text-blue-900' : 'text-blue-900'}`} />
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
