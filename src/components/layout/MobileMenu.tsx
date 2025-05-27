
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
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;
  
  return (
    <div className="md:hidden bg-white/95 backdrop-blur-sm border-b border-blue-200 shadow-lg">
      <nav className="container mx-auto px-6 py-4">
        <ul className="space-y-4">
          <li>
            <Link 
              to="/" 
              className="block text-blue-900 hover:text-blue-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className="block text-blue-900 hover:text-blue-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
          </li>
          <li>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="block text-blue-900 hover:text-blue-600 transition-colors text-left w-full"
            >
              How It Works
            </button>
          </li>
          <li>
            <Link 
              to="/simon-lindsay" 
              className="block text-blue-900 hover:text-blue-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Simon Lindsay
            </Link>
          </li>
          <li>
            <Link 
              to="/blog" 
              className="block text-blue-900 hover:text-blue-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
          </li>
          <li>
            <Link 
              to="/resources" 
              className="block text-blue-900 hover:text-blue-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Resources
            </Link>
          </li>
          <li className="pt-4">
            <Button asChild className="w-full bg-blue-600 text-white hover:bg-blue-700" onClick={() => setIsOpen(false)}>
              <Link to="/scan">Scan My Name Now</Link>
            </Button>
          </li>
          <li className="pt-2">
            <Button 
              asChild 
              variant="outline" 
              className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
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
