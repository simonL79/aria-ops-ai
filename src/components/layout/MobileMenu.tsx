
import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isScrolled: boolean;
}

const MobileMenu = ({ isOpen, setIsOpen, isScrolled }: MobileMenuProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="md:hidden bg-premium-black/95 backdrop-blur-sm fixed top-16 left-0 right-0 z-50">
      <nav className="container mx-auto px-6 py-4">
        <ul className="space-y-4">
          <li>
            <Link 
              to="/" 
              className="block text-white hover:text-premium-silver transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className="block text-white hover:text-premium-silver transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
          </li>
          <li>
            <Link 
              to="/how-it-works" 
              className="block text-white hover:text-premium-silver transition-colors"
              onClick={() => setIsOpen(false)}
            >
              How It Works
            </Link>
          </li>
          <li>
            <Link 
              to="/simon-lindsay" 
              className="block text-white hover:text-premium-silver transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Simon Lindsay
            </Link>
          </li>
          <li>
            <Link 
              to="/blog" 
              className="block text-white hover:text-premium-silver transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
          </li>
          <li>
            <Link 
              to="/resources" 
              className="block text-white hover:text-premium-silver transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Resources
            </Link>
          </li>
          <li className="pt-4">
            <Button asChild className="w-full bg-primary text-white hover:bg-primary/90" onClick={() => setIsOpen(false)}>
              <Link to="/scan">Scan My Name Now</Link>
            </Button>
          </li>
          <li className="pt-2">
            <Button 
              asChild 
              variant="outline" 
              className="w-full border-white text-white hover:bg-white hover:text-premium-black"
              onClick={() => setIsOpen(false)}
            >
              <Link to="/auth">Login</Link>
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MobileMenu;
