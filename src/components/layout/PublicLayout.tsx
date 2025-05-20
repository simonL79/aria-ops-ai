
import React, { ReactNode } from 'react';
import StickyHeader from './StickyHeader';
import Footer from './Footer';

interface PublicLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

const PublicLayout = ({ 
  children, 
  showHeader = true, 
  showFooter = true,
  className = "min-h-screen bg-white"
}: PublicLayoutProps) => {
  return (
    <div className={className}>
      {showHeader && <StickyHeader isScrolled={true} />}
      
      <main className="pt-16">
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
};

export default PublicLayout;
