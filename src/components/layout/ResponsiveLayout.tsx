
import React from 'react';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children }) => {
  return (
    <div className="responsive-container">
      <div className="responsive-content">
        {children}
      </div>
    </div>
  );
};

export default ResponsiveLayout;
