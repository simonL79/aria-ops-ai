
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
    <div className="md:hidden bg-premium-black/95 backdrop-blur-sm">
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
            <a 
              href="#how-it-works" 
              className="block text-white hover:text-premium-silver transition-colors"
              onClick={() => setIsOpen(false)}
            >
              How It Works
            </a>
          </li>
          <li>
            <Link 
              to="/biography" 
              className="block text-white hover:text-premium-silver transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Simon Lindsay
            </Link>
          </li>
          <li className="pt-4">
            <Button asChild className="w-full" onClick={() => setIsOpen(false)}>
              <Link to="/scan" className="text-white">Scan My Name Now</Link>
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MobileMenu;
